import { useState, ChangeEvent } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Text,
  Input,
  useToast,
} from '@chakra-ui/react';

import { api } from '../../services/apiClient';

interface SymptomAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchList: () => void;
}

export function SymptomAddModal({ isOpen, onClose, refetchList }: SymptomAddModalProps) {
  const [newSymptom, setNewSymptom] = useState('')
  const [touched, setTouched] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const toast = useToast()

  function handleSymptomInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setNewSymptom(event.target.value)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleClose() {
    setNewSymptom('')
    setTouched(false)
    onClose()
  }

  async function handleSymptomCreation() {
    if(newSymptom !== '') {
      setIsPosting(true)
      try {
        const response = await api.post('/symptom/', { symptom: newSymptom })
        toast({
          title: "Sucesso na criação do sintoma",
          description: response.data?.success,
          status: "success",
          isClosable: true
        })
        handleClose()
        refetchList()
      } catch (error: any) {
        toast({
          title: "Erro na criação do sintoma",
          description: "Sintoma já registrado no sistema",
          status: "error",
          isClosable: true
        })
      }
      setIsPosting(false)
    } else {
      toast({
        title: "Erro na criação do sintoma",
        description: "Preencha o campo com o nome do sintoma",
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
          <ModalHeader textAlign="center">Adicionar sintoma</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="semibold" mb="2">Nome do sintoma</Text>
            <Input value={newSymptom} mb="2" onChange={handleSymptomInputChanged}/>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleClose} mr="3">Cancelar</Button>
            <Button 
              onClick={handleSymptomCreation} 
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