import { NextPage } from 'next'
import { AppProps } from 'next/app'

import { ChakraProvider } from '@chakra-ui/react'

import { theme } from '@/theme'
import { initApollo } from '@/libs/apollo'
import { ApolloProvider } from '@apollo/client'
// import '@/applets/annotator/layout/golden-layout.scss'

export const client = initApollo()

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default App
