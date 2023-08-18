import { useState, useEffect, ChangeEvent } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';

import { api } from '../../services/apiClient';

type GetDiseasesResponse = {
  diseases: {
    name: string;
  } []
}

type DiseaseOccurrence = {
  id: string;
  patient_id: string;
  disease_name: string;
  diagnosis: string;
  date_start: string;
  date_end: string | null;
  status: string;
}

interface DiseaseOccurrenceModalProps {
  isOpen: boolean;
  diseaseOccurrence: DiseaseOccurrence;
  onClose: () => void;
  refetchData: () => void;
}

registerLocale('ptBR', ptBR)

export function DiseaseOccurrenceEditModal({ isOpen, onClose, diseaseOccurrence, refetchData }: DiseaseOccurrenceModalProps) {
  const [startDate, setStartDate] = useState(new Date(diseaseOccurrence.date_start))
  const [endDate, setEndDate] = useState(diseaseOccurrence.date_end ? new Date(diseaseOccurrence.date_end) : null)
  const [isOngoingOccurrence, setIsOngoingOccurrence] = useState(diseaseOccurrence.date_end ? false : true)
  const [disease, setDisease] = useState(diseaseOccurrence.disease_name)
  const [diseaseList, setDiseaseList] = useState<string[]>([diseaseOccurrence.disease_name, "Carregando..."])
  const [diseaseStatus, setDiseaseStatus] = useState(diseaseOccurrence.status)
  const [diagnosis, setDiagnosis] = useState(diseaseOccurrence.diagnosis)
  const [touched, setTouched] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setStartDate(new Date(diseaseOccurrence.date_start))
    setEndDate(diseaseOccurrence.date_end ? new Date(diseaseOccurrence.date_end) : null)
    setIsOngoingOccurrence(diseaseOccurrence.date_end ? false : true)
    setDisease(diseaseOccurrence.disease_name)
    setDiseaseStatus(diseaseOccurrence.status)
    setDiagnosis(diseaseOccurrence.diagnosis)
  }, [diseaseOccurrence])

  useEffect(() => {
    const getDiseaseOptions = async() => {
      const { data } = await api.get<GetDiseasesResponse>('/disease')
      const diseaseList = data.diseases.map(disease => {
        return disease.name
      })
      setDiseaseList(diseaseList)
    }
    getDiseaseOptions()
  }, [isOpen])

  function handleStartDateChanged(date: Date) {
    setStartDate(date)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleEndDateChanged(date: Date) {
    setEndDate(date)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleDiseaseStatusChanged(event: ChangeEvent<HTMLSelectElement>) {
    setDiseaseStatus(event.target.value)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleDiseaseChanged(event: ChangeEvent<HTMLSelectElement>) {
    setDisease(event.target.value)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleDiagnosisInputChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setDiagnosis(event.target.value)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleEndDateCheckbox(event: ChangeEvent<HTMLInputElement>) {
    setIsOngoingOccurrence(event.target.checked)
    if(event.target.checked) {
      setEndDate(null)
    }
    if(!touched) {
      setTouched(true)
    }
  }

  function handleClose() {
    setStartDate(new Date(diseaseOccurrence.date_start))
    setEndDate(diseaseOccurrence.date_end ? new Date(diseaseOccurrence.date_end) : null)
    setIsOngoingOccurrence(diseaseOccurrence.date_end ? false : true)
    setDisease(diseaseOccurrence.disease_name)
    setDiseaseStatus(diseaseOccurrence.status)
    setDiagnosis(diseaseOccurrence.diagnosis)
    setTouched(false)
    onClose()
  }

  async function handleDiseaseOccurrenceUpdate() {
    const startDateIsEqual = startDate.getTime() === (new Date(diseaseOccurrence.date_start)).getTime()
    const endDateIsEqual = (endDate ? endDate.getTime() : null) === 
                           (diseaseOccurrence.date_end ? new Date(diseaseOccurrence.date_end).getTime() : null)
    const diagnosisIsEqual = diagnosis === diseaseOccurrence.diagnosis
    const diseaseIsEqual = disease === diseaseOccurrence.disease_name
    const diseaseStatusIsEqual = diseaseStatus === diseaseOccurrence.status

    if(startDate && (isOngoingOccurrence || endDate ) && diagnosis && diseaseStatus && disease) {
      if(startDateIsEqual && endDateIsEqual && diagnosisIsEqual && diseaseIsEqual && diseaseStatusIsEqual) {
        toast({
          title: "Erro na alteração da ocorrência",
          description: "Campos sem nenhuma alteração",
          status: "error",
          isClosable: true
        })
      } else {
        setIsUpdating(true)
        try {
          let body: any = {
            disease_name: disease,
            date_start: startDate,
            date_end: isOngoingOccurrence ? null : endDate,
            status: diseaseStatus,
            diagnosis,
          }
          const response = await api.put(`/diseaseoccurrence/${diseaseOccurrence.id}`, body)
          toast({
            title: "Sucesso na alteração da ocorrência",
            description: response.data?.success,
            status: "success",
            isClosable: true
          })
          setTouched(false)
          onClose()
          refetchData()
        } catch (error: any) {
          toast({
            title: "Erro na alteração da ocorrência",
            description: error.response?.data.error,
            status: "error",
            isClosable: true
          })
        }
        setIsUpdating(false)
      }
    } else {
      toast({
        title: "Erro na alteração da ocorrência",
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
        <ModalContent height="auto" width="380px">
          <ModalHeader textAlign="center">Editar ocorrência de doença</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="3" alignItems="flex-start">
              <Text fontWeight="semibold">Doença</Text>
              <Select value={disease} onChange={handleDiseaseChanged}>
                { diseaseList.map(disease => (
                  <option key={disease} value={disease}>{disease}</option>
                ))}
              </Select>
              <Text fontWeight="semibold">Data de início</Text>
              <Box w="100%">
                <DatePicker 
                  locale="ptBR"
                  selected={startDate} 
                  onChange={handleStartDateChanged}
                  showTimeSelect
                  timeFormat="p"
                  timeIntervals={15}
                  dateFormat="Pp"
                />
              </Box>
              <Flex w="100%" alignItems="center" justifyContent="space-between">
                <Text fontWeight="semibold">Data de término</Text>
                <Checkbox isChecked={isOngoingOccurrence} onChange={handleEndDateCheckbox}>
                  Em andamento
                </Checkbox>
              </Flex>
              <Box w="100%">
                <DatePicker 
                  locale="ptBR"
                  disabled={isOngoingOccurrence}
                  selected={endDate} 
                  onChange={handleEndDateChanged}
                  showTimeSelect
                  timeFormat="p"
                  timeIntervals={15}
                  dateFormat="Pp"
                />
              </Box>
              <Text fontWeight="semibold">Diagnóstico</Text>
              <Textarea value={diagnosis} onChange={handleDiagnosisInputChanged}  textAlign="justify"/>
              <Text fontWeight="semibold">Status</Text>
              <Select value={diseaseStatus} onChange={handleDiseaseStatusChanged}>
                <option value="Saudável">Saudável</option>
                <option value="Suspeito">Suspeito</option>
                <option value="Infectado">Infectado</option>
                <option value="Curado">Curado</option>
                <option value="Óbito">Óbito</option>
              </Select>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleClose} mr="3">Cancelar</Button>
            <Button 
              onClick={handleDiseaseOccurrenceUpdate} 
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