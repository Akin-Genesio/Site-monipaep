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
import { useCan } from "../../../hooks/useCan";
import { useUsms } from "../../../hooks/useUsms";
import { UsmAddModal } from "../../../components/Modal/UsmAddModal";
import { UsmExcludeAlert } from "../../../components/AlertDialog/UsmExcludeAlert";
import { UsmEditModal } from "../../../components/Modal/UsmEditModal";

type Usm = {
  name: string;
  address: string;
	neighborhood: string;
	latitude: number;
	longitude: number;
}

export default function Usms() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [usmToBeEdited, setUsmToBeEdited] = useState<Usm | undefined>(undefined)
  const [usmToBeDeleted, setUsmToBeDeleted] = useState<Usm | undefined>(undefined)
  const isAdmin = useCan({ roles: ['general.admin'] })
  const { data, isLoading, isFetching, error, refetch } = useUsms({ page, filter: search })
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

  function handleEditUsm(usm: Usm) {
    setUsmToBeEdited(usm)
    onOpenEditModal()
  }

  function handleDeleteUsm(usm: Usm) {
    setUsmToBeDeleted(usm)
    onOpenExcludeAlert()
  }
  
  return (
    <>
      <Head>
        <title>MoniPaEp | Unidades de saúde</title>
      </Head>

      <Flex h="100%" w="100%" bgColor="white" borderRadius="4" direction="column" >
        <Heading ml="8" my="6">
          Unidades de saúde
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
            <UsmAddModal
              isOpen={isOpenAddModal} 
              onClose={onCloseAddModal} 
              refetchList={refetch}
            />

            { usmToBeEdited && (
              <UsmEditModal 
                isOpen={isOpenEditModal} 
                onClose={onCloseEditModal} 
                usm={usmToBeEdited}
                refetchList={refetch}
              />
            )}
            
            { usmToBeDeleted && (
              <UsmExcludeAlert 
                isOpen={isOpenExcludeAlert} 
                onClose={onCloseExcludeAlert} 
                usm={usmToBeDeleted.name}
                refetchList={refetch}
              />
            )}

            <Flex mx="8" mb="8" justifyContent="space-between" alignItems="center">
              <InputGroup w="30">
                <InputLeftElement>
                  <Icon as={MdSearch} fontSize="xl" color="gray.400"/>
                </InputLeftElement>
                <Input placeholder="Filtrar por unidade..." onChange={debouncedChangeInputHandler}/>
              </InputGroup>  
                { isAdmin && (
                  <Button  
                    size="sm" 
                    fontSize="sm" 
                    colorScheme="blue"
                    leftIcon={<Icon as={RiAddLine} fontSize="20"/>}
                    onClick={onOpenAddModal}
                  >
                    Adicionar nova unidade
                  </Button> 
                )}   
            </Flex>

            <Flex direction="column" w="100%" overflow="auto" px="8">
              { data?.totalUsms === 0 ? (
                <Text mt="2">
                  { search === '' ? 
                    'Não existem unidades de saúde registradas até o momento.' : 
                    'A busca não encontrou nenhuma unidade de saúde com esse nome.'
                  }
                </Text>
              ) : (
                <>
                  <Table w="100%" border="1px" borderColor="gray.200" boxShadow="md" mb="4">
                    <Thead bgColor="gray.200">
                      <Tr>
                        <Th>Nome da unidade</Th>
                        <Th>Endereço</Th>
                        <Th>Bairro</Th>
                        { isAdmin && <Th></Th> }
                      </Tr>
                    </Thead>

                    <Tbody>
                      { data?.usms.map(usm => (
                        <Tr key={usm.name} _hover={{ bgColor: 'gray.50' }}>
                          <Td>
                            <Text>{usm.name}</Text>
                          </Td>
                          <Td>
                            <Text>{usm.address}</Text>
                          </Td>
                          <Td>
                            <Text>{usm.neighborhood}</Text>
                          </Td>
                          { isAdmin && (
                            <Td pr="4">
                              <Flex justifyContent="flex-end" alignItems="center">
                                <Button 
                                  fontSize="lg" 
                                  height="36px" 
                                  width="36px" 
                                  colorScheme="blue" 
                                  onClick={() => handleEditUsm(usm)}
                                >
                                  <Icon as={BiPencil}/>
                                </Button>
                                <Button 
                                  fontSize="lg" 
                                  height="36px" 
                                  ml="2"
                                  width="36px" 
                                  colorScheme="red" 
                                  onClick={() => handleDeleteUsm(usm)}
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
                      totalRegisters={data?.totalUsms} 
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

Usms.layout = DashboardLayout

export const getServerSideProps = withSSRAuth(async (ctx) => { 
  return { props: {} }
})