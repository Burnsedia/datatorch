import Discussion from '@/pages/d'
import {
  Box,
  Button,
  Flex,
  Heading,
  VStack,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Divider,
  useBreakpointValue
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { memo } from 'react'
import { FaComment, FaEye, FaHeart } from 'react-icons/fa'

export const ArticleListItem: React.FC<{
  id: string
  title: string
  description?: string
  draft?: boolean
  publishedAt?: Date
}> = memo(({ id, title, draft, description }) => {
  const isGteSm = useBreakpointValue({ base: false, sm: true })
  const isGteMd = useBreakpointValue({ base: false, md: true })
  const isGteLg = useBreakpointValue({ base: false, lg: true })

  const router = useRouter()
  const articleUrl = `${router.asPath}/${id}?fullscreen=false`

  return (
    <Flex
      onClick={() => router.push(articleUrl)}
      rounded="md"
      cursor="pointer"
      padding={2}
      paddingX={3}
      alignItems="center"
      border="1px"
      borderColor="transparent"
      _hover={{ border: '1px', borderColor: 'gray.700' }}
    >
      <Box flexGrow={1} flexShrink={1} minWidth={0}>
        <Flex alignItems="center">
          <Heading as="h4" fontSize="lg" marginY={1} isTruncated>
            {title}
          </Heading>
          {draft ? (
            <Tag marginX={2} colorScheme="purple">
              Draft
            </Tag>
          ) : (
            isGteSm && (
              <Text marginX={1} flexShrink={0} color="gray.400">
                15 days ago
              </Text>
            )
          )}
        </Flex>
        <Text minWidth={0} isTruncated color="gray.400" fontSize="sm">
          {description}
        </Text>
      </Box>
      {isGteMd && (
        <Box paddingX={1} flexShrink={{ base: null, lg: 0 }} textAlign="center">
          <Tag margin={1}>
            <TagLeftIcon as={FaEye} />
            <TagLabel>1.2k</TagLabel>
          </Tag>
          {isGteLg && (
            <Tag margin={1} colorScheme="red">
              <TagLeftIcon as={FaHeart} />
              <TagLabel>10</TagLabel>
            </Tag>
          )}
          <Tag margin={1} colorScheme="blue">
            <TagLeftIcon as={FaComment} />
            <TagLabel>10</TagLabel>
          </Tag>
        </Box>
      )}
      {!draft && (
        <Box marginLeft={1}>
          <Button>Edit</Button>
        </Box>
      )}
    </Flex>
  )
})

export const ArticlesList: React.FC = () => {
  const articles = [
    {
      id: '1',
      title: 'test',
      description: 'test2s',
      draft: true,
      publishedAt: new Date(),
      editedAt: new Date()
    },
    {
      id: '2',
      title:
        'Second article about stuff aspernatur aut odit aut fugit, sed quia consequuntur magni dolores',
      description:
        'accusantium doloremque laudantium quasi architecto beata modi tempora incidunt ut labore aliquid ex ea commodi consequatur',
      draft: false,
      publishedAt: new Date(),
      editedAt: new Date()
    }
  ]
  return (
    <VStack align="stretch" divider={<Divider />}>
      {articles.map(a => (
        <ArticleListItem key={a.id} {...a} />
      ))}
    </VStack>
  )
}
