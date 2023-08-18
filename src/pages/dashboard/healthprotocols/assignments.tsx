import { useState, useCallback, ChangeEvent, useMemo } from "react";
import Head from "next/head"
import { debounce } from "ts-debounce"
import HealthProtocolsLayout from "../../../components/Layouts/HealthProtocolsLayout";
import { 
  Box, 
  Button,
  Flex, 
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
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
import { BiTrash } from 'react-icons/bi'
import { MdSearch } from 'react-icons/md'
import { RiAddLine } from 'react-icons/ri'

import { withSSRAuth } from "../../../utils/withSSRAuth";
import { useCan } from "../../../hooks/useCan";
import { useAssignedHealthProtocols } from "../../../hooks/useAssignedHealthProtocols";
import { Pagination } from "../../../components/Pagination";
import { AssignedHealthProtocolAddModal } from "../../../components/Modal/AssignedHealthProtocolAddModal";
import { AssignedHealthProtocolExcludeAlert } from "../../../components/AlertDialog/AssignedHealthProtocolExcludeAlert";

type AssignedHealthProtocol = {
  healthProtocol: {
    id: string;
    title: string;
    description: string;
  }
  diseaseName: string;
}

export default function AssignedHealthProtocols() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('disease_name')
  const [
    assignedHealthProtocolToBeDeleted, 
    setAssignedHealthProtocolToBeDeleted
  ] = useState<AssignedHealthProtocol | undefined>(undefined)
  const isUserAllowed = useCan({ isUsm: true })
  const { data, isLoading, isFetching, error, refetch } = useAssignedHealthProtocols({ page, filter: [filter, search] })

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

  function handleDeleteAssignedHealthProtocol(assignedHealthProtocol: AssignedHealthProtocol) {
    setAssignedHealthProtocolToBeDeleted(assignedHealthProtocol)
    onOpenExcludeAlert()
  }
  
  return (
    <>
      <Head>
        <title>MoniPaEp | Protocolos de saúde</title>
      </Head>

      <Flex h="100%" w="100%" bgColor="white" borderRadius="4" direction="column" >
        { isLoading ? (
          <Box w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
            <Spinner size="lg" mt="6"/>
          </Box>
        ) : error ? (
          <Box w="100%" display="flex" justifyContent="center" alignItems="center">
            <Text>Erro ao carregar os dados</Text>
          </Box>
        ) : (
          <>
            <AssignedHealthProtocolAddModal
              isOpen={isOpenAddModal} 
              onClose={onCloseAddModal} 
              refetchList={refetch}
            />
            
            { assignedHealthProtocolToBeDeleted && (
              <AssignedHealthProtocolExcludeAlert 
                isOpen={isOpenExcludeAlert} 
                onClose={onCloseExcludeAlert} 
                association={{ 
                  disease: assignedHealthProtocolToBeDeleted.diseaseName, 
                  healthProtocol: assignedHealthProtocolToBeDeleted.healthProtocol.id
                }}
                refetchList={refetch}
              />
            )}

            <Flex mx="8" mb="8" mt="6" justifyContent="flex-start" alignItems="center">
              <InputGroup w="30">
                <InputLeftElement>
                  <Icon as={MdSearch} fontSize="xl" color="gray.400"/>
                </InputLeftElement>
                <Input placeholder="Filtrar..." onChange={debouncedChangeInputHandler}/>
              </InputGroup> 
              <Select w="34" onChange={e => {setFilter(e.target.value)}} ml="2">
                <option value="disease_name">Doença</option>
                <option value="healthprotocol_title">Protocolo de saúde</option>
              </Select>  
              { !isLoading && isFetching && <Spinner ml="4"/> }
              { isUserAllowed && (
                <Button 
                  ml="auto" 
                  size="sm" 
                  fontSize="sm" 
                  colorScheme="blue"
                  leftIcon={<Icon as={RiAddLine} fontSize="20"/>}
                  onClick={onOpenAddModal}
                >
                  Adicionar nova associação
                </Button>
              )}
            </Flex>

            <Flex direction="column" w="100%" overflow="auto" px="8">
              { data?.totalAssignedHealthProtocols === 0 ? (
                <Text mt="2">
                  { search === '' ? 
                    'Não existem associações registradas até o momento.' :
                    'A busca não encontrou nenhuma associação com esse filtro.'
                  }
                </Text>
              ) : (
                <>
                  <Table w="100%" border="1px" borderColor="gray.200" boxShadow="md" mb="4">
                    <Thead bgColor="gray.200">
                      <Tr>
                        <Th>Título do protocolo de saúde</Th>
                        <Th>Doença</Th>
                        { isUserAllowed && <Th></Th> }
                      </Tr>
                    </Thead>

                    <Tbody>
                      { data?.assignedHealthProtocols.map(assignedHealthProtocol => (
                        <Tr 
                          key={`${assignedHealthProtocol.healthProtocol.id}-${assignedHealthProtocol.diseaseName}`} 
                          _hover={{ bgColor: 'gray.50' }}
                        >
                          <Td>
                            <Text textOverflow="ellipsis">{assignedHealthProtocol.healthProtocol.title}</Text>
                          </Td>
                          <Td>
                            <Text>{assignedHealthProtocol.diseaseName}</Text>
                          </Td>
                          { isUserAllowed && (
                            <Td pr="4">
                              <Flex justifyContent="flex-end" alignItems="center">
                                <Button 
                                  fontSize="lg" 
                                  height="36px" 
                                  ml="2"
                                  width="36px" 
                                  colorScheme="red" 
                                  onClick={() => handleDeleteAssignedHealthProtocol(assignedHealthProtocol)}
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
                      totalRegisters={data?.totalAssignedHealthProtocols} 
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

AssignedHealthProtocols.layout = HealthProtocolsLayout

export const getServerSideProps = withSSRAuth(async (ctx) => { 
  return { props: {} }
})