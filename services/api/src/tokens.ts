import { FastifyReply, onRequestAsyncHookHandler } from 'fastify'
import { FastifyDecoratedRequest } from './context'
import { TOKEN_SECRET } from './context'
import { sign, verify } from 'jsonwebtoken'
import { addDays, addHours, addMinutes } from 'date-fns'
import { Role, PrismaClient } from '@prisma/client'

export type UserData = {
  userId: string
  siteRole: Role
  email: string
  login: string
  count: number
  remember: boolean
}

// Two different types of payloads for refresh and access tokens
export enum AuthAction {
  LOGIN,
  REGISTER
}
type AccessData = Pick<
  UserData,
  'userId' | 'siteRole' | 'email' | 'login' | 'count' | 'remember'
>
type RefreshData = Pick<UserData, 'userId' | 'remember' | 'count'>

/**
 * Helper function that signs our tokens
 * @param userOptions the data to be signed, a subset of user info
 * @param expiresIn the expiry to be set on the token
 * @returns a string representing the signed token
 */
function createToken(userOptions: AccessData | RefreshData, expiresIn: string) {
  return sign(userOptions, TOKEN_SECRET, {
    expiresIn
  })
}

/**
 * Helper funtion that sets our cookies, using fastify-cookie
 * @param reply the Fastify Reply object
 * @param name the cookie name to be set
 * @param token the token that represents our user session
 * @param expires the expiry to be set on the cookie, usually the same as the internal token
 */
function setCookie(
  reply: FastifyReply,
  name: string,
  token: string,
  expires: Date
): void {
  reply.setCookie(name, token, {
    expires,
    httpOnly: true,
    secure: true,
    signed: true,
    path: '/',
    sameSite: 'strict'
  })
}

/**
 * Primary function for issuing user sessions to the browser.
 * Will set cookies in the browser and also return the authorization
 * payload for APIs to consume.
 * @param reply The Fastify reply object
 * @param userData The user data to be added to the user session
 * @param authAction A string representing a login or registration action.
 * @returns an AuthPayload containing both refresh and acccess tokens and the user's id
 */
export function issueTokens(
  reply: FastifyReply,
  userData: UserData,
  authAction: AuthAction
): { refreshToken: string; accessToken: string; userId: string } {
  let expiresIn: string, expires: Date
  const { remember } = userData
  if (authAction === AuthAction.LOGIN) {
    if (remember) {
      expiresIn = '30d'
      expires = addDays(new Date(), 30)
    } else {
      expiresIn = '4h'
      expires = addHours(new Date(), 4)
    }
  } else {
    // expiry for registration
    expiresIn = '7d'
    expires = addDays(new Date(), 7)
  }

  const { userId, login, email, siteRole, count } = userData

  const refreshData: RefreshData = {
    userId,
    remember,
    count
  }
  const refreshToken = createToken(refreshData, expiresIn)

  const accessData: AccessData = {
    userId,
    login,
    email,
    siteRole,
    count,
    remember
  }
  const accessToken = createToken(accessData, '15min')

  setCookie(reply, 'refresh-token', refreshToken, expires)
  setCookie(reply, 'access-token', accessToken, addMinutes(new Date(), 15))
  return { refreshToken, accessToken, userId }
}

/**
 * Hook that should be run before every API request in order to
 * transform cookies, if present, into usable info available in
 * the request.
 * @param request the request object from fastify
 * @param reply the reply object from fastify
 */
export async function tokenHook(
  request: FastifyDecoratedRequest,
  reply: FastifyReply
): Promise<onRequestAsyncHookHandler> {
  // retrieve tokens from the request
  const signedRefreshToken = request.cookies['refresh-token']
  const signedAccessToken = request.cookies['access-token']
  // if we don't find any tokens, return
  if (!signedRefreshToken && !signedAccessToken) {
    return
  }

  // if we have a valid access token, use the data inside.
  try {
    // check if the signature is valid
    const { valid, value: accessToken } =
      request.unsignCookie(signedAccessToken)

    if (!valid) return

    const data = verify(accessToken, TOKEN_SECRET) as AccessData
    request.user = data
    return
  } catch {}

  // if we don't have a valid access token, check the validity of our
  // refresh token.
  try {
    // check if the signature is valid

    const { valid, value } = request.unsignCookie(signedRefreshToken)
    if (!valid) return
    const data = verify(value, TOKEN_SECRET) as RefreshData

    // retrieve the credentials from the server
    const prisma = new PrismaClient()
    const userCredentials = await prisma.userCredentials.findUnique({
      where: { projectOwnerId: data.userId },
      include: { projectOwner: true }
    })

    // if the refresh token has been invalidated server-side, return
    if (!userCredentials || userCredentials.count !== data.count) return

    const {
      email,
      login,
      projectOwner: { role: siteRole }
    } = userCredentials
    const { userId, count, remember } = data
    // reissue tokens
    const userData = {
      userId,
      siteRole,
      email,
      login,
      count,
      remember
    }
    issueTokens(reply, userData, AuthAction.LOGIN)
    request.user = userData
  } catch {}

  return
}
