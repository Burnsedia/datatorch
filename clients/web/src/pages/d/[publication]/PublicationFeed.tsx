import React from 'react'
import {
  ArticlePostType,
  useGetArticlePostsByPublicationQuery
} from '@/generated/graphql'
import Post from '../common/Post'
import { useDiscussionPageContext } from '../DiscussionContext'
import { Box } from '@chakra-ui/react'

const PublicationFeed: React.FC<props> = ({ ...user }) => {
  const context = useDiscussionPageContext()
  const posts = useGetArticlePostsByPublicationQuery({
    variables: {
      publicationName: context.currentPublication,
      postType: ArticlePostType.Discussion
    }
  })
  return (
    <Box marginTop="24px">
      {posts.data?.getArticlePostsByPublication.map(posts => (
        <Post
          key={posts.id}
          id={posts.id}
          postType={posts.postType}
          publicationName={posts.publication}
          author={posts.articleDraft.author.name}
          title={posts.articleDraft.title}
          content={posts.articleDraft.content}
          user={user}
        />
      ))}
    </Box>
  )
}
export default PublicationFeed
