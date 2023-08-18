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

interface UsmExcludeAlertProps {
  isOpen: boolean;
  usm: string;
  onClose: () => void;
  refetchList: () => void;
}

export function UsmExcludeAlert({ isOpen, onClose, usm, refetchList }: UsmExcludeAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const cancelRef = useRef(null)
  const toast = useToast()

  async function handleUsmExclusion() {
    setIsDeleting(true)
    try {
      const response = await api.delete(`/usm/${usm}`)
      toast({
        title: "Sucesso na remoção da unidade",
        description: response.data?.success,
        status: "success",
        isClosable: true
      })
      refetchList()
      onClose()
    } catch (error: any) {
      toast({
        title: "Erro na remoção da unidade",
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
            Tem certeza que deseja excluir esta unidade de saúde?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="outline">
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleUsmExclusion} ml={3} isLoading={isDeleting}>
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}