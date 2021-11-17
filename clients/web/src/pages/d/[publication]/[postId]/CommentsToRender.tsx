import React, { useState } from 'react'
import {
  Flex,
  Text,
  Icon,
  Image,
  Stack,
  Link,
  IconButton,
  Spacer,
  Container,
  Box,
  useBreakpointValue,
  Avatar,
  Button,
  Heading,
  useColorModeValue,
  VStack,
  HStack
} from '@chakra-ui/react'
import { Card } from '@/common/Card'
import {
  FaComment,
  FaFacebook,
  FaHeart,
  FaLink,
  FaLinkedin,
  FaTrash,
  FaTwitter,
  FaChevronUp,
  FaChevronDown
} from 'react-icons/fa'
import { Author } from './Article'
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
