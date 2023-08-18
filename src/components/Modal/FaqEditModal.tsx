import { useState, useEffect, ChangeEvent } from 'react';
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

type Faq = {
  id: string;
  question: string;
  answer: string;
}

interface FaqModalProps {
  isOpen: boolean;
  faq: Faq | undefined;
  onClose: () => void;
  refetchList: () => void;
}

export function FaqEditModal({ isOpen, onClose, faq, refetchList }: FaqModalProps) {
  const [question, setQuestion] = useState(faq?.question)
  const [answer, setAnswer] = useState(faq?.answer)
  const [touched, setTouched] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setQuestion(faq?.question)
    setAnswer(faq?.answer)
  }, [faq])

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
    setQuestion(faq?.question)
    setAnswer(faq?.answer)
    setTouched(false)
    onClose()
  }

  async function handleUpdate() {
    if(question !== '' && answer !== '') {
      if(question === faq?.question && answer === faq?.answer) {
        toast({
          title: "Erro na alteração da questão",
          description: "Campos sem nenhuma alteração",
          status: "error",
          isClosable: true
        })
      } else {
        setIsUpdating(true)
        try {
          const response = await api.put(`/faq/${faq?.id}`, { question, answer })
          toast({
            title: "Sucesso na alteração da questão",
            description: response.data?.success,
            status: "success",
            isClosable: true
          })
          setTouched(false)
          onClose()
          refetchList()
        } catch (error: any) {
          toast({
            title: "Erro na alteração da questão",
            description: "Questão já registrada",
            status: "error",
            isClosable: true
          })
        }
        setIsUpdating(false)
      }
    } else {
      toast({
        title: "Erro na alteração da questão",
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
          <ModalHeader textAlign="center">Editar FAQ</ModalHeader>
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
              onClick={handleUpdate} 
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