import React from 'react'
import { NextPage } from 'next'
import { LayoutNavbar } from '@/common/layouts/LayoutNavbar'
import { AppNavbar } from '@/common/navbar/AppNavbar'
import { useUser } from '@auth0/nextjs-auth0'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  Text,
  Image,
  useColorModeValue as mode,
  Container,
  useBreakpointValue,
  Divider,
  VStack,
  Icon,
  Alert,
  AlertIcon,
  ButtonProps,
  HStack
} from '@chakra-ui/react'

const ProfilePictureBio: React.FC = () => {
  const { user, error, isloading } = useUser()
  return (
    <VStack m={5} minWidth={200} backgroundColor="gray.800">
      <Flex direction="column">
        <Image
          src={user?.picture}
          alt={user?.name}
          borderRadius="full"
          boxSize="200px"
        ></Image>
        <Box my={2}>
          <Text fontWeight="bold" fontSize="2xl">
            {user?.name}
          </Text>
          <Text fontSize="xl" color="gray.400">
            {user?.nickname}
          </Text>
        </Box>
        <Box mt={2} mb={4}>
          <Text maxWidth={200}>Occupation</Text>
          <Text maxWidth={200}>Organization</Text>
          <Text maxWidth={200}>Location</Text>
          <Text maxWidth={200}>Joined October 13, 2020</Text>
        </Box>
        <Button colorScheme="green">Edit profile</Button>
      </Flex>
    </VStack>
  )
}

const ProfileHeader: React.FC = () => {
  return (
    <Flex bgColor="black" mt={10} borderRadius="10px">
      <HStack align="start">
        <ProfilePictureBio></ProfilePictureBio>
        <ProfileToolbar />
      </HStack>
    </Flex>
  )
}

const ProfileToolbar: React.FC = () => {
  return (
    <Flex bgColor="gray.800" mt={10} borderRadius="10px" minHeight={70}>
      <HStack>
        <Text>aHome</Text>
        <Text>Activity</Text>
        <Text>Projects</Text>
        <Text>Datasets</Text>
        <Text>Articles</Text>
        <Text>Code</Text>
        <Text>Followers</Text>
      </HStack>
    </Flex>
  )
}

const ProfilePage: NextPage = () => {
  const { user, error, isLoading } = useUser()
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>
  return (
    <div>
      <LayoutNavbar navbar={<AppNavbar />}>
        <Container maxW="container.xl">
          <ProfileHeader></ProfileHeader>
        </Container>
      </LayoutNavbar>
    </div>
  )
}

export default ProfilePage
