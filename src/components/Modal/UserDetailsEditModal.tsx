import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";
import {
  Button,
  Flex,
  FormControl, 
  FormErrorMessage, 
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  Select,
  Stack,
  Input,
  useToast,
} from '@chakra-ui/react';

import { api } from '../../services/apiClient';
import "../../validators/cpfValidator"

type SystemUser = {
  id: string;
  name: string;
  CPF: string;
  email: string;
  department: string;
  createdAt: string;
}

type UserData = {
  name: string;
  cpf: string;
  email: string;
  sector: string;
}

interface UserDetailsEditModalProps {
  isOpen: boolean;
  user: SystemUser;
  onClose: () => void;
  refetch: () => void;
}

const schema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  cpf: yup.string().cpf().required('CPF obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail obrigatório'),
  sector: yup.string().required('Setor obrigatório'),
})

export function UserDetailsEditModal({ isOpen, onClose, user, refetch }: UserDetailsEditModalProps) {
  const defaultValues = {
    name: user.name,
    cpf: user.CPF.replaceAll(/[.-]/g, ''),
    email: user.email,
    sector: user.department === "Unidade de saúde" ? "USM" : "SVS"
  }
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  })
  const { errors } = formState
  const [isUpdating, setIsUpdating] = useState(false)
  const toast = useToast()

  const handleUpdate: SubmitHandler<UserData> = async (values) => {
    let body: any = {}

    if(values.cpf !== user.CPF.replaceAll(/[.-]/g, '')) {
      body = { ...body, CPF: values.cpf }
    }

    if(values.email !== user.email) {
      body = { ...body, email: values.email }
    }

    if(values.name !== user.name) {
      body = { ...body, name: values.name }
    }

    if(values.sector !== (user.department === "Unidade de saúde" ? "USM" : "SVS")) {
      body = { ...body, department: values.sector }
    }

    if(Object.keys(body).length > 0) {
      setIsUpdating(true)
      try {
        const response = await api.put(`/systemuser/${user.id}`, body)
        toast({
          title: "Sucesso na alteração do usuário",
          description: response.data?.success,
          status: "success",
          isClosable: true
        })
        onClose()
        refetch()
      } catch (error: any) {
        toast({
          title: "Erro na alteração do usuário",
          description: "Email e/ou CPF já cadastrados",
          status: "error",
          isClosable: true
        })
      }
      setIsUpdating(false)
    } else {
      toast({
        title: "Erro na alteração do usuário",
        description: "Campos sem nenhuma alteração",
        status: "error",
        isClosable: true
      })
    }
  }

  function handleClose() {
    onClose()
    reset(defaultValues)
  }
  
  return (
    <Modal 
      motionPreset="slideInBottom" 
      size="xl" 
      isOpen={isOpen} 
      onClose={handleClose} 
      isCentered 
      closeOnOverlayClick={false}
    >
      <ModalOverlay>
        <ModalContent height="auto" width="500px">
          <ModalHeader textAlign="center">Editar dados do usuário</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="4" as="form" onSubmit={handleSubmit(handleUpdate)}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Nome</FormLabel>
                <Input 
                  type="text" 
                  label="name" 
                  {...register("name")}
                />
                { !!errors.name && (
                <FormErrorMessage>
                  {errors.name.message}
                </FormErrorMessage>
              )}
              </FormControl>
              <FormControl isInvalid={!!errors.cpf}>
                <FormLabel>CPF</FormLabel>
                <Input 
                  type="text" 
                  {...register("cpf")}
                />
                { !!errors.cpf && (
                <FormErrorMessage>
                  {errors.cpf.message}
                </FormErrorMessage>
              )}
              </FormControl>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>E-mail</FormLabel>
                <Input 
                  type="email" 
                  {...register("email")}
                />
                { !!errors.email && (
                <FormErrorMessage>
                  {errors.email.message}
                </FormErrorMessage>
              )}
              </FormControl>
              <FormControl isInvalid={!!errors.sector}>
                <FormLabel>Setor</FormLabel>
                <Select {...register("sector")}>
                  <option value="USM">Unidade de saúde</option>
                  <option value="SVS">Vigilância em saúde</option>
                </Select>
                { !!errors.sector && (
                <FormErrorMessage>
                  {errors.sector.message}
                </FormErrorMessage>
              )}
              </FormControl>
              <Flex pb="4" pt="3" justifyContent="flex-end">
                <Button onClick={handleClose} mr="3">Cancelar</Button>
                <Button 
                  type="submit"
                  colorScheme="blue" 
                  isLoading={isUpdating}
                >
                  Atualizar
                </Button>
              </Flex>
            </Stack>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}