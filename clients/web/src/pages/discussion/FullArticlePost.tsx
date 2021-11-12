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
  useColorModeValue
} from '@chakra-ui/react'
import { Card } from '@/common/Card'
import {
  FaComment,
  FaFacebook,
  FaHeart,
  FaLink,
  FaLinkedin,
  FaTrash,
  FaTwitter
} from 'react-icons/fa'
import dtlogosquare from '../../public/dtlogosquare.png'
import {
  useDeleteArticlePostMutation,
  GetArticlePostsByPublicationDocument
} from '@/generated/graphql'
import { useDiscussionPageContext } from './DiscussionContext'
import { PlugableSlate } from '@/libs/slate'
import { CommandsPlugin } from '@/libs/slate/plugins/commands'
import { DividerPlugin } from '@/libs/slate/plugins/divider'
import { EquationsPlugin } from '@/libs/slate/plugins/equations'
import { HeadingsPlugin } from '@/libs/slate/plugins/headings'
import { ParagraphPlugin } from '@/libs/slate/plugins/paragraph'
import { ToolbarPlugin } from '@/libs/slate/plugins/toolbar'
import { TweetPlugin } from '@/libs/slate/plugins/tweet'
const plugins = [
  HeadingsPlugin(),
  EquationsPlugin(),
  TweetPlugin(),
  DividerPlugin(),
  ToolbarPlugin(),
  CommandsPlugin(),
  ParagraphPlugin()
]

const Title: React.FC<{
  projectName: string
  publicationName?: string
  title: string
}> = ({ projectName, publicationName, title }) => {
  const projectColor = useColorModeValue('gray.500', 'gray.400')
  return (
    <>
      {/** Project ID but no Publication ID = internal article*/}
      <Text color={projectColor}>
        Published in&nbsp;
        {!publicationName ? 'project ' + projectName : publicationName}
      </Text>
      <Heading as="h1" fontSize="5xl" fontWeight="bold">
        {title}
      </Heading>
    </>
  )
}

const Author: React.FC = ({ name }) => {
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
      {name}
    </Button>
  )
}

const FullArticlePost: React.FC<props> = ({
  id,
  postType,
  author,
  publicationName,
  title,
  content
}) => {
  const isMd = useBreakpointValue({ base: true, lg: false })
  const initValue = JSON.parse(content)
  const [value, setValue] = useState<Node[]>(initValue)
  return (
    <Box>
      <Flex flexDirection="row">
        {/* {!isMd && (
          <Box
            marginTop={7}
            paddingY={20}
            paddingX={7}
            top="0"
            position="sticky"
            alignSelf="flex-start"
          >
            <IconButton
              marginY={0.5}
              aria-label="favourite"
              colorScheme="red"
              icon={<Icon as={FaHeart} w={5} h={5} />}
              variant="ghost"
            />
            <IconButton
              marginY={0.5}
              colorScheme="gray"
              aria-label="favourite"
              icon={<Icon as={FaLink} w={5} h={5} />}
              variant="ghost"
            />
            <IconButton
              marginY={0.5}
              colorScheme="twitter"
              aria-label="twitter"
              icon={<Icon as={FaTwitter} w={5} h={5} />}
              variant="ghost"
            />
            <IconButton
              marginY={0.5}
              colorScheme="facebook"
              aria-label="facebook"
              icon={<Icon as={FaFacebook} w={5} h={5} />}
              variant="ghost"
            />
            <IconButton
              marginY={0.5}
              colorScheme="linkedin"
              aria-label="linkedin"
              icon={<Icon as={FaLinkedin} w={5} h={5} />}
              variant="ghost"
            />
          </Box>
        )} */}
        <Box
          flexGrow={1}
          rounded="xl"
          paddingX={{ base: 5, md: 10, lg: 20 }}
          paddingY={{ base: 10, md: 20 }}
          overflow="auto"
          bgColor="gray.800"
          fontSize={{ base: 'md', sm: 'lg' }}
        >
          <Title
            projectName="myproject"
            publicationName={publicationName}
            title={title}
          />
          <Flex alignItems="center" marginY={4}>
            <Box flexGrow={1}>
              <Author name={author} />
            </Box>
            <Box>
              <Text color="gray.400">Feb 23</Text>
            </Box>
          </Flex>

          <PlugableSlate
            readOnly={true}
            value={value}
            setValue={v => setValue(v)}
            plugins={plugins}
          />
        </Box>
      </Flex>
    </Box>
  )
  // if (postType == 'QUESTION') {
  //   return (
  //     <Card marginY={2}>
  //       <Flex>
  //         <Stack width="100px">
  //           <Text fontSize="sm">Q</Text>
  //           <Text fontSize="sm">V 323</Text>
  //           <Text fontSize="sm">A 3</Text>
  //         </Stack>
  //         <Stack paddingLeft={5} height="max">
  //           <Text fontWeight="bold" fontSize="md">
  //             {title}
  //           </Text>
  //           <Stack direction="row">
  //             <Text fontSize="xs">in &nbsp;</Text>
  //             <Text fontSize="xs" fontWeight="bold">
  //               PUBLICATIONNAME &nbsp;
  //             </Text>
  //             <Text fontSize="xs"> c 34&nbsp;</Text>
  //             <Text fontSize="xs"> LASTACTIVITYTIME ago&nbsp;</Text>
  //           </Stack>
  //         </Stack>
  //       </Flex>
  //     </Card>
  //   )
  // }
  // if (postType == 'CLASSIFIED') {
  //   return (
  //     <Card marginY={2}>
  //       <Flex wrap="wrap">
  //         <Box>
  //           <Text as="span" fontSize="xs">
  //             M CLASSTYPE DATEPOSTED&nbsp;
  //           </Text>
  //           <Text as="span" fontWeight="bold" fontSize="md">
  //             {title}
  //           </Text>
  //         </Box>
  //         <Stack direction="row">
  //           <Box width="95px" />
  //           <Text fontSize="xs">in &nbsp;</Text>
  //           <Text fontSize="xs" fontWeight="bold">
  //             PUBLICATIONNAME &nbsp;
  //           </Text>
  //           <Text fontSize="xs"> c 34&nbsp;</Text>
  //           <Text fontSize="xs"> LASTACTIVITYTIME ago&nbsp;</Text>
  //         </Stack>
  //       </Flex>
  //     </Card>
  //   )
  // }
}
export default FullArticlePost
