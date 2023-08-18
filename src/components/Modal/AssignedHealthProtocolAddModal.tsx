import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';

import { api } from '../../services/apiClient';

type HealthProtocol = {
  id: string;
  title: string;
  description: string;
}

type Disease = {
  name: string;
}

interface AssignedHealthProtocolAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchList: () => void;
}

export function AssignedHealthProtocolAddModal({ isOpen, onClose, refetchList }: AssignedHealthProtocolAddModalProps) {
  const [healthProtocol, setHealthProtocol] = useState<string | undefined>(undefined)
  const [disease, setDisease] = useState<string | undefined>(undefined)
  const [isPosting, setIsPosting] = useState(false)
  const toast = useToast()
  const [healthProtocolOptions, setHealthProtocolOptions] = useState<HealthProtocol[]>([{ 
    id: 'unknown', 
    title: 'Carregando...', 
    description: 'Carregando...' 
  }])
  const [
    diseaseOptions, 
    setDiseaseOptions
  ] = useState<Disease[]>([{ name: 'Carregando...' }])

  useEffect(() => {
    async function getOptions() {
      if(isOpen) {
        const [healthProtocolResponse, diseaseResponse] = await Promise.all([
          api.get('/healthprotocol'),
          api.get('/disease')
        ])
        const healthProtocols = healthProtocolResponse.data.healthProtocols
        const diseases = diseaseResponse.data.diseases

        if(healthProtocols.length > 0) {
          setHealthProtocolOptions(healthProtocols)
          setHealthProtocol(healthProtocolResponse.data.healthProtocols[0].id)
        }
        if(diseases.length > 0) {
          setDiseaseOptions(diseases)
          setDisease(diseaseResponse.data.diseases[0].name)
        }
      }
    }
    getOptions()
  }, [isOpen])

  function handleClose() {
    setHealthProtocol(undefined)
    setDisease(undefined)
    onClose()
  }

  async function handleAssignedHealthProtocolCreation() {
    if(healthProtocol && disease) {
      setIsPosting(true)
      try {
        const response = await api.post('/assignedhealthprotocol/', { 
          disease_name: disease,
          healthprotocol_id: healthProtocol,
        })
        toast({
          title: "Sucesso na criação da associação",
          description: response.data?.success,
          status: "success",
          isClosable: true
        })
        handleClose()
        refetchList()
      } catch (error: any) {
        toast({
          title: "Erro na criação da associação",
          description: error.response?.data.error,
          status: "error",
          isClosable: true
        })
      }
      setIsPosting(false)
    } else {
      toast({
        title: "Erro na criação da associação",
        description: "Protocolos de saúde e/ou doenças não cadastradas",
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
          <ModalHeader textAlign="center">Adicionar associação</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="semibold" mb="2">Protocolo de saúde</Text>
            <Select mb="3" textOverflow="ellipsis" onChange={e => setHealthProtocol(e.target.value)}>
              { healthProtocolOptions.map(healthProtocol => (
                <option key={healthProtocol.id} value={healthProtocol.id}>
                  { healthProtocol.title.length < 54 ? 
                    healthProtocol.title : 
                    `${healthProtocol.title.substring(0, 53)}...`
                  }
                </option>
              )) }
            </Select>
            <Text fontWeight="semibold" mb="2">Doença</Text>
            <Select mb="3" textOverflow="ellipsis" onChange={e => setDisease(e.target.value)}>
              { diseaseOptions.map(disease => (
                <option key={disease.name} value={disease.name}>
                  {disease.name}
                </option>
              )) }
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleClose} mr="3">Cancelar</Button>
            <Button 
              onClick={handleAssignedHealthProtocolCreation} 
              colorScheme="blue" 
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