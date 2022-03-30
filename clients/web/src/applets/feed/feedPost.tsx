import React from 'react'
import {
  Avatar,
  Divider,
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
  useToast,
  VStack,
  HStack
} from '@chakra-ui/react'
import { Card } from '@/common/Card'
import { FaComment, FaEye, FaHeart, FaTrash, FaEllipsisH } from 'react-icons/fa'

const FeedPost: React.FC<any> = () => {
  return (
    //   Example activity
    <Card marginY={3} paddingY={3}>
      {/* This Flex should be its own component like activityheader */}
      <Flex paddingBottom={3} alignItems={'center'} fontSize={12}>
        <Avatar
          size="xs"
          name="Dan Abrahmov"
          src="https://bit.ly/dan-abramov"
          marginRight={3}
        />
        <Link fontWeight={700}>Ninjeezy</Link>
        &nbsp;liked this
        <Spacer />
        <FaEllipsisH fontSize={16} />
      </Flex>
      {/* This divider should only appear if the above is present */}
      <Divider />
      {/* This Flex should be its own component like activityheader */}
      <Flex paddingY={3} alignItems={'center'}>
        <HStack>
          <Avatar
            size="md"
            name="Dan Abrahmov"
            src="https://bit.ly/dan-abramov"
            marginRight={3}
          />
          <VStack spacing="0px" alignItems="start">
            <Text fontWeight={700} margin={0} padding={0}>
              Alexis Comar
            </Text>
          </VStack>
        </HStack>
      </Flex>
      <Divider />
      <Text fontWeight={700} marginTop={3}>
        HELP
      </Text>
    </Card>
  )
}

export default FeedPost
