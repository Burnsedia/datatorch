const { env } = process

/**
 * Currently in development mode.
 */
export const IS_DEV = (env.NODE_ENV ?? 'development') === 'development'

/**
 * Port to run services on.
 */
export const PORT = parseInt(env.PORT ?? '4000')

/**
 * Url to access graphql.
 */
export const GRAPHQL_ENDPOINT = env.GRAPHQL_ENDPOINT ?? '/api/graphql'

export const FRONTEND_ENDPOINT =
  env.FRONTEND_ENDPOINT ?? 'http://localhost:3000'
