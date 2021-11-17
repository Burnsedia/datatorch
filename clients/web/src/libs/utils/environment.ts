import process from 'process'

const development: boolean =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

export const isDev = () => development

export const TOKEN_SECRET = process.env.TOKEN_SECRET ?? 'token_default'
export const COOKIE_SECRET = process.env.COOKIE_SECRET ?? 'cookie_default'
