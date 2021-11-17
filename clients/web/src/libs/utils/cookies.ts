import { GetServerSidePropsContext } from 'next'
import { TOKEN_SECRET, COOKIE_SECRET } from './environment'
import cookie from 'cookie-signature'
import { verify } from 'jsonwebtoken'
import { Role } from '@/generated/graphql'
import { client } from '@/pages/_app'
import { gql } from '@apollo/client'

export type UserData = {
  userId: string
  siteRole: Role
  email: string
  login: string
  count: number
  remember: boolean
}

type AccessData = Pick<
  UserData,
  'userId' | 'siteRole' | 'email' | 'login' | 'count' | 'remember'
>

const viewerQuery = gql`
  query Viewer {
    viewer {
      login
      authPayload {
        accessToken
        refreshToken
      }
    }
  }
`

/**
 * Helper function to redirect to the login page.
 * @param res The response object for Nextjs
 */
export function redirectToLogin(res) {
  res.statusCode = 302
  res.setHeader('Location', '/login')
  res.end()
}

/**
 * Helper function that makes the API call to viewer in order to get reissued tokens.
 * @param req The request object for Nextjs
 * @param res The response object for Nextjs
 * @returns AccessData payload
 */
async function verifyRefreshAndReissue(req, res, redirect=true) {
  try{
    const { data } = await client.query({
      query: viewerQuery,
      context: {
        headers: {
          Cookie: `refresh-token=${req.cookies['refresh-token']}`
        }
      }
    })

    // reissue both access and refresh tokens
    const accessToken = data.viewer.authPayload.accessToken
    const refreshToken = data.viewer.authPayload.refreshToken
    const signedAccessToken = cookie.sign(accessToken, COOKIE_SECRET)
    const signedRefreshToken = cookie.sign(refreshToken, COOKIE_SECRET)

    res.setHeader('set-cookie', [
      `access-token=${signedAccessToken}; Path=/; HttpOnly; Secure; SameSite=Strict`,
      `refresh-token=${signedRefreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict`
    ])
    const accessData = verify(accessToken, TOKEN_SECRET) as AccessData
    return accessData
  } catch (e) {
    if (redirect) return redirectToLogin(res)
    else return {} as AccessData
  }
}

/**
 * Helper function that verifies access tokens in the case both access and refresh are present.
 * @param req The request object for Nextjs
 * @returns
 */
function verifyAccessToken(req, res) {
  const accessToken = req.cookies['access-token']
  try {
    const token = cookie.unsign(accessToken, COOKIE_SECRET)
    if (!token) return verifyRefreshAndReissue(req, res)
    const accessData = verify(token, TOKEN_SECRET) as AccessData
    return accessData
  } catch {
    return verifyRefreshAndReissue(req, res)
  }
}

/**
 * Server-side function to check for cookies before rendering the page. Also
 * manages keeping cookies up-to-date when not making API calls client-side.
 * @param req The request object for Nextjs
 * @param res The response object for Nextjs
 * @param redirect Set to false to check without redirecting
 * @returns either void if redirected or an AccessData payload
 */
export const cookieChecker = async ({
  req,
  res
}: GetServerSidePropsContext,redirect=true) => {
    if (!req.cookies['refresh-token'] && redirect) {
      redirectToLogin(res)
    } else if (!req.cookies['access-token']) {
      return verifyRefreshAndReissue(req, res, redirect)
    } else {
      return verifyAccessToken(req, res)
    }
}
