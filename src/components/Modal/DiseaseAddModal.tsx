import { useState, ChangeEvent } from 'react';
import {
  Button,
  Flex,
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

interface DiseaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchList: () => void;
}

export function DiseaseAddModal({ isOpen, onClose, refetchList }: DiseaseModalProps) {
  const [diseaseName, setDiseaseName] = useState('')
  const [infectedDays, setInfectedDays] = useState(0)
  const [suspectDays, setSuspectDays] = useState(0)
  const [touched, setTouched] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const toast = useToast()

  function handleNameInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setDiseaseName(event.target.value)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleInfectedInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setInfectedDays(Number(event.target.value))
    if(!touched) {
      setTouched(true)
    }
  }

  function handleSuspectInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setSuspectDays(Number(event.target.value))
    if(!touched) {
      setTouched(true)
    }
  }

  function handleClose() {
    setDiseaseName('')
    setInfectedDays(0)
    setSuspectDays(0)
    setTouched(false)
    onClose()
  }

  async function handleDiseaseCreation() {
    if(diseaseName !== '' && infectedDays > 0 && suspectDays > 0) {
      setIsPosting(true)
      try {
        const response = await api.post('/disease/', {
          name: diseaseName,
          infected_Monitoring_Days: infectedDays,
          suspect_Monitoring_Days: suspectDays,
        })
        toast({
          title: "Sucesso na criação da doença",
          description: response.data?.success,
          status: "success",
          isClosable: true
        })
      handleClose()
      refetchList()
    } catch (error: any) {
      toast({
        title: "Erro na criação da doença",
        description: "Doença já registrada no sistema",
        status: "error",
        isClosable: true
      })
    }
    setIsPosting(false)
    
    } else {
      toast({
        title: "Erro na criação da doença",
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
          <ModalHeader textAlign="center">Adicionar doença</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="semibold" mb="3">Nome da doença</Text>
            <Input value={diseaseName} mb="4" onChange={handleNameInputChanged}/>
            <Text fontWeight="semibold" mb="3">Período de monitoramento (em dias)</Text>
            <Flex direction="column" justifyContent="space-between" alignItems="flex-start" ml="2">
              <Text fontWeight="semibold" mb="2">Paciente suspeito</Text>
              <Input alignSelf="center" type="number" value={suspectDays} mb="2" onChange={handleSuspectInputChanged}/>
              <Text fontWeight="semibold" mb="2">Paciente infectado</Text>
              <Input type="number" value={infectedDays} mb="2" onChange={handleInfectedInputChanged}/>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleClose} mr="3">Cancelar</Button>
            <Button 
              onClick={handleDiseaseCreation} 
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