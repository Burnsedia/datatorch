import { useMemo } from 'react'
import { GetServerSidePropsContext } from 'next'
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  split
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'

const createHttpLink = (uri: string) =>
  new HttpLink({
    uri,
    credentials: 'include'
  })
const createWebsocketLink = (uri: string) =>
  new WebSocketLink({ uri, options: { reconnect: true } })

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createHttpLinkWithSubscriptions = (uri: string) => {
  const httpLink = createHttpLink(uri)
  const wsLink = createWebsocketLink(uri)

  return split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )
}

export const createApollo = () => {
  // const apiEndpoint = `/api/graphql`
  // const fqdn = process.browser
  //   ? location.origin
  //   : (process.env.FQDN ?? 'http://localhost:4000/api/graphql').trim()
  const fqdn = 'http://localhost:4000/api/graphql'

  const createLink = createHttpLink
  return new ApolloClient({
    uri: fqdn,
    link: createLink(fqdn),
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache()
  })
}

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null

export const initApollo = <T = NormalizedCacheObject>(
  ctx?: GetServerSidePropsContext,
  initialState?: T
) => {
  const _apolloClient = apolloClient ?? createApollo()

  if (initialState) {
    const existingCache = _apolloClient.extract()
    _apolloClient.cache.restore({ ...existingCache, ...initialState })
  }

  if (!process.browser) return _apolloClient
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export const useApollo = <T = NormalizedCacheObject>(initState: T) => {
  return useMemo(() => initApollo<T>(null, initState), [initState])
}
