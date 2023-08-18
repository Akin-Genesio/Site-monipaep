import { useState, ChangeEvent } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Text,
  Textarea,
  Input,
  useToast,
} from '@chakra-ui/react';

import { api } from '../../services/apiClient';

interface FaqAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchList: () => void;
}

export function FaqAddModal({ isOpen, onClose, refetchList }: FaqAddModalProps) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [touched, setTouched] = useState(false)
  const [isPosting, setIsPosting] = useState(false)
  const toast = useToast()

  function handleQuestionInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setQuestion(event.target.value)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleAnswerInputChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setAnswer(event.target.value)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleClose() {
    setQuestion('')
    setAnswer('')
    setTouched(false)
    onClose()
  }

  async function handleFaqCreation() {
    if(question !== '' && answer !== '') {
      setIsPosting(true)
      try {
        const response = await api.post('/faq/', { question, answer })
        toast({
          title: "Sucesso na criação da questão",
          description: response.data?.success,
          status: "success",
          isClosable: true
        })
        handleClose()
        refetchList()
      } catch (error: any) {
        toast({
          title: "Erro na criação da questão",
          description: error.response?.data.error,
          status: "error",
          isClosable: true
        })
      }
      setIsPosting(false)
    } else {
      toast({
        title: "Erro na criação da questão",
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
        <ModalContent height="auto" width="550px">
          <ModalHeader textAlign="center">Adicionar FAQ</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="semibold" mb="2">Pergunta</Text>
            <Input value={question} mb="2" onChange={handleQuestionInputChanged}/>
            <Text fontWeight="semibold" mb="2">Resposta</Text>
            <Textarea value={answer} onChange={handleAnswerInputChanged} height="300px" textAlign="justify"/>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleClose} mr="3">Cancelar</Button>
            <Button 
              onClick={handleFaqCreation} 
              colorScheme="blue" 
              disabled={!touched} 
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