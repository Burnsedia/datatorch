import React, { useState } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/router'
import {
  Text,
  Link as ChakraLink,
  Container,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Checkbox,
  Button
} from '@chakra-ui/react'
import { useLoginMutation } from '@/generated/graphql'

interface Inputs {
  username: string
  password: string
  remember: boolean
}

const Login: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>()

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loginMutation] = useLoginMutation()
  const router = useRouter()

  const onSubmit: SubmitHandler<Inputs> = async (
    { username, password, remember },
    _
  ) => {
    try {
      await loginMutation({
        variables: {
          login: username,
          password,
          remember
        }
      })
      setError(null)
      setSuccess(`Login succeeded. Redirecting...`)
      router.push('/home')
    } catch (e) {
      setSuccess(null)
      setError('Invalid credentials.')
    }
  }

  return (
    <Container mt={5}>
      <Text as="b" fontSize="xl">
        Sign in to DataTorch
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.username?.message.length > 0}>
          <FormLabel mt={3} htmlFor="username">
            Username
          </FormLabel>
          <Input
            type="text"
            {...register('username', { required: 'Username is required' })}
          />
          <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password?.message.length > 0}>
          <FormLabel htmlFor="password" mt={4}>
            Password
          </FormLabel>
          <Input
            type="password"
            {...register('password', { required: 'Password is required' })}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <Checkbox mt={4} {...register('remember')}>
          Remember me for one month
        </Checkbox>
        <br />
        <Button
          width="100%"
          mt={5}
          isLoading={isSubmitting}
          type="submit"
          colorScheme="teal"
        >
          Login
        </Button>
      </form>

      <Text mt={3}>
        Don&apos;t have an account?{' '}
        <Link href="/register">
          <ChakraLink color="teal.500">Sign up</ChakraLink>
        </Link>
      </Text>
      <Text mt={3} color="red">
        {error}
      </Text>
      <Text mt={3} color="green">
        {success}
      </Text>
    </Container>
  )
}

export default Login
