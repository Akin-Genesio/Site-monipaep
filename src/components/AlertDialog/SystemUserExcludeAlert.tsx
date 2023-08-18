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

interface SystemUserExcludeAlertProps {
  isOpen: boolean;
  systemUser: string;
  onClose: () => void;
  refetchList: () => void;
}

export function SystemUserExcludeAlert({ isOpen, onClose, systemUser, refetchList }: SystemUserExcludeAlertProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const cancelRef = useRef(null)
  const toast = useToast()

  async function handleUserExclusion() {
    setIsDeleting(true)
    try {
      const response = await api.delete(`/systemuser/${systemUser}`)
      toast({
        title: "Sucesso na remoção do usuário",
        description: response.data?.success,
        status: "success",
        isClosable: true
      })
      refetchList()
      onClose()
    } catch (error: any) {
      toast({
        title: "Erro na remoção do usuário",
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
            Tem certeza que deseja excluir este usuário do sistema?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="outline">
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleUserExclusion} ml={3} isLoading={isDeleting}>
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}