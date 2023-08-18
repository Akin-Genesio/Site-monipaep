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

interface DiseaseExcludeAlertProps {
  isOpen: boolean;
  disease: string;
  onClose: () => void;
  refetchList: () => void;
}

export function DiseaseExcludeAlert({ isOpen, onClose, disease, refetchList }: DiseaseExcludeAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const cancelRef = useRef(null)
  const toast = useToast()

  async function handleDiseaseExclusion() {
    setIsDeleting(true)
    try {
      const response = await api.delete(`/disease/${disease}`)
      toast({
        title: "Sucesso na remoção da doença",
        description: response.data?.success,
        status: "success",
        isClosable: true
      })
      refetchList()
      onClose()
    } catch (error: any) {
      toast({
        title: "Erro na remoção da doença",
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
            Tem certeza que deseja excluir esta doença?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="outline">
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDiseaseExclusion} ml={3} isLoading={isDeleting}>
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}