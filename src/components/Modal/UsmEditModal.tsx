import { useState, ChangeEvent, useEffect } from 'react';
import dynamic from 'next/dynamic'
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
  Input,
  useToast,
} from '@chakra-ui/react';

import { googleApi } from '../../services/googleApi';
import { api } from '../../services/apiClient';

const Map = dynamic(() => import('../Map/AddUsmMap'), {
  ssr: false
})

type Location = {
  lat: number;
  lng: number;
}

type Usm = {
  name: string;
  address: string;
	neighborhood: string;
	latitude: number;
	longitude: number;
}

interface UsmEditModalProps {
  isOpen: boolean;
  usm: Usm;
  onClose: () => void;
  refetchList: () => void;
}

export function UsmEditModal({ isOpen, onClose, usm, refetchList }: UsmEditModalProps) {
  const [usmName, setUsmName] = useState(usm.name)
  const [usmAddress, setUsmAddress] = useState(usm.address)
  const [usmNeighborhood, setUsmNeighborhood] = useState(usm.neighborhood)
  const [coords, setCoords] = useState<Location>({ lat: usm.latitude, lng: usm.longitude })
  const [touched, setTouched] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setUsmName(usm.name)
    setUsmAddress(usm.address)
    setUsmNeighborhood(usm.neighborhood)
    setCoords({ lat: usm.latitude, lng: usm.longitude })
  }, [usm])

  function handleNameInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setUsmName(event.target.value)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleAddressInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setUsmAddress(event.target.value)
    if(!touched) {
      setTouched(true)
    }
  }

  function handleNeighborhoodInputChanged(event: ChangeEvent<HTMLInputElement>) {
    setUsmNeighborhood(event.target.value)
    if(!touched) {
      setTouched(true)
    }
  }

  function updatePosition(location: Location) {
    setCoords(location)
    setTouched(true)
  }

  function handleClose() {
    setUsmName(usm.name)
    setUsmAddress(usm.address)
    setUsmNeighborhood(usm.neighborhood)
    setCoords({ lat: usm.latitude, lng: usm.longitude })
    setTouched(false)
    onClose()
  }

  async function handleCoordinatesFetch() {
    if(usmAddress !== '') {
      setIsFetching(true)
      const { data } = await googleApi.get('/maps/api/geocode/json', {
        params: {
          components: `route:${usmAddress}|administrative_area:Sao+Carlos|country:Brazil`,
          key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_GEOCODE_API_KEY,
          language: 'pt-BR'
        }
      })
      if(data.status === 'OK') {
        setCoords({
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng
        })
      } else {
        toast({
          title: "Erro na busca das coordenadas",
          description: "Endereço inválido",
          status: "error",
          isClosable: true
        })
      }
      setIsFetching(false)
    } else {
      toast({
        title: "Erro na busca das coordenadas",
        description: "Insira um endereço válido",
        status: "error",
        isClosable: true
      })
    }
  }

  async function handleUsmUpdate() {
    if(usmName !== '' && usmAddress !== '' && usmNeighborhood !== '' && coords) {
      if(usmName === usm.name && usmAddress === usm.address && usmNeighborhood === usm.neighborhood 
          && coords.lat === usm.latitude && coords.lng === usm.longitude) {
        toast({
          title: "Erro na alteração da unidade",
          description: "Campos sem nenhuma alteração",
          status: "error",
          isClosable: true
        })
      } else {
        setIsUpdating(true)
        try {
          const response = await api.put(`/usm/${usm.name}`, {
            name: usmName,
            address: usmAddress,
            neighborhood: usmNeighborhood,
            latitude: coords.lat,
            longitude: coords.lng
          })
          toast({
            title: "Sucesso na alteração da unidade",
            description: response.data?.success,
            status: "success",
            isClosable: true
          })
          handleClose()
          refetchList()
        } catch (error: any) {
          toast({
            title: "Erro na alteração da unidade",
            description: error.response?.data.error,
            status: "error",
            isClosable: true
          })
        }
        setIsUpdating(false)
      }
    } else {
      toast({
        title: "Erro na alteração da unidade",
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
        <ModalContent height="auto" width="600px">
          <ModalHeader textAlign="center">Editar unidade de saúde</ModalHeader>
          <ModalCloseButton />
          <ModalBody w="100%" height="100%">
            <Text fontWeight="semibold" mb="3">Nome da unidade</Text>
            <Input value={usmName} mb="4" onChange={handleNameInputChanged}/>
            <Text fontWeight="semibold" mb="3">Endereço</Text>
            <Input value={usmAddress} mb="4" onChange={handleAddressInputChanged}/>
            <Text fontWeight="semibold" mb="3">Bairro</Text>
            <Input value={usmNeighborhood} mb="4" onChange={handleNeighborhoodInputChanged}/>
            <Button onClick={handleCoordinatesFetch} mb="4" w="100%" colorScheme="pink" isLoading={isFetching}>
              Buscar coordenadas
            </Button>
            { coords && <Map center={coords} updatePosition={updatePosition}/> }
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleClose} mr="3">Cancelar</Button>
            <Button 
              onClick={handleUsmUpdate} 
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