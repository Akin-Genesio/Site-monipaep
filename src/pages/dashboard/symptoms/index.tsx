import { useState, useCallback, ChangeEvent, useMemo } from "react";
import Head from "next/head"
import { debounce } from "ts-debounce"
import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import { 
  Box, 
  Button,
  Flex, 
  Heading, 
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Table, 
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr,  
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { BiPencil, BiTrash } from 'react-icons/bi'
import { MdSearch } from 'react-icons/md'
import { RiAddLine } from 'react-icons/ri'

import { withSSRAuth } from "../../../utils/withSSRAuth";
import { useCan } from "../../../hooks/useCan";
import { useSymptoms } from "../../../hooks/useSymptoms";
import { Pagination } from "../../../components/Pagination";
import { SymptomExcludeAlert } from "../../../components/AlertDialog/SymptomExcludeAlert";
import { SymptomEditModal } from "../../../components/Modal/SymptomEditModal";
import { SymptomAddModal } from "../../../components/Modal/SymptomAddModal";

type Symptom = {
  symptom: string;
}

export default function Symptoms() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [symptomToBeEdited, setSymptomToBeEdited] = useState<Symptom | undefined>(undefined)
  const [symptomToBeDeleted, setSymptomToBeDeleted] = useState<Symptom | undefined>(undefined)
  const isAdmin = useCan({ roles: ["general.admin", "local.admin"] })
  const { data, isLoading, isFetching, error, refetch } = useSymptoms({ page, filter: search })
  const { 
    isOpen: isOpenEditModal, 
    onOpen: onOpenEditModal, 
    onClose: onCloseEditModal 
  } = useDisclosure()

  const { 
    isOpen: isOpenExcludeAlert, 
    onOpen: onOpenExcludeAlert, 
    onClose: onCloseExcludeAlert 
  } = useDisclosure()

  const { 
    isOpen: isOpenAddModal, 
    onOpen: onOpenAddModal, 
    onClose: onCloseAddModal 
  } = useDisclosure()

  const handleChangeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    setSearch(event.target.value)
  }, [])

  const debouncedChangeInputHandler = useMemo(
    () => debounce(handleChangeInput, 600)  
  , [handleChangeInput]) 

  function handleEditSymptom(symptom: Symptom) {
    setSymptomToBeEdited(symptom)
    onOpenEditModal()
  }

  function handleDeleteSymptom(symptom: Symptom) {
    setSymptomToBeDeleted(symptom)
    onOpenExcludeAlert()
  }
  
  return (
    <>
      <Head>
        <title>MoniPaEp | Sintomas</title>
      </Head>

      <Flex h="100%" w="100%" bgColor="white" borderRadius="4" direction="column" >
        <Heading ml="8" my="6">
          Sintomas
          { !isLoading && isFetching && <Spinner ml="4"/> }
        </Heading>
        { isLoading ? (
          <Box w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
            <Spinner size="lg"/>
          </Box>
        ) : error ? (
          <Box w="100%" display="flex" justifyContent="center" alignItems="center">
            <Text>Erro ao carregar os dados</Text>
          </Box>
        ) : (
          <>
            <SymptomAddModal
              isOpen={isOpenAddModal} 
              onClose={onCloseAddModal} 
              refetchList={refetch}
            />

            { symptomToBeEdited && (
              <SymptomEditModal 
                isOpen={isOpenEditModal} 
                onClose={onCloseEditModal} 
                symptom={symptomToBeEdited.symptom}
                refetchList={refetch}
              />
            )}
            
            { symptomToBeDeleted && (
              <SymptomExcludeAlert 
                isOpen={isOpenExcludeAlert} 
                onClose={onCloseExcludeAlert} 
                symptom={symptomToBeDeleted.symptom}
                refetchList={refetch}
              />
            )}

            <Flex mx="8" mb="8" justifyContent="space-between" alignItems="center">
              <InputGroup w="30">
                <InputLeftElement>
                  <Icon as={MdSearch} fontSize="xl" color="gray.400"/>
                </InputLeftElement>
                <Input placeholder="Filtrar..." onChange={debouncedChangeInputHandler}/>
              </InputGroup>  
              { isAdmin && (
                <Button  
                  size="sm" 
                  fontSize="sm" 
                  colorScheme="blue"
                  leftIcon={<Icon as={RiAddLine} fontSize="20"/>}
                  onClick={onOpenAddModal}
                >
                  Adicionar novo sintoma
                </Button>
              )}
            </Flex>

            <Flex direction="column" w="100%" overflow="auto" px="8">
              { data?.totalSymptoms === 0 ? (
                <Text mt="2">
                  { search === '' ? 
                    'Não existem sintomas registrados até o momento.' : 
                    'A busca não encontrou nenhum sintoma com esse nome.'
                  }
                </Text>
              ) : (
                <>
                  <Table w="100%" border="1px" borderColor="gray.200" boxShadow="md" mb="4">
                    <Thead bgColor="gray.200">
                      <Tr>
                        <Th>Sintoma</Th>
                        { isAdmin && <Th></Th> }
                      </Tr>
                    </Thead>

                    <Tbody>
                      { data?.symptoms.map(symptom => (
                        <Tr key={symptom.symptom} _hover={{ bgColor: 'gray.50' }}>
                          <Td w="80%">
                            <Text>{symptom.symptom}</Text>
                          </Td>
                          { isAdmin && (
                            <Td pr="4">
                              <Flex justifyContent="flex-end" alignItems="center">
                                <Button 
                                  fontSize="lg" 
                                  height="36px" 
                                  width="36px" 
                                  colorScheme="blue" 
                                  onClick={() => handleEditSymptom(symptom)}
                                >
                                  <Icon as={BiPencil}/>
                                </Button>
                                <Button 
                                  fontSize="lg" 
                                  height="36px" 
                                  ml="2"
                                  width="36px" 
                                  colorScheme="red" 
                                  onClick={() => handleDeleteSymptom(symptom)}
                                >
                                  <Icon as={BiTrash}/>
                                </Button>
                              </Flex>
                            </Td>
                          )}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  <Box w="100%" mt="3" mb="5">
                    <Pagination 
                      currentPage={page} 
                      totalRegisters={data?.totalSymptoms} 
                      onPageChange={setPage}
                    />
                  </Box>
                </>
              )}
            </Flex>
          </>
        )}
      </Flex>
    </>
  )
}

Symptoms.layout = DashboardLayout

export const getServerSideProps = withSSRAuth(async (ctx) => { 
  return { props: {} }
})