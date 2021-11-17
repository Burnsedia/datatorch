import React from 'react'
import {
  IconButton,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  MenuDivider,
  LinkBox
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { FaPlus, FaProjectDiagram, FaUsers } from 'react-icons/fa'
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0'

export const CreateMenu: React.FC = () => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Create menu"
        size="sm"
        variant="ghost"
        mr="1"
        icon={<Icon as={FaPlus} />}
      />
      <MenuList>
        <NextLink href="/project/new" passHref>
          <MenuItem
            as={LinkBox}
            cursor="pointer"
            icon={<Icon as={FaProjectDiagram} />}
          >
            New Project
          </MenuItem>
        </NextLink>
        <NextLink href="/orgs/new" passHref>
          <MenuItem as={LinkBox} cursor="pointer" icon={<Icon as={FaUsers} />}>
            New Organization
          </MenuItem>
        </NextLink>
      </MenuList>
    </Menu>
  )
}

export const UserMenu: React.FC = () => {
  const router = useRouter()
  const { user, error, isLoading } = useUser()
  // This is replaced by auth0 in DT Cloud
  //const [logoutMutation] = useLogoutMutation()
  const onSignout = async () => {
    try {
      //await logoutMutation()
    } catch {
    } finally {
      //router.push('/login')
      router.push('/api/auth/logout')
    }
  }

  const onSignin = async () => {
    try {
      router.push('/api/auth/login')
    } catch (error) {}
  }

  return (
    <Menu>
      <MenuButton as={Avatar} size="xs" m="1" cursor="pointer" />
      <MenuList>
        <MenuItem>Profile</MenuItem>
        <MenuItem>Projects</MenuItem>
        <MenuItem>Starred</MenuItem>
        <MenuItem>Agents</MenuItem>
        <MenuDivider />
        <NextLink href="/settings" passHref>
          <MenuItem as={LinkBox}>Settings</MenuItem>
        </NextLink>
        <MenuItem>Documentation</MenuItem>
        <MenuDivider />
        {user ? (
          <MenuItem onClick={onSignout}>Sign out</MenuItem>
        ) : (
          <MenuItem onClick={onSignin}>Sign in</MenuItem>
        )}
      </MenuList>
    </Menu>
  )
}
