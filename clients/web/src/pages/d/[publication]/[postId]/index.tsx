import { Container, Divider } from '@chakra-ui/react'
import React from 'react'
import { cookieChecker, redirectToLogin } from '@/libs/utils/cookies'
import { GetServerSidePropsContext, NextPage } from 'next'
import { useRouter } from 'next/router'
import { IndexProps } from '@/pages/home'
import { useGetArticlePostByIdQuery } from '@/generated/graphql'
import Article from './Article'
import { DiscussionLayout } from '../../DiscussionLayout'
import CommentCreator from '../../common/CommentCreator'
import CommentsToRender from './CommentsToRender'

const LoadingSpinner: React.FC<props> = () => {
  return <div>loading...</div>
}

const ExpandedArticlePage: NextPage<IndexProps> = ({ ...user }) => {
  const router = useRouter()
  const postId = router.query.postId as string
  const { data, loading } = useGetArticlePostByIdQuery({
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
            <Article
              id={data.getArticlePostById.id}
              postType={data.getArticlePostById.postType}
              publicationName={data.getArticlePostById.publication}
              author={data.getArticlePostById.articleDraft.author.name}
              title={data.getArticlePostById.articleDraft.title}
              content={data.getArticlePostById.articleDraft.content}
            />
          </div>
        )}
        <Divider my={6} />
        <CommentCreator {...user} />
        <CommentsToRender {...user} postId={postId} />
        <Divider mt={5} mb={10} />
      </Container>
    </DiscussionLayout>
  )
}

export default ExpandedArticlePage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await cookieChecker(context, false)
  if (!user) return redirectToLogin(context.res)
  return {
    props: { user }
  }
}
