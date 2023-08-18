import { useState, useEffect, ChangeEvent } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';

import { api } from '../../services/apiClient';

type HealthProtocol = {
  id: string;
  title: string;
  description: string;
}

interface HealthProtocolEditModalProps {
  isOpen: boolean;
  healthProtocol: HealthProtocol;
  onClose: () => void;
  refetchList: () => void;
}

export function HealthProtocolEditModal({ isOpen, onClose, healthProtocol, refetchList }: HealthProtocolEditModalProps) {
  const [title, setTitle] = useState(healthProtocol.title)
  const [description, setDescription] = useState(healthProtocol.description)
  const [touched, setTouched] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setTitle(healthProtocol.title)
    setDescription(healthProtocol.description)
  }, [healthProtocol])

  function handleTitleInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleDescriptionInputChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setDescription(event.target.value)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleClose() {
    setTitle(healthProtocol.title)
    setDescription(healthProtocol.description)
    setTouched(false)
    onClose()
  }

  async function handleHealthProtocolUpdate() {
    if(title !== '' && description !== '') {
      let body: any = {}
      if(title !== healthProtocol.title) {
        body = { ...body, title }
      }
      if(description !== healthProtocol.description) {
        body = { ...body, description }
      }
      if(Object.keys(body).length === 0) {
        toast({
          title: "Erro na alteração do protocolo",
          description: "Não houve nenhuma alteração nos campos",
          status: "error",
          isClosable: true
        })
        return
      }
      try {
        setIsUpdating(true)
        const response = await api.put(`/healthprotocol/${healthProtocol.id}`, body)
        toast({
          title: "Sucesso na alteração do protocolo",
          description: response.data?.success,
          status: "success",
          isClosable: true
        })
        setTouched(false)
        onClose()
        refetchList()
      } catch (error: any) {
        toast({
          title: "Erro na alteração do protocolo",
          description: error.response?.data.error,
          status: "error",
          isClosable: true
        })
      }
      setIsUpdating(false)
    } else {
      toast({
        title: "Erro na alteração do protocolo",
        description: "Preencha os campos corretamente",
        status: "error",
        isClosable: true
      })
    }
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
          <ModalHeader textAlign="center">Editar protocolo de saúde</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="semibold" mb="2">Título</Text>
            <Input value={title} mb="2" onChange={handleTitleInputChanged}/>
            <Text fontWeight="semibold" mt="2">Descrição</Text>
            <Textarea value={description} mb="2" height="100px" onChange={handleDescriptionInputChanged}/>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleClose} mr="3">Cancelar</Button>
            <Button 
              onClick={handleHealthProtocolUpdate} 
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