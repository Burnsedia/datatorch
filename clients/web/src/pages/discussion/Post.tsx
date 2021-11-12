import React from 'react'
import {
  Flex,
  Text,
  Icon,
  Image,
  Stack,
  Link,
  IconButton,
  Spacer
} from '@chakra-ui/react'
import { Card } from '@/common/Card'
import { FaComment, FaTrash } from 'react-icons/fa'
import dtlogosquare from '../../public/dtlogosquare.png'
import {
  useDeleteArticlePostMutation,
  GetArticlePostsByPublicationDocument
} from '@/generated/graphql'
import { useDiscussionPageContext } from './DiscussionContext'

const Post: React.FC<props> = ({
  id,
  postType,
  author,
  publicationName,
  title
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
  if (postType == 'DISCUSSION') {
    return (
      <Card marginY={2}>
        <Flex>
          <Image
            boxSize="75px"
            borderRadius="5px"
            src={dtlogosquare.src}
            alt="Segun Adebayo"
          />
          <Stack paddingLeft={5} height="max">
            <Text fontWeight="bold" fontSize="md">
              <Link href={'/discussion/' + publicationName + '/' + id} id={id}>
                {title}
              </Link>
            </Text>
            <Stack direction="row">
              <Flex>
                <Text fontSize="xs" fontWeight="bold">
                  {/* ({publicationName}: SELF/PROJECT) &nbsp; */}
                  by {author} in {publicationName}&nbsp;
                </Text>
              </Flex>
              <Flex px={2}>
                <Icon as={FaComment} pr={1} />
                <Text fontSize="xs">0&nbsp;</Text>
              </Flex>
              {/* <Text fontSize="xs"> LASTACTIVITYTIME ago&nbsp;</Text> */}
            </Stack>
          </Stack>
          <Spacer />
          {context.loggedInUsername == author ? (
            <IconButton
              aria-label="Delete post"
              icon={<FaTrash />}
              onClick={async () => {
                await deleteArticlePostMutation()
              }}
            />
          ) : (
            <Flex></Flex>
          )}
        </Flex>
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
}
export default Post
