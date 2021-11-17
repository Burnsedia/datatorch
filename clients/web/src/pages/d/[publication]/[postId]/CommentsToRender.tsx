import React from 'react'
import { Box } from '@chakra-ui/react'
import { useGetCommentsForPostIdQuery } from '@/generated/graphql'
import Comment from './Comment'

const CommentsToRender: React.FC<props> = ({ postId, ...user }) => {
  const comments = useGetCommentsForPostIdQuery({
    variables: {
      postId: postId
    }
  })

  return (
    <Box>
      {comments.data?.getChildrenArticlePostsForPostId.map(comment => (
        <Comment
          {...user}
          key={comment.id}
          postId={comment.id}
          author={comment.articleDraft.author.name}
          comment={comment.articleDraft.content}
        />
      ))}
    </Box>
  )
}

export default CommentsToRender
