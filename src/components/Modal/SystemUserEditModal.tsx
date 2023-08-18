import { useState, useEffect, ChangeEvent } from 'react';
import {
  Button,
  Checkbox,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Select,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';

import { useCan } from '../../hooks/useCan';
import { api } from '../../services/apiClient';

type SystemUser = {
  systemUser: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  authorized: boolean;
  localAdm: boolean;
  generalAdm: boolean;
}

interface SystemUserEditModalProps {
  isOpen: boolean;
  systemUser: SystemUser;
  onClose: () => void;
  refetchList: () => void;
}

export function SystemUserEditModal({ isOpen, onClose, systemUser, refetchList }: SystemUserEditModalProps) {
  const [department, setDepartment] = useState(systemUser.systemUser.department)
  const [authorized, setAuthorized] = useState(systemUser.authorized)
  const [localAdm, setLocalAdm] = useState(systemUser.localAdm)
  const [generalAdm, setGeneralAdm] = useState(systemUser.generalAdm)
  const [touched, setTouched] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const toast = useToast()
  const isGeneralAdm = useCan({ roles: ['general.admin'] })
  
  useEffect(() => {
    setDepartment(systemUser.systemUser.department)
    setAuthorized(systemUser.authorized)
    setLocalAdm(systemUser.localAdm)
    setGeneralAdm(systemUser.generalAdm)
  }, [systemUser])

  function handleClose() {
    setDepartment(systemUser.systemUser.department)
    setAuthorized(systemUser.authorized)
    setLocalAdm(systemUser.localAdm)
    setGeneralAdm(systemUser.generalAdm)
    setTouched(false)
    onClose()
  }

  function handleEditDepartment(event: ChangeEvent<HTMLSelectElement>) {
    setDepartment(event.target.value)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleEditAuthorized(event: ChangeEvent<HTMLInputElement>) {
    setAuthorized(event.target.checked)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleEditLocalAdmin(event: ChangeEvent<HTMLInputElement>) {
    setLocalAdm(event.target.checked)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleEditGeneralAdmin(event: ChangeEvent<HTMLInputElement>) {
    setGeneralAdm(event.target.checked)
    if(!touched) {
      setTouched(true)
    }
  }

  async function handleUserUpdate() {
    let body: any = {}

    if(systemUser.authorized !== authorized) {
      body = { ...body, authorized }
    } 

    if(systemUser.localAdm !== localAdm) {
      body = { ...body, localAdm }
    } 

    if(systemUser.generalAdm !== generalAdm) {
      body = { ...body, generalAdm }
    } 

    const permissionsHasChanged = Object.keys(body).length > 0 ? true : false

    setIsUpdating(true)

    if(department !== systemUser.systemUser.department && (department === "USM" || department === "SVS")) {
      if(!permissionsHasChanged) {
        try {
          const response = await api.put(`/systemuser/${systemUser.systemUser.id}`, { department })
          toast({
            title: "Sucesso na alteração do usuário",
            description: response.data?.success,
            status: "success",
            isClosable: true
          })
          setTouched(false)
          onClose()
          refetchList()
        } catch (error: any) {
          toast({
            title: "Erro na alteração do usuário",
            description: error.response?.data.error,
            status: "error",
            isClosable: true
          })
        }
      } else {
        try {
          const [userResponse, permissionsResponse] = await Promise.all([
            api.put(`/systemuser/${systemUser.systemUser.id}`, { department }),
            api.put(`/permissions/${systemUser.systemUser.id}`, body)
          ])
          toast({
            title: "Sucesso na alteração do usuário",
            description: userResponse.data?.success,
            status: "success",
            isClosable: true
          })
          setTouched(false)
          onClose()
          refetchList()
        } catch (error: any) {
          toast({
            title: "Erro na alteração do usuário",
            description: error.response?.data.error,
            status: "error",
            isClosable: true
          })
        }
      }
    } else {
      if(permissionsHasChanged) {
        try {
          const response = await api.put(`/permissions/${systemUser.systemUser.id}`, body)
          toast({
            title: "Sucesso na alteração do usuário",
            description: response.data?.success,
            status: "success",
            isClosable: true
          })
          setTouched(false)
          onClose()
          refetchList()
        } catch (error: any) {
          toast({
            title: "Erro na alteração do usuário",
            description: error.response?.data.error,
            status: "error",
            isClosable: true
          })
        }
      }
      else {
        toast({
          title: "Erro na alteração do usuário",
          description: "Campos sem nenhuma alteração",
          status: "error",
          isClosable: true
        })
      }
    }
    setIsUpdating(false)
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
        <ModalContent height="auto" width="400px">
          <ModalHeader textAlign="center">Editar usuário de sistema</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="semibold" mb="3">Setor</Text>
            <Select value={department} mb="3" onChange={handleEditDepartment}>
              <option value="USM">Unidade de saúde</option>
              <option value="SVS">Vigilância em saúde</option>
            </Select>
            <Divider my="5"/>
            <VStack spacing="3" alignItems="flex-start">
              <Checkbox isChecked={authorized} onChange={handleEditAuthorized} size="lg">
                Autorizado
              </Checkbox>
              <Checkbox isChecked={localAdm} onChange={handleEditLocalAdmin} size="lg">
                Administrador local
              </Checkbox>
              <Checkbox size="lg" isChecked={generalAdm} onChange={handleEditGeneralAdmin} isDisabled={!isGeneralAdm}>
                Administrador geral
              </Checkbox>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleClose} mr="3">Cancelar</Button>
            <Button 
              onClick={handleUserUpdate} 
              colorScheme="blue" 
              disabled={!touched} 
              isLoading={isUpdating}
            >
              Atualizar
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}