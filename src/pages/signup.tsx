import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Router from 'next/router'
import InputMask from 'react-input-mask'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";

import { 
  Box,
  Button, 
  Flex, 
  FormControl, 
  FormErrorMessage, 
  FormLabel, 
  Heading, 
  Icon, 
  Input, 
  InputGroup, 
  InputLeftElement, 
  InputRightElement,
  Link as ChakraLink, 
  Select, 
  Stack, 
  Text,
  useToast
} from '@chakra-ui/react'
import { MdEmail, MdPerson, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { HiLockClosed, HiIdentification } from 'react-icons/hi'

import "../validators/cpfValidator"
import { api } from '../services/apiClient'

type SignUpData = {
  name: string;
  cpf: string;
  email: string;
  sector: string;
  password: string;
  passwordConfirmation: string;
}

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  cpf: yup.string().cpf().required('CPF obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  sector: yup.string().required('Setor obrigatório'),
  password: yup.string().required('Senha obrigatória').matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
    "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caracter especial"
  ),
  password_confirmation: yup.string().oneOf([
    null, yup.ref('password')
  ], 'As senhas precisam ser iguais').required('Confirmação de senha obrigatória')
})

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmationPassword, setShowConfirmationPassword] = useState(false)
  const toast = useToast()

  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema)
  })
  const { errors } = formState

  const handleSignIn: SubmitHandler<SignUpData> = async (values) => {
    try {
      const response = await api.post('/systemuser/signup', {
        name: values.name,
        CPF: values.cpf.replaceAll(/[.-]/g, ''),
        email: values.email,
        password: values.password,
        department: values.sector,
      })
      toast({
        title: "Cadastro realizado com sucesso",
        description: response.data?.success,
        status: "success",
        isClosable: true
      })
      Router.push('/')
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error?.response?.data.error,
        status: "error",
        isClosable: true
      })
    }
  }
  
  return (
    <>
      <Head>
        <title>MoniPaEp | Cadastro</title>
      </Head>
      <Flex height="100vh" alignItems="center" justifyContent="center" background="custom.blue-300" overflow="auto">
        <Flex direction="column" background="custom.blue-50" p="9" rounded="7" maxWidth={400} m="auto">
          <Heading mb={6} color="custom.gray-800" textAlign="center" >Cadastre-se no MoniPaEp</Heading >
          <Flex as="form" direction="column" onSubmit={handleSubmit(handleSignIn)}>
            <Stack spacing={4} mb={4}>     
              <FormControl id="form-name" isInvalid={!!errors.name}>
                <FormLabel htmlFor="name" id="label-for-name" color="custom.gray-800">Nome</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={MdPerson} color="custom.blue-600"/>
                  </InputLeftElement>
                  <Input 
                    type="text" 
                    label="name" 
                    color="custom.gray-800"
                    bgColor="custom.blue-100"
                    variant="filled"
                    borderColor="custom.blue-300"
                    _hover={{
                      'borderColor': 'custom.blue-400'
                    }}
                    focusBorderColor="custom.blue-500"
                    {...register("name")}
                  />
                </InputGroup>
                { !!errors?.name && (
                  <FormErrorMessage>
                    {errors.name?.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl id="form-cpf" isInvalid={!!errors.cpf}>
                <FormLabel htmlFor="cpf" id="label-for-cpf" color="custom.gray-800">CPF</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={HiIdentification} color="custom.blue-600"/>
                  </InputLeftElement>
                  <Input 
                    as={InputMask}
                    mask="999.999.999-99"
                    type="text" 
                    color="custom.gray-800"
                    bgColor="custom.blue-100"
                    variant="filled"
                    borderColor="custom.blue-300"
                    _hover={{
                      'borderColor': 'custom.blue-400'
                    }}
                    focusBorderColor="custom.blue-500"
                    {...register("cpf")}
                  />
                </InputGroup>
                { !!errors?.cpf && (
                  <FormErrorMessage>
                    {errors.cpf?.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl id="form-email" isInvalid={!!errors.email}>
                <FormLabel htmlFor="email" id="label-for-email" color="custom.gray-800">E-mail</FormLabel>
                <InputGroup>
                  <InputLeftElement>
                    <Icon as={MdEmail} color="custom.blue-600"/>
                  </InputLeftElement>
                  <Input 
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

              <FormControl id="form-sector" isInvalid={!!errors.sector}>
                <FormLabel htmlFor="sector" id="label-for-sector" color="custom.gray-800">Setor</FormLabel>
                <Select 
                  placeholder="Selecione seu setor" 
                  color="custom.gray-800"
                  bgColor="custom.blue-100"
                  variant="filled"
                  borderColor="custom.blue-300"
                  _hover={{
                    'borderColor': 'custom.blue-400'
                  }}
                  focusBorderColor="custom.blue-500"
                  {...register("sector")}
                >
                  <option value="USM">Unidade de saúde</option>
                  <option value="SVS">Vigilância em saúde</option>
                </Select>
                { !!errors?.sector && (
                  <FormErrorMessage>
                    {errors.sector?.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <FormControl id="form-password" isInvalid={!!errors.password}>
                <FormLabel htmlFor="password" id="label-for-password" color="custom.gray-800">Senha</FormLabel>
                <InputGroup >
                  <InputLeftElement>
                    <Icon as={HiLockClosed} color="custom.blue-600"/>
                  </InputLeftElement>
                  <Input 
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

              <FormControl id="form-password-confirmation" isInvalid={!!errors.password_confirmation}>
                <FormLabel htmlFor="password" id="label-for-password-confirmation" color="custom.gray-800">Confirmação da senha</FormLabel>
                <InputGroup >
                  <InputLeftElement>
                    <Icon as={HiLockClosed} color="custom.blue-600"/>
                  </InputLeftElement>
                  <Input 
                    type={showConfirmationPassword ? "text": "password"}
                    label="password" 
                    color="custom.gray-800"
                    bgColor="custom.blue-100"
                    variant="filled"
                    borderColor="custom.blue-300"
                    _hover={{
                      'borderColor': 'custom.blue-400'
                    }}
                    focusBorderColor="custom.blue-500"
                    {...register("password_confirmation")}
                  />
                  <InputRightElement>
                    <Icon 
                      as={showConfirmationPassword ? MdVisibility : MdVisibilityOff} 
                      color="custom.blue-600" 
                      _hover={{'cursor': 'pointer'}}
                      onClick={() => setShowConfirmationPassword(prevState => !prevState)}
                    />
                  </InputRightElement>
                </InputGroup>
                { !!errors?.password_confirmation && (
                  <FormErrorMessage>
                    {errors.password_confirmation?.message}
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
              CADASTRAR
            </Button>
            
            <Box display="flex" width="100%" justifyContent="center" mt="8">
              <Text>Já tem uma conta?&nbsp;</Text>
              <Link href="/" passHref>
                <ChakraLink color="blue.600" fontWeight="semibold">
                  Entrar
                </ChakraLink>
              </Link>
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}
