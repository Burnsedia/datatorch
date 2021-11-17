import React from 'react'
import {
  Flex,
  Text,
  Image,
  Stack,
  IconButton,
  Spacer,
  Box,
  Tag,
  TagLabel,
  TagLeftIcon,
  useDisclosure,
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast
} from '@chakra-ui/react'
import { Card } from '@/common/Card'
import { FaComment, FaEye, FaHeart, FaTrash } from 'react-icons/fa'
import dtlogosquare from '../../../public/dtlogosquare.png'
import {
  useDeleteArticlePostMutation,
  GetArticlePostsByPublicationDocument
} from '@/generated/graphql'
import { useDiscussionPageContext } from '../DiscussionContext'

const Post: React.FC<props> = ({
  id,
  postType,
  author,
  publicationName,
  title,
  user
}) => {
  const context = useDiscussionPageContext()
  const [deleteArticlePostMutation] = useDeleteArticlePostMutation({
    variables: {
      articlePostId: id
    },
    refetchQueries: [
      GetArticlePostsByPublicationDocument.loc.source.body,
      'getArticlePostsByPublication'
    ]
  })
  // Stuff for the delete modal
  const [value, setValue] = React.useState('')
  const handleChange = event => setValue(event.target.value)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  if (postType == 'DISCUSSION') {
    return (
      <Card marginY={2} paddingY={3}>
        <Flex>
          <Image
            boxSize="60px"
            borderRadius="5px"
            src={dtlogosquare.src}
            alt="Segun Adebayo"
          />
          <Stack paddingLeft={5} height="max">
            <Text fontWeight="bold" fontSize="lg">
              <Link href={'/d/' + publicationName + '/' + id}>{title}</Link>
            </Text>
            <Stack direction="row">
              <Flex>
                <Text fontSize="md" fontWeight="normal" color="gray.400">
                  by {author} in {publicationName}&nbsp;
                </Text>
              </Flex>
              {/* <Text fontSize="xs"> LASTACTIVITYTIME ago&nbsp;</Text> */}
            </Stack>
          </Stack>
          <Spacer />
          <Box
            paddingX={4}
            flexShrink={{ base: null, lg: 0 }}
            textAlign="center"
          >
            <Tag margin={1}>
              <TagLeftIcon as={FaEye} />
              <TagLabel>999+</TagLabel>
            </Tag>
            <Tag margin={1} colorScheme="red">
              <TagLeftIcon as={FaHeart} />
              <TagLabel>999+</TagLabel>
            </Tag>
            <Tag margin={1} colorScheme="blue">
              <TagLeftIcon as={FaComment} />
              <TagLabel>999+</TagLabel>
            </Tag>
          </Box>
          {context.loggedInUsername == author ? (
            <IconButton
              borderRadius="8px"
              aria-label="Delete post"
              icon={<FaTrash />}
              onClick={onOpen}
            />
          ) : (
            <Flex></Flex>
          )}
        </Flex>
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
      </Card>
    )
  }
  if (postType == 'QUESTION') {
    return (
      <Card marginY={2}>
        <Flex>
          <Stack width="100px">
            <Text fontSize="sm">Q</Text>
            <Text fontSize="sm">V 323</Text>
            <Text fontSize="sm">A 3</Text>
          </Stack>
          <Stack paddingLeft={5} height="max">
            <Text fontWeight="bold" fontSize="md">
              {title}
            </Text>
            <Stack direction="row">
              <Text fontSize="xs">in &nbsp;</Text>
              <Text fontSize="xs" fontWeight="bold">
                PUBLICATIONNAME &nbsp;
              </Text>
              <Text fontSize="xs"> c 34&nbsp;</Text>
              <Text fontSize="xs"> LASTACTIVITYTIME ago&nbsp;</Text>
            </Stack>
          </Stack>
        </Flex>
      </Card>
    )
  }
  if (postType == 'CLASSIFIED') {
    return (
      <Card marginY={2}>
        <Flex wrap="wrap">
          <Box>
            <Text as="span" fontSize="xs">
              M CLASSTYPE DATEPOSTED&nbsp;
            </Text>
            <Text as="span" fontWeight="bold" fontSize="md">
              {title}
            </Text>
          </Box>
          <Stack direction="row">
            <Box width="95px" />
            <Text fontSize="xs">in &nbsp;</Text>
            <Text fontSize="xs" fontWeight="bold">
              PUBLICATIONNAME &nbsp;
            </Text>
            <Text fontSize="xs"> c 34&nbsp;</Text>
            <Text fontSize="xs"> LASTACTIVITYTIME ago&nbsp;</Text>
          </Stack>
        </Flex>
      </Card>
    )
  }
  if (postType == 'COMMENT') {
    return
    // return <Comment author="asdf" comment="qwerqwer" />
  }
}
export default Post
