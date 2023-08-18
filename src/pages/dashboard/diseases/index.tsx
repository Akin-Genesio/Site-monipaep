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
import { Pagination } from "../../../components/Pagination";
import { useDiseases } from "../../../hooks/useDiseases";
import { useCan } from "../../../hooks/useCan";
import { DiseaseEditModal } from "../../../components/Modal/DiseaseEditModal";
import { DiseaseAddModal } from "../../../components/Modal/DiseaseAddModal";
import { DiseaseExcludeAlert } from "../../../components/AlertDialog/DiseaseExcludeAlert";

type Disease = {
  name: string;
  infected_Monitoring_Days: number;
  suspect_Monitoring_Days: number;
}

export default function Diseases() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [diseaseToBeEdited, setDiseaseToBeEdited] = useState<Disease | undefined>(undefined)
  const [diseaseToBeDeleted, setDiseaseToBeDeleted] = useState<Disease | undefined>(undefined)
  const isAdmin = useCan({ roles: ["general.admin", "local.admin"] })
  const { data, isLoading, isFetching, error, refetch } = useDiseases({ page, filter: search })
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

  function handleEditDisease(disease: Disease) {
    setDiseaseToBeEdited(disease)
    onOpenEditModal()
  }

  function handleDeleteDisease(disease: Disease) {
    setDiseaseToBeDeleted(disease)
    onOpenExcludeAlert()
  }
  
  return (
    <>
      <Head>
        <title>MoniPaEp | Doenças</title>
      </Head>

      <Flex h="100%" w="100%" bgColor="white" borderRadius="4" direction="column" >
        <Heading ml="8" my="6">
          Doenças
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
            <DiseaseAddModal
              isOpen={isOpenAddModal} 
              onClose={onCloseAddModal} 
              refetchList={refetch}
            />

            { diseaseToBeEdited && (
              <DiseaseEditModal 
                isOpen={isOpenEditModal} 
                onClose={onCloseEditModal} 
                disease={diseaseToBeEdited}
                refetchList={refetch}
              />
            )}
            
            { diseaseToBeDeleted && (
              <DiseaseExcludeAlert 
                isOpen={isOpenExcludeAlert} 
                onClose={onCloseExcludeAlert} 
                disease={diseaseToBeDeleted.name}
                refetchList={refetch}
              />
            )}

            <Flex mx="8" mb="8" justifyContent="space-between" alignItems="center">
              <InputGroup w="30">
                <InputLeftElement>
                  <Icon as={MdSearch} fontSize="xl" color="gray.400"/>
                </InputLeftElement>
                <Input placeholder="Filtrar por doença..." onChange={debouncedChangeInputHandler}/>
              </InputGroup>  
              { isAdmin && (
                <Button  
                  size="sm" 
                  fontSize="sm" 
                  colorScheme="blue"
                  leftIcon={<Icon as={RiAddLine} fontSize="20"/>}
                  onClick={onOpenAddModal}
                >
                  Adicionar nova doença
                </Button>
              )}
            </Flex>

            <Flex direction="column" w="100%" overflow="auto" px="8">
              { data?.totalDiseases === 0 ? (
                <Text mt="2">
                  { search === '' ? 
                    'Não existem doenças registradas até o momento.' : 
                    'A busca não encontrou nenhuma doença com esse nome.'
                  }
                </Text>
              ) : (
                <>
                  <Table w="100%" border="1px" borderColor="gray.200" boxShadow="md" mb="4">
                    <Thead bgColor="gray.200">
                      <Tr>
                        <Th rowSpan={2} w="30%">Nome da doença</Th>
                        <Th colSpan={2} isNumeric w="20%">
                          Período de monitoramento (dias)
                        </Th>
                        { isAdmin && <Th w="20%"></Th> }
                      </Tr>
                      <Tr>
                        <Th isNumeric>Suspeito</Th>
                        <Th isNumeric>Infectado</Th>
                        { isAdmin && <Th></Th> }
                      </Tr>
                    </Thead>

                    <Tbody>
                      { data?.diseases.map(disease => (
                        <Tr key={disease.name} _hover={{ bgColor: 'gray.50' }}>
                          <Td>
                            <Text>{disease.name}</Text>
                          </Td>
                          <Td isNumeric>
                            <Text>{disease.suspect_Monitoring_Days}</Text>
                          </Td>
                          <Td isNumeric>
                            <Text>{disease.infected_Monitoring_Days}</Text>
                          </Td>
                          { isAdmin && (
                            <Td pr="4">
                              <Flex justifyContent="flex-end" alignItems="center">
                                <Button 
                                  fontSize="lg" 
                                  height="36px" 
                                  width="36px" 
                                  colorScheme="blue" 
                                  onClick={() => handleEditDisease(disease)}
                                >
                                  <Icon as={BiPencil}/>
                                </Button>
                                <Button 
                                  fontSize="lg" 
                                  height="36px" 
                                  ml="2"
                                  width="36px" 
                                  colorScheme="red" 
                                  onClick={() => handleDeleteDisease(disease)}
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
                      totalRegisters={data?.totalDiseases} 
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

Diseases.layout = DashboardLayout

export const getServerSideProps = withSSRAuth(async (ctx) => { 
  return { props: {} }
})