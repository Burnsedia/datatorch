import React from 'react'
import {
  Flex,
  Text,
  IconButton,
  Box,
  useBreakpointValue,
  Button,
  VStack,
  HStack,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  useToast
} from '@chakra-ui/react'
import { FaTrash, FaChevronUp, FaChevronDown } from 'react-icons/fa'
import { Author } from './Article'
import {
  GetCommentsForPostIdDocument,
  useDeleteArticlePostMutation
} from '@/generated/graphql'

const Votes: React.FC<props> = ({ props }) => {
  return (
    <HStack minWidth="100px" mx={2}>
      <Box color="gray.700">
        <IconButton
          color="gray.700"
          variant="link"
          aria-label="upvote"
          icon={<FaChevronUp />}
        />
        10
        <IconButton
          color="gray.700"
          variant="link"
          aria-label="downvote"
          icon={<FaChevronDown />}
        />
      </Box>
    </HStack>
  )
}

const Comment: React.FC<props> = ({ postId, author, comment, user }) => {
  const isMd = useBreakpointValue({ base: true, lg: false })
  const [deleteArticlePostMutation] = useDeleteArticlePostMutation({
    variables: {
      articlePostId: postId
    },
    refetchQueries: [
      GetCommentsForPostIdDocument.loc.source.body,
      'getCommentsForPostId'
    ]
  })
  // Stuff for the delete modal
  const [value, setValue] = React.useState('')
  const handleChange = event => setValue(event.target.value)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  return (
    <Box
      _hover={{ bg: 'gray.700' }}
      textAlign="left"
      width="100%"
      marginTop={2}
      rounded="xl"
      overflow="auto"
      bgColor="gray.800"
    >
      <HStack width="100%">
        <Flex flexDirection="row" width="100%">
          {/* Left Side */}
          <VStack>
            <Author name={author} />
          </VStack>
          {/* Comments */}
          <Flex flexDirection="row" width="100%" pt={2}>
            <Text px={2} fontSize="sm">
              {comment}
            </Text>
          </Flex>
          {/* Right Side */}
          {user.login == author ? (
            <IconButton
              borderRadius="8px"
              aria-label="Delete comment"
              variant="link"
              icon={<FaTrash />}
              onClick={onOpen}
            />
          ) : (
            <Flex></Flex>
          )}
          <Votes />
        </Flex>
      </HStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Deleting a post is not reversible.</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            To confirm, type your username in the box below and click Delete.
          </ModalBody>
          <ModalFooter>
            <Input
              placeholder="Username"
              value={value}
              onChange={handleChange}
            ></Input>
            <Button
              colorScheme="red"
              ml={3}
              onClick={async () => {
                try {
                  if (value !== user.login) {
                    toast({
                      title: 'Incorect username',
                      status: 'error',
                      position: 'bottom-right',
                      duration: 9000,
                      isClosable: true
                    })
                  } else if (value == user.login) {
                    onClose()
                    await deleteArticlePostMutation()
                    toast({
                      title: 'Comment deleted',
                      status: 'success',
                      position: 'bottom-right',
                      duration: 9000,
                      isClosable: true
                    })
                  }
                } catch (error) {}
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default Comment
