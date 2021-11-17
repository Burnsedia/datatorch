import React from 'react'
import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage
} from 'next'
import { LayoutNavbarSidebar } from '@/common/layouts/LayoutNavbarSidebar'
import { AppNavbar } from '@/common/navbar/AppNavbar'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Input,
  Text,
  useColorModeValue as mode,
  Container,
  useBreakpointValue,
  Divider,
  VStack,
  Icon,
  Alert,
  AlertIcon,
  ButtonProps
} from '@chakra-ui/react'
import { useScrollBarTheme } from '@/libs/hooks/useScrollbarTheme'
import { Card } from '@/common/Card'
import { FaBook } from 'react-icons/fa'
import { SiGraphql } from 'react-icons/si'
import { MdFeedback } from 'react-icons/md'
import { cookieChecker, redirectToLogin, UserData } from '@/libs/utils/cookies'

export interface IndexProps {
  user?: UserData
}

const FooterButton: React.FC<{ leftIcon?: ButtonProps['leftIcon'] }> = ({
  leftIcon,
  children
}) => {
  return (
    <Button
      variant="ghost"
      isFullWidth
      flexDirection="column"
      alignItems="flex-start"
    >
      <Box>
        {leftIcon}{' '}
        <Text as="span" marginLeft={2}>
          {children}
        </Text>
      </Box>
    </Button>
  )
}

const HomeSidebar: React.FC<IndexProps> = ({ user }) => {
  return (
    <Flex
      backgroundColor={mode('gray.100', 'gray.800')}
      flexDirection="column"
      padding="4"
      width={{ base: null, md: '20em' }}
    >
      <Button
        isFullWidth
        alignItems="flex-start"
        flexDirection="column"
        variant="ghost"
        paddingY={7}
        paddingX={4}
      >
        <Flex alignItems="center">
          <Avatar
            size="sm"
            name="Dan Abrahmov"
            src="https://bit.ly/dan-abramov"
          />
          <Text paddingLeft={5}>{user?.login ?? ''}</Text>
        </Flex>
      </Button>

      <Divider marginTop={2} />

      <Box flexGrow={1}>
        <Box paddingTop={8}>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontWeight="bold" letterSpacing="wider">
              Projects
            </Text>
            <Button size="sm" colorScheme="green">
              New
            </Button>
          </Flex>

          <Input
            size="sm"
            marginY={2}
            variant="filled"
            placeholder="Search projects"
          />
        </Box>

        <Box paddingTop={5}>
          <Text fontSize="sm" fontWeight="bold" letterSpacing="wider">
            Articles
          </Text>

          <Text fontSize="sm" color="gray.400">
            Write articles to share information with your team or the world.
          </Text>
        </Box>

        <Box paddingTop={5}>
          <Text fontSize="sm" fontWeight="bold" letterSpacing="wider">
            Your teams
          </Text>

          <Text fontSize="sm" color="gray.400">
            You are not apart of any teams.
          </Text>
        </Box>
      </Box>

      <Divider marginBottom={2} />

      <Box>
        <VStack alignItems="flex-start" spacing={0}>
          <FooterButton leftIcon={<Icon as={FaBook}></Icon>}>
            Documentation
          </FooterButton>
          <FooterButton leftIcon={<Icon as={SiGraphql}></Icon>}>
            GraphQL
          </FooterButton>
          <FooterButton leftIcon={<Icon as={MdFeedback}></Icon>}>
            Feedback
          </FooterButton>
        </VStack>
      </Box>
    </Flex>
  )
}

const LayoutHome: React.FC<IndexProps> = ({ children, user }) => {
  const scrollCss = useScrollBarTheme()
  return (
    <LayoutNavbarSidebar
      navbar={AppNavbar}
      sidebar={<HomeSidebar user={user} />}
      contentContainer={{ css: scrollCss }}
    >
      {children}
    </LayoutNavbarSidebar>
  )
}

const Home: NextPage<IndexProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const isLg = useBreakpointValue({ base: false, lg: true })
  return (
    <LayoutHome {...props}>
      <Flex paddingTop={5}>
        <Container maxWidth="4xl" flexGrow={1}>
          <Alert
            marginBottom={5}
            rounded="md"
            variant="subtle"
            status="warning"
          >
            <AlertIcon />
            We are in early access and still improving the user experience. Feel
            free to give us feedback.
          </Alert>

          <Text fontWeight="bold">Recent Activity</Text>
          <Card marginY={3}></Card>

          <Text fontWeight="bold" paddingY={3} fontSize="sm">
            All Activity
          </Text>
        </Container>

        {isLg && (
          <Box flexShrink={0} width={320}>
            <Text fontWeight="bold" paddingY={3} fontSize="sm">
              Explore projects
            </Text>
            hgjhgkjhgkjhgk jhgkjhkgjhkgjhgk -jgkjhgkjhgkjhgk jh khgkjhg hkg g
            kjkg jhk gjhk ghj ghj g
          </Box>
        )}
      </Flex>
    </LayoutHome>
  )
}
export default Home

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await cookieChecker(context)
  if (!user) return redirectToLogin(context.res)
  return {
    props: { user }
  }
}
