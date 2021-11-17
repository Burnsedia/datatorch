import React, { useState } from 'react'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  useToast
} from '@chakra-ui/react'

import { FaTrash } from 'react-icons/fa'
import {
  useCreateArticleDraftMutation,
  useGetArticleDraftByAuthorIdQuery,
  useCreateArticlePostMutation,
  ArticlePostType,
  GetArticlePostsByPublicationDocument
} from '@/generated/graphql'

import { PlugableSlate } from '@/libs/slate'
import { Node } from 'slate'
import { ParagraphPlugin } from '@/libs/slate/plugins/paragraph'
import { HeadingsPlugin } from '@/libs/slate/plugins/headings'
import { EquationsPlugin } from '@/libs/slate/plugins/equations'
import { TweetPlugin } from '@/libs/slate/plugins/tweet'
import { DividerPlugin } from '@/libs/slate/plugins/divider'
import { ToolbarPlugin } from '@/libs/slate/plugins/toolbar'
import { CommandsPlugin } from '@/libs/slate/plugins/commands'
import { UserData } from '@/libs/utils/cookies'
import { useDiscussionPageContext } from '../DiscussionContext'

const plugins = [
  HeadingsPlugin(),
  EquationsPlugin(),
  TweetPlugin(),
  DividerPlugin(),
  ToolbarPlugin(),
  CommandsPlugin(),
  ParagraphPlugin()
]

/* The component for the author tag */
const AuthorTag: React.FC<UserData> = ({ ...user }) => {
  return (
    <Button
      borderRadius="full"
      leftIcon={
        <Avatar
          src="https://bit.ly/sage-adebayo"
          size="xs"
          name="Segun Adebayo"
          ml={-1}
          mr={1}
        />
      }
    >
      {user.login}
    </Button>
  )
}
/* This component is the individual button that represents a single draft when you click on "load draft" */
const DraftSelection: React.FC<{
  //selectionID: string
  title: string
  created: string
  setTitle
  //setSlate
}> = ({ title, created, setTitle }) => {
  // const [getArticleDraft, { loading, error, data }] =
  //   useGetArticleDraftByIdLazyQuery({
  //     variables: { draftId: selectionID }
  //   })
  // const loadDraft = () => {
  //   let content = ''
  // Yes its a hacky workaround
  // Update I gave up and scrapped the feature for now
  // https://github.com/apollographql/apollo-client/issues/7038
  // if (data?.getArticleDraft.content == undefined) {
  //   return
  // }
  // content = data?.getArticleDraft.content
  // setSlate(JSON.parse(content))
  // End of hacky workaround
  // }

  setTitle(title)

  return (
    <Button
      my={1}
      py={1}
      width="100%"
      height="100%"
      backgroundColor="green"
      //onClick={loadDraft}
    >
      <VStack width="100%" alignItems="left">
        <Text
          width="100%"
          textAlign="left"
          fontWeight="bold"
          maxW="325px"
          overflow="hidden"
        >
          {title}
        </Text>
        <Text width="100%" textAlign="left" fontSize="xs" fontWeight="light">
          {/* change this to "saved X days ago" */}
          created on {created}
        </Text>
      </VStack>
      <Spacer />
      <IconButton
        aria-label="Delete"
        icon={<FaTrash />}
        variant="outline"
        border="0px"
        borderRadius="5px"
        //onClick={() => {}}
      ></IconButton>
    </Button>
  )
}

/* This is the list of drafts */
const DraftList: React.FC<{
  userId
  setTitle: React.Dispatch<React.SetStateAction<string>>
  setSlate: React.Dispatch<React.SetStateAction<Node[]>>
}> = ({ userId, setTitle, setSlate }) => {
  const drafts = useGetArticleDraftByAuthorIdQuery({
    variables: {
      authorId: userId
    }
  })
  return (
    <div>
      {drafts.data?.getArticleDrafts.map(draft => (
        <DraftSelection
          key={draft.id}
          selectionID={draft.id}
          title={draft.title}
          created={draft.createdAt.substring(0, 10)}
          setTitle={setTitle}
          setSlate={setSlate}
        />
      ))}
    </div>
  )
}

