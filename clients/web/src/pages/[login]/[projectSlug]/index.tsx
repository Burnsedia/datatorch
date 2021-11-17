import React, { useState } from 'react'
import { NextPage } from 'next'
import { ProjectLayout } from '@/applets/projects/layout/ProjectLayout'
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  chakra,
  Container,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Textarea,
  useDisclosure
} from '@chakra-ui/react'
import update from 'immutability-helper'
import { ProjectHeader } from '@/applets/projects/ProjectPage'
import { FaCog } from 'react-icons/fa'
import { Card, CardHeading } from '@/common/Card'
import { ArchiveAlert } from '@/applets/projects/ArchiveAlert'

const SectionHeader: React.FC = ({ children }) => (
  <chakra.h4 fontWeight="bold" letterSpacing="wide">
    {children}
  </chakra.h4>
)

const ProjectTag: React.FC<{ showDelete?: boolean; onDelete?: () => void }> = ({
  children,
  showDelete,
  onDelete
}) => (
  <Tag variant="subtle" mr={2} my={1} colorScheme="blue">
    <TagLabel>{children}</TagLabel>
    {showDelete && <TagCloseButton onClick={onDelete} />}
  </Tag>
)

const ProjectTopicsInput: React.FC<{
  values: string[]
  setValues: (values: string[]) => void
}> = ({ values, setValues }) => {
  const [newTag, setNewTag] = useState('')

  const removeTag = (tag: string) => {
    const idx = values.indexOf(tag)
    setValues(update(values, { $splice: [[idx, 1]] }))
  }

  const addTag = () => {
    const tag = newTag.trim()
    if (tag.length === 0) return
    if (values.includes(tag)) {
      setNewTag('')
      return
    }
    setValues([...values, tag])
    setNewTag('')
  }

  return (
    <FormControl>
      <Box mt={4}>
        <FormLabel>Topics</FormLabel>
        <Box
          border="1px"
          borderColor="gray.600"
          rounded="md"
          paddingX="3"
          paddingY="2"
        >
          {values.map(topic => (
            <ProjectTag
              key={topic}
              showDelete
              onDelete={() => removeTag(topic)}
            >
              {topic}
            </ProjectTag>
          ))}
          <Input
            value={newTag}
            onChange={e => setNewTag(e.target.value.toLowerCase())}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ',' || e.key === ' ') addTag()
            }}
            size="sm"
            width="50"
            border="none"
            focusBorderColor="transparent"
            placeholder="Add tags"
            padding="0"
            marginLeft="2"
          />
        </Box>
      </Box>
      <FormHelperText>Separate with spaces</FormHelperText>
    </FormControl>
  )
}

