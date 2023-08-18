import { useState, useRef } from "react";
import Router from "next/router"
import { 
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useToast,
} from "@chakra-ui/react";

import { api } from "../../services/apiClient";

interface DiseaseOccurrenceExcludeAlertProps {
  isOpen: boolean;
  patientId: string;
  diseaseOccurrenceId: string;
  onClose: () => void;
}

export function DiseaseOccurrenceExcludeAlert({ 
  isOpen, 
  onClose, 
  patientId,
  diseaseOccurrenceId, 
}: DiseaseOccurrenceExcludeAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const cancelRef = useRef(null)
  const toast = useToast()

  async function handleDiseaseOccurrenceExclusion() {
    setIsDeleting(true)
    try {
      const response = await api.delete(`/diseaseoccurrence/${diseaseOccurrenceId}`)
      toast({
        title: "Sucesso na remoção da ocorrência",
        description: response.data?.success,
        status: "success",
        isClosable: true
      })
      onClose()
      Router.push(`/dashboard/patients/diseasehistory/${patientId}`)
    } catch (error: any) {
      toast({
        title: "Erro na remoção da ocorrência",
        description: error.response?.data.error,
        status: "error",
        isClosable: true
      })
    }
  }
  
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      motionPreset="slideInBottom"
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Confirmação necessária
          </AlertDialogHeader>
          <AlertDialogBody>
            Tem certeza que deseja excluir esta ocorrência de doença?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="outline">
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDiseaseOccurrenceExclusion} ml={3} isLoading={isDeleting}>
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}