import { useState, ChangeEvent } from 'react';
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

interface HealthProtocolAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchList: () => void;
}

export function HealthProtocolAddModal({ isOpen, onClose, refetchList }: HealthProtocolAddModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [touched, setTouched] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const toast = useToast()

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
    setTitle('')
    setDescription('')
    setTouched(false)
    onClose()
  }

  async function handleHealthProtocolCreation() {
    if(title !== '' && description !== '') {
      setIsPosting(true)
      try {
        const response = await api.post('/healthprotocol/', { title, description })
        toast({
          title: "Sucesso na criação do protocolo",
          description: response.data?.success,
          status: "success",
          isClosable: true
        })
        handleClose()
        refetchList()
      } catch (error: any) {
        toast({
          title: "Erro na criação do protocolo",
          description: error.response?.data.error,
          status: "error",
          isClosable: true
        })
      }
      setIsPosting(false)
    } else {
      toast({
        title: "Erro na criação do protocolo",
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
          <ModalHeader textAlign="center">Adicionar protocolo de saúde</ModalHeader>
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
              onClick={handleHealthProtocolCreation} 
              colorScheme="blue" 
              disabled={!touched} 
              isLoading={isPosting}
            >
              Registrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}