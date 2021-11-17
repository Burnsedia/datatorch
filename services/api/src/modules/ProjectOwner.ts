import {
  booleanArg,
  enumType,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg
} from 'nexus'

import { ProjectOwner, Profile, Role, ProjectOwnerType } from 'nexus-prisma'
import argon2 from 'argon2'
import { issueTokens, AuthAction } from '@api/tokens'
import { ApolloError } from 'apollo-server-core'

/**
 * The core user of the application. Contains all info necessary to interact
 * with the application needing authorization. Independent of the UserCredential
 * model which is internal to the server and is not exposed.
 */
export const projectOwner = objectType({
  name: ProjectOwner.$name,
  description: ProjectOwner.$description,
  definition(t) {
    t.id(ProjectOwner.id.name, ProjectOwner.id)
    t.string(ProjectOwner.name.name, ProjectOwner.name)
    t.dateTime(ProjectOwner.createdAt.name, ProjectOwner.createdAt)
    t.dateTime(ProjectOwner.updatedAt.name, ProjectOwner.updatedAt)
    t.dateTime(ProjectOwner.lastSeenAt.name, ProjectOwner.lastSeenAt)
    t.boolean(ProjectOwner.disabled.name, ProjectOwner.disabled)
    t.field(ProjectOwner.type.name, ProjectOwner.type)
    t.field(ProjectOwner.role.name, ProjectOwner.role)
  }
})

/**
 * Decorative information that is used for
 * populating a user's profile.
 */
export const profile = objectType({
  name: Profile.$name,
  description: Profile.$description,
  definition(t) {
    t.id(Profile.id.name, Profile.id)
    t.string(Profile.publicEmail.name, Profile.publicEmail)
    t.string(Profile.company.name, Profile.company)
    t.string(Profile.avatarUrl.name, Profile.avatarUrl)
    t.string(Profile.websiteUrl.name, Profile.websiteUrl)
    t.string(Profile.description.name, Profile.description)
    t.string(Profile.location.name, Profile.location)
    t.string(Profile.githubId.name, Profile.githubId)
    t.string(Profile.facebookId.name, Profile.facebookId)
    t.string(Profile.twitterId.name, Profile.twitterId)
  }
})

export const role = enumType({
  name: Role.name,
  members: Role.members
})

export const projectOwnerType = enumType({
  name: ProjectOwnerType.name,
  members: ProjectOwnerType.members
})

export const AuthPayload = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.string('accessToken')
    t.string('refreshToken')
    t.string('userId')
  }
})

export const ViewerPayload = objectType({
  name: 'ViewerPayload',
  definition(t) {
    t.string('login')
    t.string('email')
    t.string('userId')
    t.string('siteRole')
    t.field('authPayload', {
      type: 'AuthPayload'
    })
  }
})

export const projectOwnerQuery = queryField('projectOwner', {
  type: ProjectOwner.$name,
  args: {
    id: nonNull(stringArg())
  },
  resolve(_root, args, ctx) {
    return ctx.db.projectOwner.findUnique({where: args})
  }
})

/**
 * For debugging only, gets all project owners
 */
export const projectOwnersQuery = queryField('projectOwners', {
  type: list(ProjectOwner.$name),
  resolve(_root, args, ctx) {
    return ctx.db.projectOwner.findMany()
  }
})



/**
 * Returns the user data from the user field on the request if logged in.
 */
export const viewerQuery = queryField('viewer', {
  type: 'ViewerPayload',
  resolve(_root, _, ctx) {
    const user = ctx.request.user
    if (!user) throw new ApolloError('User not logged in.')
    const { login, email, userId, siteRole } = user
    const authPayload = issueTokens(ctx.reply, user, AuthAction.LOGIN)

    return { login, email, userId, siteRole, authPayload }
  }
})

/**
 * Registration for project owners.
 */
export const register = mutationField('register', {
  type: 'AuthPayload',
  args: {
    email: nonNull(stringArg()),
    login: nonNull(stringArg()),
    name: stringArg(),
    password: nonNull(stringArg())
  },
  async resolve(_root, args, ctx) {
    const hashedPassword = await argon2.hash(args.password)
    try {
      const projectOwner = await ctx.db.projectOwner.create({
        data: {
          type: 'USER',
          userCredentials: {
            create: {
              email: args.email,
              login: args.login,
              password: hashedPassword
            }
          },
          name: args.login
        }
      })

      const userData = {
        userId: projectOwner.id,
        siteRole: projectOwner.role,
        email: args.email,
        login: args.login,
        remember: false,
        count: 0
      }

      const authPayload = issueTokens(ctx.reply, userData, AuthAction.REGISTER)
      return authPayload
    } catch (e) {
      throw new ApolloError('Registration failed.')
    }
  }
})

/**
 * Login for project owners.
 */
export const login = mutationField('login', {
  type: 'AuthPayload',
  args: {
    login: nonNull(stringArg()),
    password: nonNull(stringArg()),
    remember: nonNull(booleanArg())
  },
  async resolve(_root, args, ctx) {
    // check for existing credentials
    const userCredentials = await ctx.db.userCredentials.findUnique({
      where: { login: args.login },
      include: { projectOwner: true }
    })
    if (!userCredentials) throw new ApolloError('Invalid credentials.')

    // check for valid password
    const valid = await argon2.verify(userCredentials.password, args.password)
    if (!valid) throw new ApolloError('Invalid credentials.')

    const userData = {
      userId: userCredentials.projectOwnerId,
      siteRole: userCredentials.projectOwner.role,
      email: userCredentials.email,
      login: userCredentials.login,
      count: userCredentials.count,
      remember: args.remember
    }
    const authPayload = issueTokens(ctx.reply, userData, AuthAction.LOGIN)

    return authPayload
  }
})

/**
 * Remove and invalidates all tokens.
 * Cookies are cleared and count is incremented.
 */
export const logout = mutationField('logout', {
  type: 'Boolean',
  async resolve(_root, _args, ctx) {
    try {
      const userCredentials = ctx.db.userCredentials
      const user = await userCredentials.findUnique({
        where: { id: ctx.request.user.userId }
      })
      await userCredentials.update({
        where: { id: ctx.request.user.userId },
        data: { count: user.count + 1 }
      })
    } catch {
    } finally {
      // clear cookies regardless of success.
      ctx.reply.clearCookie('refresh-token', { path: '/' })
      ctx.reply.clearCookie('access-token', { path: '/' })
    }
    return true
  }
})
