import { Container, Text } from '@chakra-ui/react'
import React, { useMemo, useReducer } from 'react'
import DiscussionToolbar from '../DiscussionToolbar'
import { cookieChecker, redirectToLogin } from '@/libs/utils/cookies'
import { GetServerSidePropsContext, NextPage } from 'next'
import { DiscussionLayout } from '../DiscussionLayout'
import { useRouter } from 'next/router'
import PublicationFeed from '../PublicationFeed'
import { IndexProps } from '@/pages/home'
import { useGetArticlePostByIdQuery } from '@/generated/graphql'
import FullArticlePost from '../FullArticlePost'

const LoadingSpinner: React.FC<props> = ({ props }) => {
  return <div>loading...</div>
}

const ExpandedArticlePage: NextPage<IndexProps> = ({ user }) => {
  const router = useRouter()
  const postId = router.query.postId as string
  const { data, loading, error } = useGetArticlePostByIdQuery({
    variables: {
      articlePostId: postId
    }
  })

  return (
    <DiscussionLayout {...user}>
      <Container maxWidth="6xl" paddingTop={5} flexGrow={1}>
        {loading ||
        data?.getArticlePostById.id == undefined ||
        data?.getArticlePostById.postType == undefined ||
        data?.getArticlePostById.publication == undefined ||
        data?.getArticlePostById.articleDraft.author.name == undefined ||
        data?.getArticlePostById.articleDraft.title == undefined ||
        data?.getArticlePostById.articleDraft.content == undefined ? (
          <div>
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            <FullArticlePost
              id={data.getArticlePostById.id}
              postType={data.getArticlePostById.postType}
              publicationName={data.getArticlePostById.publication}
              author={data.getArticlePostById.articleDraft.author.name}
              title={data.getArticlePostById.articleDraft.title}
              content={data.getArticlePostById.articleDraft.content}
            />
          </div>
        )}
      </Container>
    </DiscussionLayout>
  )
}

export default ExpandedArticlePage
