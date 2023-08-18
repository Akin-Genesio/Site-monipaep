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

interface AssignedHealthProtocolExcludeAlertProps {
  isOpen: boolean;
  association: {
    disease: string;
    healthProtocol: string;
  };
  onClose: () => void;
  refetchList: () => void;
}

export function AssignedHealthProtocolExcludeAlert({ 
  isOpen, 
  onClose, 
  association, 
  refetchList 
}: AssignedHealthProtocolExcludeAlertProps) {
  const [isDeletting, setIsDeletting] = useState(false)
  const cancelRef = useRef(null)
  const toast = useToast()

  async function handleAssignedHealthProtocolExclusion() {
    setIsDeletting(true)
    try {
      const response = await api.delete(`/assignedhealthprotocol/${association.disease}/${association.healthProtocol}`)
      toast({
        title: "Sucesso na remoção da associação",
        description: response.data?.success,
        status: "success",
        isClosable: true
      })
      refetchList()
      onClose()
      setIsDeletting(false)
    } catch (error: any) {
      toast({
        title: "Erro na remoção da associação",
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
            Tem certeza que deseja excluir esta associação?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose} variant="outline">
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleAssignedHealthProtocolExclusion} ml={3} isLoading={isDeletting}>
              Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}