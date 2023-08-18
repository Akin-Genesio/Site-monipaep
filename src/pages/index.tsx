import { useState, useContext } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Link from 'next/link'
import Head from 'next/head'
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import { 
  Box, 
  Button, 
  Link as ChakraLink, 
  Flex, 
  FormControl, 
  FormErrorMessage, 
  FormLabel, Heading, 
  Icon, 
  Input as ChakraInput, 
  InputGroup, 
  InputLeftElement, 
  InputRightElement, 
  Stack, 
  Text, 
  useToast 
} from '@chakra-ui/react'
import { MdEmail, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { HiLockClosed } from 'react-icons/hi'

import { withSSRGuest } from '../utils/withSSRGuest'
import { AuthContext } from '../contexts/AuthContext'

type LoginData = {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  password: yup.string().required('Senha obrigatória'),
})

const Home = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useContext(AuthContext)
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema)
  })
  const { errors } = formState
  const toast = useToast()

  const handleSignIn: SubmitHandler<LoginData> = async (values) => {
    try {
      await signIn(values)
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error?.message,
        status: "error",
        isClosable: true
      })
    }
  }
  
  return (
    <>
      <Head>
        <title>MoniPaEp | Login</title>
      </Head>
      <Flex height="100vh" alignItems="center" justifyContent="center" background="custom.blue-300">
        <Flex direction="column" background="custom.blue-50" p="8" rounded="7" maxWidth="400" mx="auto">
          <Heading mb={6} color="custom.gray-800" textAlign="center">Faça seu login no MoniPaEp</Heading>
          <Flex as="form" direction="column" onSubmit={handleSubmit(handleSignIn)}>
            <Stack spacing={4} mb={4}>     
              <FormControl id="form-email" isInvalid={!!errors.email}>
                <FormLabel htmlFor="email" id="label-for-email" color="custom.gray-800">E-mail</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={MdEmail} color="custom.blue-600"/>
                  </InputLeftElement>
                  <ChakraInput 
                    type="email" 
                    label="E-mail" 
                    color="custom.gray-800"
                    bgColor="custom.blue-100"
                    variant="filled"
                    borderColor="custom.blue-300"
                    _hover={{
                      'borderColor': 'custom.blue-400'
                    }}
                    focusBorderColor="custom.blue-500"
                    {...register("email")}
                  />
                </InputGroup>
                { !!errors?.email && (
                  <FormErrorMessage>
                    {errors.email?.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl id="form-password" isInvalid={!!errors.password}>
                <FormLabel htmlFor="password" id="label-for-password" color="custom.gray-800">Senha</FormLabel>
                <InputGroup >
                  <InputLeftElement>
                    <Icon as={HiLockClosed} color="custom.blue-600"/>
                  </InputLeftElement>
                  <ChakraInput 
                    type={showPassword ? "text": "password"}
                    label="password" 
                    color="custom.gray-800"
                    bgColor="custom.blue-100"
                    variant="filled"
                    borderColor="custom.blue-300"
                    _hover={{
                      'borderColor': 'custom.blue-400'
                    }}
                    focusBorderColor="custom.blue-500"
                    {...register("password")}
                  />
                  <InputRightElement>
                    <Icon 
                      as={showPassword ? MdVisibility : MdVisibilityOff} 
                      color="custom.blue-600" 
                      _hover={{'cursor': 'pointer'}}
                      onClick={() => setShowPassword(prevState => !prevState)}
                    />
                  </InputRightElement>
                </InputGroup>
                { !!errors?.password && (
                  <FormErrorMessage>
                    {errors.password?.message}
                  </FormErrorMessage>
                )}
              </FormControl>
            </Stack>
        
            <Button 
              type="submit" 
              mt="2"
              bgColor="custom.blue-600" 
              color="white"
              _hover={{'bgColor': 'custom.blue-500'}}
            >
              ENTRAR
            </Button>

            <Stack spacing="2" width="100%" justifyContent="center" alignItems="center" mt="6">
              <Box w="100%" display="flex" justifyContent="center">
                <Text>Não tem uma conta?&nbsp;</Text>
                <Link href="/signup" passHref>
                  <ChakraLink color="blue.600" fontWeight="semibold">
                    Cadastre-se
                  </ChakraLink>
                </Link>
              </Box>
              <Link href="#" passHref>
                <ChakraLink textAlign="center" color="blue.600" fontWeight="semibold">
                  Esqueceu a senha?
                </ChakraLink>
              </Link>
            </Stack>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return { props: {} }
})

export default Home