/* This component is the individual button that represents a single draft when you click on "load draft" */
const DraftSelection: React.FC<{
  //selectionID: string
  title: string
  created: string
  setTitle
  //setSlate
}> = ({ title, created, setTitle }) => {
  // const [getArticleDraft, { loading, error, data }] =
  //   useGetArticleDraftByIdLazyQuery({
  //     variables: { draftId: selectionID }
  //   })
  // const loadDraft = () => {
  //   let content = ''
  // Yes its a hacky workaround
  // Update I gave up and scrapped the feature for now
  // https://github.com/apollographql/apollo-client/issues/7038
  // if (data?.getArticleDraft.content == undefined) {
  //   return
  // }
  // content = data?.getArticleDraft.content
  // setSlate(JSON.parse(content))
  // End of hacky workaround
  // }

  setTitle(title)

  return (
    <Button
      my={1}
      py={1}
      width="100%"
      height="100%"
      backgroundColor="green"
      //onClick={loadDraft}
    >
      <VStack width="100%" alignItems="left">
        <Text
          width="100%"
          textAlign="left"
          fontWeight="bold"
          maxW="325px"
          overflow="hidden"
        >
          {title}
        </Text>
        <Text width="100%" textAlign="left" fontSize="xs" fontWeight="light">
          {/* change this to "saved X days ago" */}
          created on {created}
        </Text>
      </VStack>
      <Spacer />
      <IconButton
        aria-label="Delete"
        icon={<FaTrash />}
        variant="outline"
        border="0px"
        borderRadius="5px"
        //onClick={() => {}}
      ></IconButton>
    </Button>
  )
}
/* This is the actual post editing component */
const PostEditor: React.FC<UserData> = ({ ...user }) => {
  // Initializers
  const toast = useToast()
  const { isOpen, onClose } = useDisclosure()
  const context = useDiscussionPageContext()
  const [title, setTitle] = useState('')
  const handleTitleChange = event => setTitle(event.target.value)

  // For Slate
  const initValue: Node[] = [
    {
      type: 'paragraph',
      children: [
        {
          text: ''
        }
      ]
    }
  ]
  const [value, setValue] = useState<Node[]>(initValue)
  let draftId = ''

  /* This is the mutation that saves the draft and sets the context to indicate the current working draft */
  const [saveDraft] = useCreateArticleDraftMutation({
    variables: {
      authorId: user.userId,
      title: title,
      content: JSON.stringify(value)
    },
    // update(cache, data) {
    //   cache.writeQuery({
    //     query: GetArticleDraftByIdDocument,
    //     data: data.data.createArticleDraft.id
    //   })
    // },
    onCompleted: data => {
      draftId = data.createArticleDraft.id
      context.dispatch({
        type: 'setCurrentWorkingDraftID',
        currentWorkingDraftID: draftId
      })
    }
  })

  /* This is the mutation that creates a post from a draft */
  const [createArticlePost] = useCreateArticlePostMutation({
    variables: {
      articleDraftID: context.currentWorkingDraftID,
      publication: context.currentPublication,
      postType: ArticlePostType.Discussion
    },
    refetchQueries: [
      GetArticlePostsByPublicationDocument.loc.source.body,
      'getArticlePostsByPublication'
    ]
  })

  return (
    <VStack backgroundColor="gray.800" borderRadius="5" mb={20} pb={10} px={20}>
      {/* Select publication */}
      <HStack paddingTop={20} width="100%" alignItems="end">
        <Text color="gray.400" fontSize="lg">
          For publish in
        </Text>
        <Text color="grey.100" fontSize="lg" fontWeight="bold">
          {context.currentPublication}
        </Text>
      </HStack>
      {/* Title */}
      <HStack width="100%" alignItems="end">
        <Input
          value={title}
          onChange={handleTitleChange}
          size="lg"
          border="0px"
          placeholder="Title"
          _placeholder={{ color: 'gray.500' }}
          fontWeight="bold"
          backgroundColor="gray.900"
          focusBorderColor="none"
        />
      </HStack>
      {/* Author and date */}
      <HStack py={3} width="100%">
        <Box flexGrow={1}>
          <AuthorTag {...user} />
        </Box>
        <Box>
          <Text color="gray.400">{new Date().toLocaleDateString()}</Text>
        </Box>
      </HStack>
      {/*Slate*/}
      <Box borderRadius="5px" minW="100%" backgroundColor="gray.900">
        <PlugableSlate
          value={value}
          setValue={v => setValue(v)}
          plugins={plugins}
          readOnly={false}
        />
      </Box>
      {/* Save Draft */}
      <Flex alignItems="end" width="100%">
        <Spacer />
        <Box>
          <Button
            variant="ghost"
            textColor="gray.900"
            outlineColor="gray.900"
            onClick={async () => {
              toast({
                title: 'This feature is not yet available.',
                status: 'info',
                position: 'bottom-right',
                duration: 9000,
                isClosable: true
              })
              // try {
              //   await saveDraft()
              //   toast({
              //     title: 'Draft Saved',
              //     status: 'success',
              //     position: 'bottom-right',
              //     duration: 9000,
              //     isClosable: true
              //   })
              // } catch (error) {
              //   toast({
              //     title: 'Error',
              //     status: 'error',
              //     position: 'bottom-right',
              //     duration: 9000,
              //     isClosable: true
              //   })
              // }
              // if (!loading) {
              //   try {
              //     // This will save current draft and set the currentworkingdraftid in the context
              //     saveDraft()
              //   } catch (error) {
              //     console.log(error)
              //   }
              // }
            }}
          >
            Save Draft
          </Button>
          <Button
            variant="ghost"
            textColor="gray.900"
            outlineColor="gray.900"
            px={4}
            m={3}
            //onClick={onOpen}
            onClick={async () => {
              toast({
                title: 'This feature is not yet available.,',
                status: 'info',
                position: 'bottom-right',
                duration: 9000,
                isClosable: true
              })
            }}
          >
            Load Draft
          </Button>
        </Box>
        <Spacer />
        <Button
          px={4}
          ml={3}
          my={3}
          onClick={async () => {
            // Save the draft, set new current working draft id, and then create an article post
            try {
              await saveDraft({
                variables: {
                  authorId: user.userId,
                  title: title,
                  content: JSON.stringify(value),
                  isPublished: true
                }
              })
              await createArticlePost()
              // await setDraftToPublished
              toast({
                title: 'Post Published',
                status: 'success',
                position: 'bottom-right',
                duration: 9000,
                isClosable: true
              })
              setTitle('')
              setValue(initValue)
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
          Publish
        </Button>
      </Flex>
      {/* This is the load draft modal, should probably be its own component */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Load Draft</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DraftList setTitle={setTitle} setSlate={setValue} {...user} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default PostEditor
