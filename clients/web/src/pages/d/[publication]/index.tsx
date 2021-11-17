import { Box, Container, Flex } from '@chakra-ui/react'
import React, { useMemo, useReducer } from 'react'
import DiscussionToolbar from './DiscussionToolbar'
import { cookieChecker, redirectToLogin } from '@/libs/utils/cookies'
import { GetServerSidePropsContext, NextPage } from 'next'
import { DiscussionLayout } from '../DiscussionLayout'
import {
  DiscussionPageContext,
  discussionPageContextDefaults,
  discussionPageContextReducer
} from '../DiscussionContext'
import PublicationFeed from './PublicationFeed'
import { IndexProps } from '@/pages/home'

const DiscussionPage: NextPage<IndexProps> = ({ user }) => {
  const [context, dispatch] = useReducer(discussionPageContextReducer, {
    ...discussionPageContextDefaults,
    loggedInUsername: user.login
  })

  const memodContext = useMemo(() => {
    return { ...context, dispatch }
  }, [context, dispatch])

  return (
    <DiscussionPageContext.Provider value={memodContext}>
      <DiscussionLayout {...user}>
        <Container maxWidth="6xl" paddingTop={7} flexGrow={1}>
          <Box paddingTop={7} width="100%">
            <DiscussionToolbar {...user} />
          </Box>
          <PublicationFeed {...user} />
          {/* <Post postType="discussion" />
                <Post postType="classified" />
                <Post postType="question" />
                <Post postType="discussion" /> */}
        </Container>
      </DiscussionLayout>
    </DiscussionPageContext.Provider>
  )
}

export default DiscussionPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await cookieChecker(context, false)
  if (!user) return redirectToLogin(context.res)
  return {
    props: { user }
  }
}
