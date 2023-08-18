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

interface PatientExcludeAlertProps {
  isOpen: boolean;
  patientId: string;
  onClose: () => void;
}

export function PatientExcludeAlert({ isOpen, onClose, patientId }: PatientExcludeAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const cancelRef = useRef(null)
  const toast = useToast()

  async function handlePatientExclusion() {
    setIsDeleting(true)
    try {
      const response = await api.delete(`/patients/${patientId}`)
      toast({
        title: "Sucesso na remoção do paciente",
        description: response.data?.success,
        status: "success",
        isClosable: true
      })
      onClose()
      Router.push('/dashboard/patients')
    } catch (error: any) {
      toast({
        title: "Erro na remoção do paciente",
        description: error.response?.data.error,
        status: "error",
        isClosable: true
      })
    }
    setIsDeleting(false)
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
            Tem certeza que deseja excluir este paciente?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="outline">
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handlePatientExclusion} ml={3} isLoading={isDeleting}>
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}