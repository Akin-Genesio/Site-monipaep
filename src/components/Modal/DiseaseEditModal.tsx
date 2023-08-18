import { useState, useEffect, ChangeEvent } from 'react';
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

type Disease = {
  name: string;
  infected_Monitoring_Days: number;
  suspect_Monitoring_Days: number;
}

interface DiseaseModalProps {
  isOpen: boolean;
  disease: Disease;
  onClose: () => void;
  refetchList: () => void;
}

export function DiseaseEditModal({ isOpen, onClose, disease, refetchList }: DiseaseModalProps) {
  const [diseaseName, setDiseaseName] = useState(disease.name)
  const [infectedDays, setInfectedDays] = useState(disease.infected_Monitoring_Days)
  const [suspectDays, setSuspectDays] = useState(disease.suspect_Monitoring_Days)
  const [touched, setTouched] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setDiseaseName(disease.name)
    setInfectedDays(disease.infected_Monitoring_Days)
    setSuspectDays(disease.suspect_Monitoring_Days)
  }, [disease])

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
    setDiseaseName(disease.name)
    setInfectedDays(disease.infected_Monitoring_Days)
    setSuspectDays(disease.suspect_Monitoring_Days)
    setTouched(false)
    onClose()
  }

  async function handleDiseaseUpdate() {
    if(diseaseName !== '' && infectedDays > 0 && suspectDays > 0) {
      if( diseaseName === disease.name && 
          infectedDays === disease.infected_Monitoring_Days &&
          suspectDays === disease.suspect_Monitoring_Days) {
        toast({
          title: "Erro na alteração da doença",
          description: "Campos sem nenhuma alteração",
          status: "error",
          isClosable: true
        })
      } else {
        setIsUpdating(true)
        try {
          const response = await api.put(`/disease/${disease.name}`, {
            name: diseaseName,
            infected_Monitoring_Days: infectedDays,
            suspect_Monitoring_Days: suspectDays,
          })
          toast({
            title: "Sucesso",
            description: response.data?.success,
            status: "success",
            isClosable: true
          })
          setTouched(false)
          onClose()
          refetchList()
        } catch (error: any) {
          toast({
            title: "Erro na alteração da doença",
            description: "Doença já registrada no sistema",
            status: "error",
            isClosable: true
          })
        }
        setIsUpdating(false)
      }
    } else {
      toast({
        title: "Erro na alteração da doença",
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
          <ModalHeader textAlign="center">Editar doença</ModalHeader>
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
              onClick={handleDiseaseUpdate} 
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