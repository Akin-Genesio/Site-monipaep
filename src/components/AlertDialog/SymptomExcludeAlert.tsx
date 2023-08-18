import { useState, useRef } from "react";
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

interface SymptomExcludeAlertProps {
  isOpen: boolean;
  symptom: string;
  onClose: () => void;
  refetchList: () => void;
}

export function SymptomExcludeAlert({ isOpen, onClose, symptom, refetchList }: SymptomExcludeAlertProps) {
  const [isDeletting, setIsDeletting] = useState(false)
  const cancelRef = useRef(null)
  const toast = useToast()

  async function handleSymptomExclusion() {
    setIsDeletting(true)
    try {
      const response = await api.delete(`/symptom/${symptom}`)
      toast({
        title: "Sucesso na exclusão do sintoma",
        description: response.data?.success,
        status: "success",
        isClosable: true
      })
      refetchList()
      onClose()
      setIsDeletting(false)
    } catch (error: any) {
      toast({
        title: "Erro na remoção",
        description: error.response?.data.error,
        status: "error",
        isClosable: true
      })
    }
    setIsDeletting(false)
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
            Tem certeza que deseja excluir este sintoma?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="outline">
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleSymptomExclusion} ml={3} isLoading={isDeletting}>
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}