import React from 'react'
import {
  Box,
  Button,
  Flex,
  Text,
  Stack,
  HStack,
  Spacer,
  useDisclosure,
  Collapse,
  Divider
} from '@chakra-ui/react'
import {
  FaChevronDown,
  FaList,
  FaNewspaper,
  FaQuestionCircle,
  FaBullhorn,
  FaPlus
} from 'react-icons/fa'
import { UserData } from '@/libs/utils/cookies'
import PostCreatorEditor from '../common/PostCreatorEditor'
import { useDiscussionPageContext } from '@/pages/d/DiscussionContext'

const iconMap = new Map([
  // eslint-disable-next-line react/jsx-key
  ['discussion', <FaNewspaper key="1" />],
  // eslint-disable-next-line react/jsx-key
  ['question', <FaQuestionCircle key="2" />],
  // eslint-disable-next-line react/jsx-key
  ['classified', <FaBullhorn key="3" />]
])

const DiscussionFilterIcons: React.FC<{ visible }> = ({ visible }) => {
  return visible.map(postType => iconMap.get(postType))
}

const DiscussionToolbar: React.FC<UserData> = ({ ...user }) => {
  const context = useDiscussionPageContext()
  const { isOpen, onToggle } = useDisclosure()
  return (
    <Box>
      {/* Create post pop up */}
      <Collapse in={isOpen} animateOpacity>
        <PostCreatorEditor {...user} />
      </Collapse>
      {/* Toolbar */}
      <Flex
        backgroundColor="gray.1000"
        borderRadius="5px"
        align="center"
        width="100%"
      >
        <Stack
          direction="row"
          spacing={10}
          width="100%"
          align="left"
          wrap="wrap"
        >
          {/*Publication filter*/}
          <Button
            marginLeft={2}
            paddingX={2}
            textAlign="center"
            rightIcon={<FaChevronDown size="10px" />}
            textColor="gray.700"
            variant="ghost"
          >
            <Flex direction="row">
              <Text
                paddingLeft={2}
                maxWidth="400px"
                overflow="hidden"
                fontSize="5xl"
              >
                {context.currentPublication}
              </Text>
            </Flex>
          </Button>
          {/*Post type filter: Article, Question, Classified*/}
          <Button
            align="center"
            variant="ghost"
            textColor="gray.700"
            rightIcon={<FaChevronDown size="10px" />}
          >
            <HStack>
              {<DiscussionFilterIcons visible={context.visiblePostTypes} />}
            </HStack>
          </Button>
          {/*Filter selector*/}
          <Button
            rightIcon={<FaChevronDown size="10px" />}
            variant="ghost"
            textColor="gray.700"
          >
            {context.discussionFilter}
          </Button>
          {/*Spacer*/}
          <Spacer />
          {/*Create post button*/}
          <Button
            rightIcon={<FaPlus size="15px" />}
            variant="solid"
            textColor="gray.800"
            backgroundColor="gray.200"
            onClick={onToggle}
          >
            Create Post
          </Button>
        </Stack>
      </Flex>
      <Divider marginTop="8px" />
    </Box>
  )
}

export default DiscussionToolbar
