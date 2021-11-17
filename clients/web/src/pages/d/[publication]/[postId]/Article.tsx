import React, { useState } from 'react'
import {
  Flex,
  Text,
  Link,
  Box,
  useBreakpointValue,
  Avatar,
  Button,
  Heading,
  useColorModeValue
} from '@chakra-ui/react'
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
  const link = '/d/' + publicationName
  return (
    <>
      {/** Project ID but no Publication ID = internal project article*/}
      <Text color={projectColor}>
        Published in&nbsp;
        {!publicationName ? (
          'project ' + projectName
        ) : (
          <Link href={link}>{publicationName}</Link>
        )}
      </Text>
      <Heading as="h1" fontSize="5xl" fontWeight="bold">
        {title}
      </Heading>
    </>
  )
}

export const Author: React.FC = ({ name }) => {
  return (
    <Button
      borderRadius="full"
      leftIcon={
        <Avatar
          src="https://bit.ly/sage-adebayo"
          size="xs"
          name="Segun Adebayo"
          ml={-2}
        />
      }
    >
      {name ? name : <Box mr={-4} />}
    </Button>
  )
}

const Article: React.FC<props> = ({
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
          <Flex alignItems="center" marginTop={2} marginBottom={6}>
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
}
export default Article
