import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'
import { theme } from '@/theme'

class AppDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="/icon/favicon.ico" type="image/x-icon" />
        </Head>
        <body style={{ overflow: 'hidden' }}>
          {/* <body> */}
          {/* Make Color mode to persists when you refresh the page. */}
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default AppDocument
