import React from 'react'
import {
  Box,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Icon,
  Input,
  Radio,
  RadioGroup,
  Text,
  VStack,
  useColorModeValue as mode,
  Divider,
  Heading,
  Button,
  TextProps,
  useBreakpointValue
} from '@chakra-ui/react'
import { MdLock, MdPublic } from 'react-icons/md'
import { FaPlus } from 'react-icons/fa'
import { Controller, useForm } from 'react-hook-form'
import slugify from 'slugify'

const Slash: React.FC<TextProps> = props => (
  <Text fontWeight="bold" fontSize="2xl" marginX="3" {...props}>
    /
  </Text>
)

interface ProjectCreateFormInputs {
  ownerId: string
  name: string
  description: string
  visibility: 'public' | 'private'
}

export const ProjectCreateForm: React.FC = () => {
  const { control, register, handleSubmit, formState } =
    useForm<ProjectCreateFormInputs>()

  const onSubmit = handleSubmit(inputs => {
    const slug = slugify(inputs.name)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const variables = { ...inputs, slug }
  })

  const isGteMd = useBreakpointValue({ base: false, md: true })

  return (
    <form onSubmit={onSubmit}>
      <Heading fontSize="xl" letterSpacing="wide" marginBottom={1}>
        Create a Project
      </Heading>

      <Text color={mode('gray.600', 'gray.300')}>
        A project contains all aspects to the lifecycle of machine learning
        models. Including, datasets, versions, pipelines and more.
      </Text>

      <Divider my="5" />

      <FormControl>
        <Flex
          alignItems="flex-end"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <FormControl
            isRequired
            width={{ base: '100%', md: 320 }}
            marginBottom={{ base: 2, md: 0 }}
          >
            <FormLabel fontSize="sm">Owner</FormLabel>
            <Input {...register('ownerId')} size="sm" />
          </FormControl>
          {isGteMd && <Slash />}
          <FormControl isRequired>
            <FormLabel fontSize="sm">Project name</FormLabel>
            <Input {...register('name')} size="sm" />
          </FormControl>
        </Flex>
        <FormHelperText fontSize="xs">
          Great project names are short and memorable.
        </FormHelperText>
      </FormControl>

      <FormControl id="description" marginTop="2">
        <FormLabel fontSize="sm">Description</FormLabel>
        <Input {...register('description')} size="sm" />
      </FormControl>

      <Divider marginY="7" />

      <FormControl as="fieldset">
        <Controller
          control={control}
          name="visibility"
          defaultValue="private"
          render={({ field }) => (
            <RadioGroup {...field}>
              <VStack spacing="2" alignItems="flex-start">
                <Radio value="private">
                  <Flex alignItems="center">
                    <Icon as={MdLock} w={8} h={8} marginX={2} />
                    <Box>
                      <Text fontWeight="semibold" fontSize="sm">
                        Private
                      </Text>
                      <FormHelperText marginTop={0} fontSize="xs">
                        You choose who can see and change this project.
                      </FormHelperText>
                    </Box>
                  </Flex>
                </Radio>
                <Radio value="public">
                  <Flex alignItems="center">
                    <Icon as={MdPublic} w={8} h={8} marginX={2} />
                    <Box>
                      <Text fontWeight="semibold" fontSize="sm">
                        Public
                      </Text>
                      <FormHelperText marginTop={0} fontSize="xs">
                        Anyone on the internet can see this project.
                      </FormHelperText>
                    </Box>
                  </Flex>
                </Radio>
              </VStack>
            </RadioGroup>
          )}
        />
      </FormControl>

      <Divider marginY="5" />

      <Button
        type="submit"
        colorScheme="green"
        leftIcon={<Icon as={FaPlus} />}
        isLoading={formState.isSubmitting}
      >
        Create project
      </Button>
    </form>
  )
}
