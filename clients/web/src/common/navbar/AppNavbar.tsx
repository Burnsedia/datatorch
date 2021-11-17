import React from 'react'
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Image,
  Link,
  LinkBox,
  Spacer,
  useDisclosure
} from '@chakra-ui/react'
import { CreateMenu, UserMenu } from './AppNavbarMenus'
import { FaBars } from 'react-icons/fa'
import NextLink from 'next/link'

const Brand: React.FC = () => (
  <NextLink href="/" passHref>
    <LinkBox cursor="pointer">
      <Image src="https://datatorch.io/icon/navbar.png" h={9} />
    </LinkBox>
  </NextLink>
)

export const NavbarContainer: React.FC = ({ children }) => (
  <Flex
    position="relative"
    height="10"
    width="full"
    as="nav"
    alignItems="center"
    p="2"
    px={{ base: 3, md: 8 }}
    boxShadow="md"
    flexShrink={0}
    justify="space-between"
    borderBottom="1px"
    backgroundColor="gray.800"
    borderColor="gray.700"
  >
    {children}
  </Flex>
)

export const AppNavbar: React.FC = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <NavbarContainer>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen} size="xs">
        <DrawerOverlay>
          <DrawerContent bgColor="gray.800">
            <DrawerBody>{children}</DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
      <Flex>
        {children && (
          <IconButton
            icon={<Icon as={FaBars} />}
            variant="ghost"
            onClick={onOpen}
            size="sm"
            marginRight="2"
            aria-label="Dropdown menu"
          />
        )}
        <Brand />
      </Flex>
      <Flex m={4}>
        <Link m={4} color="gray.700">
          Projects
        </Link>
        <Link m={4} href="/d/General">
          Discussion
        </Link>
      </Flex>
      <Spacer />
      <Box>
        <CreateMenu />
        <UserMenu />
      </Box>
    </NavbarContainer>
  )
}
