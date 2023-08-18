import { useState, useCallback, ChangeEvent, useMemo } from "react";
import NextLink from 'next/link'
import Head from "next/head"
import { debounce } from "ts-debounce"

import { withSSRAuth } from "../../../utils/withSSRAuth";

import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import { Pagination } from "../../../components/Pagination";
import { 
  Badge, 
  Box, 
  Button,
  Flex, 
  Heading, 
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
  Table, 
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr,  
  useDisclosure,
} from "@chakra-ui/react";
import { BiPencil, BiTrash } from 'react-icons/bi'
import { MdSearch } from 'react-icons/md'
import { useSystemUsers } from "../../../hooks/useSystemUsers";
import { SystemUserExcludeAlert } from "../../../components/AlertDialog/SystemUserExcludeAlert";
import { SystemUserEditModal } from "../../../components/Modal/SystemUserEditModal";
import { useCan } from "../../../hooks/useCan";

type SystemUser = {
  systemUser: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  authorized: boolean;
  localAdm: boolean;
  generalAdm: boolean;
}

export default function SystemUsers() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [userToBeEdited, setUserToBeEdited] = useState<SystemUser | undefined>(undefined)
  const [userToBeDeleted, setUserToBeDeleted] = useState<SystemUser | undefined>(undefined)
  const isGeneralAdm = useCan({ roles: ['general.admin'] })
  const { data , isLoading, isFetching, error, refetch } = useSystemUsers({ page, filter: search})
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

  const handleChangeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    setSearch(event.target.value)
  }, [])

  const debouncedChangeInputHandler = useMemo(
    () => debounce(handleChangeInput, 600)  
  , [handleChangeInput]) 

  function handleEditUser(user: SystemUser) {
    setUserToBeEdited(user)
    onOpenEditModal()
  }

  function handleDeleteUser(user: SystemUser) {
    setUserToBeDeleted(user)
    onOpenExcludeAlert()
  }
  
  return (
    <>
      <Head>
        <title>MoniPaEp | Usuários do sistema</title>
      </Head>
      <Flex h="100%" w="100%" bgColor="white" borderRadius="4" direction="column" >
        <Heading ml="8" my="6">
          Usuários do sistema
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
            { userToBeEdited && (
              <SystemUserEditModal 
                isOpen={isOpenEditModal} 
                onClose={onCloseEditModal} 
                systemUser={userToBeEdited}
                refetchList={refetch}
              />
            )}

            { userToBeDeleted && (
              <SystemUserExcludeAlert 
                isOpen={isOpenExcludeAlert} 
                onClose={onCloseExcludeAlert} 
                systemUser={userToBeDeleted.systemUser.id}
                refetchList={refetch}
              />
            )}

            <Flex mx="8" mb="8">
              <InputGroup w="30">
                <InputLeftElement>
                  <Icon as={MdSearch} fontSize="xl" color="gray.400"/>
                </InputLeftElement>
                <Input placeholder="Filtrar por nome..." onChange={debouncedChangeInputHandler}/>
              </InputGroup>      
            </Flex>

            <Flex direction="column" w="100%" overflow="auto" px="8">
              { data?.totalSystemUsers === 0 ? (
                <Text mt="2">
                  { search === '' ? 
                    'Não existem usuários registrados até o momento.' :
                    'A busca não encontrou nenhum usuário com esse nome.'
                  }
                </Text>
              ) : (
                <>
                  <Table w="100%" border="1px" borderColor="gray.200" boxShadow="md" mb="4">
                    <Thead bgColor="gray.200">
                      <Tr>
                        <Th>Nome</Th>
                        <Th>Setor</Th>
                        <Th>Autorizado</Th>
                        <Th>Administrador local</Th>
                        <Th>Administrador geral</Th>
                        <Th></Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      { data?.systemUsers.map(systemUser => (
                        <Tr key={systemUser.systemUser.id} _hover={{ bgColor: 'gray.50' }}>
                          <Td>
                            <Box textAlign="left">
                              <Text>{systemUser.systemUser.name}</Text>
                              <Text fontSize="sm" color="gray.500">
                                {systemUser.systemUser.email}
                              </Text>
                            </Box>
                          </Td>
                          <Td>
                            <Badge colorScheme={systemUser.systemUser.department === 'USM' ? 'purple' : 'orange'}>
                              { systemUser.systemUser.department === 'USM' ?
                                'Unidade de Saúde' : 
                                'Vigilância em Saúde'
                              }
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={systemUser.authorized ? 'green': 'red'}>
                              { systemUser.authorized ? 'Sim': 'Não' }
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={systemUser.localAdm ? 'green': 'red'}>
                              { systemUser.localAdm ? 'Sim': 'Não' }
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={systemUser.generalAdm ? 'green': 'red'}>
                              { systemUser.generalAdm ? 'Sim': 'Não' }
                            </Badge>
                          </Td>
                          <Td pr="4">
                            <Flex justifyContent="flex-end" alignItems="center">
                              <Button 
                                fontSize="lg" 
                                height="36px" 
                                width="36px" 
                                colorScheme="blue" 
                                disabled={systemUser.generalAdm && !isGeneralAdm}
                                onClick={() => handleEditUser(systemUser)}
                              >
                                <Icon as={BiPencil}/>
                              </Button>
                              <Button 
                                fontSize="lg" 
                                height="36px" 
                                ml="2"
                                width="36px" 
                                colorScheme="red" 
                                disabled={systemUser.generalAdm && !isGeneralAdm}
                                onClick={() => handleDeleteUser(systemUser)}
                              >
                                <Icon as={BiTrash}/>
                              </Button>
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  
                  <Box w="100%" mt="3" mb="5">
                    <Pagination 
                      currentPage={page} 
                      totalRegisters={data?.totalSystemUsers} 
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

SystemUsers.layout = DashboardLayout

export const getServerSideProps = withSSRAuth(async (ctx) => { 
  return { props: {} }
}, {
  roles: ['local.admin', 'general.admin']
})