const ProjectSettingsModal: React.FC<Omit<ModalProps, 'children'>> = props => {
  const initialRef = React.useRef()
  const [tags, setTags] = useState(['test1'])
  return (
    <Modal {...props} initialFocusRef={initialRef}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit project details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea ref={initialRef} />
          </FormControl>
          <ProjectTopicsInput values={tags} setValues={setTags} />
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={props.onClose}>
            Cancel
          </Button>
          <Button colorScheme="green">Save changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export const PageProjectHome: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <ProjectLayout>
      <Container maxWidth="6xl" paddingY="3">
        <ProjectHeader title="Project Name" />
        <Flex marginY="4" flexDirection={{ base: 'column', lg: 'row' }}>
          <Box>
            <ArchiveAlert marginBottom={4} />
            <Card>
              <CardHeading fontSize="xl" letterSpacing="wide">
                README
              </CardHeading>

              <Text marginTop="2">
                Set a readme to let others know what this project is about. Sed
                ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi
                nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor
                sit amet, consectetur, adipisci velit, sed quia non numquam eius
                modi tempora incidunt ut labore et dolore magnam aliquam quaerat
                voluptatem. Ut enim ad minima veniam, quis nostrum
                exercitationem ullam corporis suscipit laboriosam, nisi ut
                aliquid ex ea commodi consequatur? Quis autem vel eum iure
                reprehenderit qui in ea voluptate velit esse quam nihil
                molestiae consequatur, vel illum qui dolorem eum fugiat quo
                voluptas nulla pariatur? Sed ut perspiciatis unde omnis iste
                natus error sit voluptatem accusantium doloremque laudantium,
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
                et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                ipsam voluptatem quia voluptas sit aspernatur aut odit aut
                fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
                ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia
                non numquam eius modi tempora incidunt ut labore et dolore
                magnam aliquam quaerat voluptatem. Ut enim ad minima veniam,
                quis nostrum exercitationem ullam corporis suscipit laboriosam,
                nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
                iure reprehenderit qui in ea voluptate velit esse quam nihil
                molestiae consequatur, vel illum qui dolorem eum fugiat quo
                voluptas nulla pariatur? Sed ut perspiciatis unde omnis iste
                natus error sit voluptatem accusantium doloremque laudantium,
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
                et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                ipsam voluptatem quia voluptas sit aspernatur aut odit aut
                fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
                ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia
                non numquam eius modi tempora incidunt ut labore et dolore
                magnam aliquam quaerat voluptatem. Ut enim ad minima veniam,
                quis nostrum exercitationem ullam corporis suscipit laboriosam,
                nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
                iure reprehenderit qui in ea voluptate velit esse quam nihil
                molestiae consequatur, vel illum qui dolorem eum fugiat quo
                voluptas nulla pariatur? Sed ut perspiciatis unde omnis iste
                natus error sit voluptatem accusantium doloremque laudantium,
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
                et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                ipsam voluptatem quia voluptas sit aspernatur aut odit aut
                fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
                ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia
                non numquam eius modi tempora incidunt ut labore et dolore
                magnam aliquam quaerat voluptatem. Ut enim ad minima veniam,
                quis nostrum exercitationem ullam corporis suscipit laboriosam,
                nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
                iure reprehenderit qui in ea voluptate velit esse quam nihil
                molestiae consequatur, vel illum qui dolorem eum fugiat quo
                voluptas nulla pariatur? Sed ut perspiciatis unde omnis iste
                natus error sit voluptatem accusantium doloremque laudantium,
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
                et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                ipsam voluptatem quia voluptas sit aspernatur aut odit aut
                fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
                ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia
                non numquam eius modi tempora incidunt ut labore et dolore
                magnam aliquam quaerat voluptatem. Ut enim ad minima veniam,
                quis nostrum exercitationem ullam corporis suscipit laboriosam,
                nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
                iure reprehenderit qui in ea voluptate velit esse quam nihil
                molestiae consequatur, vel illum qui dolorem eum fugiat quo
                voluptas nulla pariatur? Sed ut perspiciatis unde omnis iste
                natus error sit voluptatem accusantium doloremque laudantium,
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
                et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
                ipsam voluptatem quia voluptas sit aspernatur aut odit aut
                fugit, sed quia consequuntur magni dolores eos qui ratione
                voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem
                ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia
                non numquam eius modi tempora incidunt ut labore et dolore
                magnam aliquam quaerat voluptatem. Ut enim ad minima veniam,
                quis nostrum exercitationem ullam corporis suscipit laboriosam,
                nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
                iure reprehenderit qui in ea voluptate velit esse quam nihil
                molestiae consequatur, vel illum qui dolorem eum fugiat quo
                voluptas nulla pariatur?
              </Text>
            </Card>
          </Box>

          <Box
            flexShrink={0}
            width={{ base: null, lg: 250 }}
            marginLeft={{ base: null, lg: 5 }}
            marginX="4"
            position="sticky"
            top="0"
            alignSelf="flex-start"
          >
            <Box marginY="5">
              <Flex alignItems="center" justifyContent="space-between">
                <SectionHeader>Description</SectionHeader>
                <IconButton
                  onClick={onOpen}
                  icon={<Icon as={FaCog} />}
                  variant="ghost"
                  size="sm"
                  aria-label="Edit project settings"
                />
                <ProjectSettingsModal isOpen={isOpen} onClose={onClose} />
              </Flex>
              <Text marginTop="1">
                Short project description goes here that will show in the
                project card.
              </Text>
              <Box marginY="2">
                <ProjectTag>images</ProjectTag>
                <ProjectTag>cars</ProjectTag>
                <ProjectTag>client-3332</ProjectTag>
                <ProjectTag>project-tango</ProjectTag>
                <ProjectTag>internal</ProjectTag>
              </Box>
            </Box>

            <Divider />

            <Box marginY="5">
              <SectionHeader>Activity</SectionHeader>
              Nothing to see here.
            </Box>

            <Divider />

            <Box marginY="5">
              <SectionHeader>Contributors</SectionHeader>
              <AvatarGroup size="md" max={4} marginTop="2">
                <Avatar
                  name="Ryan Florence"
                  src="https://bit.ly/ryan-florence"
                />
                <Avatar
                  name="Segun Adebayo"
                  src="https://bit.ly/sage-adebayo"
                />
                <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                <Avatar
                  name="Prosper Otemuyiwa"
                  src="https://bit.ly/prosper-baba"
                />
                <Avatar
                  name="Christian Nwamba"
                  src="https://bit.ly/code-beast"
                />
                <Avatar
                  name="Christian Nwamba"
                  src="https://bit.ly/code-beast"
                />
                <Avatar
                  name="Christian Nwamba"
                  src="https://bit.ly/code-beast"
                />
              </AvatarGroup>
            </Box>
          </Box>
        </Flex>
      </Container>
    </ProjectLayout>
  )
}

export default PageProjectHome
