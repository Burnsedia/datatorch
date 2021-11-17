import React from 'react'
import {
  Button,
  VStack,
  Spacer,
  useToast,
  Stack,
  Textarea
} from '@chakra-ui/react'

import {
  useCreateArticleDraftMutation,
  useCreateChildArticlePostMutation,
  ArticlePostType,
  GetCommentsForPostIdDocument
} from '@/generated/graphql'

import { UserData } from '@/libs/utils/cookies'
import { useDiscussionPageContext } from '../DiscussionContext'
import { Author } from '../[publication]/[postId]/Article'
import { useRouter } from 'next/router'

// function createComment() {
//   console.log('asdf')
// }

const CommentCreator: React.FC<UserData> = ({ user }) => {
  // Initializers
  const toast = useToast()
  const router = useRouter()
  const postId = router.query.postId as string
  const [value, setValue] = React.useState('')
  const handleInputChange = e => {
    const inputValue = e.target.value
    setValue(inputValue)
  }
  const context = useDiscussionPageContext()
  let draftId = ''

  const [saveDraft] = useCreateArticleDraftMutation({
    onCompleted: data => {
      draftId = data.createArticleDraft.id
      context.dispatch({
        type: 'setCurrentWorkingDraftID',
        currentWorkingDraftID: draftId
      })
    }
  })

  const [createChildArticlePost] = useCreateChildArticlePostMutation({
    refetchQueries: [
      GetCommentsForPostIdDocument.loc.source.body,
      'getCommentsForPostId'
    ]
  })

  return (
    <VStack backgroundColor="gray.800" borderRadius="10" my={2} px={6} py={2}>
      {/* Title */}
      <Stack direction={['column', 'row']} width="100%">
        <Author />
        <VStack width="100%" align="left" paddingLeft={2}>
          <Textarea
            value={value}
            onChange={handleInputChange}
            size="sm"
            border="0px"
            borderRadius="10px"
            placeholder="I think..."
            _placeholder={{ color: 'gray.500' }}
            backgroundColor="gray.900"
            focusBorderColor="none"
          />
          <Stack direction={['column', 'row']} width="100%">
            <Spacer />
            <Button
              onClick={async () => {
                try {
                  const newDraft = await saveDraft({
                    variables: {
                      authorId: user.userId,
                      title: '',
                      content: value,
                      isPublished: true
                    }
                  })
                  await createChildArticlePost({
                    variables: {
                      articleDraftID: newDraft.data.createArticleDraft.id,
                      publication: context.currentPublication,
                      postType: ArticlePostType.Comment,
                      parentId: postId
                    }
                  })
                  setValue('')
                  toast({
                    title: 'Post Published',
                    status: 'success',
                    position: 'bottom-right',
                    duration: 9000,
                    isClosable: true
                  })
                } catch (error) {
                  //console.log(error)
                  toast({
                    title: 'Error',
                    status: 'error',
                    position: 'bottom-right',
                    duration: 9000,
                    isClosable: true
                  })
                }
              }}
            >
              Comment
            </Button>
          </Stack>
        </VStack>
      </Stack>
    </VStack>
  )
}

export default CommentCreator
