import { useState, useCallback, ChangeEvent, useMemo } from "react";
import Head from "next/head"
import NextLink from "next/link"
import { debounce } from "ts-debounce"

import { 
  Badge, 
  Box, 
  Flex, 
  Heading, 
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Table, 
  Tbody, 
  Td, 
  Text, 
  Th, 
  Thead, 
  Tr, 
  Select, 
  Spinner,
} from "@chakra-ui/react";
import { MdSearch } from 'react-icons/md'

import { withSSRAuth } from "../../../utils/withSSRAuth";
import { usePatients } from "../../../hooks/usePatients";
import { Pagination } from "../../../components/Pagination";
import DashboardLayout from "../../../components/Layouts/DashboardLayout";

function getBadgeColor(status: string) {
  if(status === "Saudável") {
    return "green"
  } else if(status === "Suspeito") {
    return "yellow"
  } else if(status === "Infectado") {
    return "red"
  } else {
    return "purple"
  }
}

export default function Patients() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('name')
  const [search, setSearch] = useState('')
  const { data , isLoading, isFetching, error } = usePatients({ page, filter: [filter, search]})

  const handleChangeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    setSearch(event.target.value)
  }, [])

  const debouncedChangeInputHandler = useMemo(
    () => debounce(handleChangeInput, 600)  
  , [handleChangeInput]) 
  
  return (
    <>
      <Head>
        <title>MoniPaEp | Pacientes</title>
      </Head>
      <Flex h="100%" w="100%" bgColor="white" borderRadius="4" direction="column" >
        <Heading ml="8" my="6">
          Pacientes
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
            <Flex mx="8" mb="8">
              <InputGroup w="30">
                <InputLeftElement>
                  <Icon as={MdSearch} fontSize="xl" color="gray.400"/>
                </InputLeftElement>
                <Input placeholder="Filtrar..." onChange={debouncedChangeInputHandler}/>
              </InputGroup>
              <Select w="32" onChange={e => {setFilter(e.target.value)}} ml="2">
                <option value="name">Nome</option>
                <option value="cpf">CPF</option>
                <option value="gender">Gênero</option>
                <option value="neighborhood">Bairro</option>
                <option value="status">Status</option>
              </Select>            
            </Flex>

            <Flex direction="column" w="100%" overflow="auto" px="8">
              { data?.totalPatients === 0 ? (
                <Text mt="2">
                  { search === '' ? 
                    'Não existem pacientes registrados até o momento.' :
                    'A busca não encontrou nenhum paciente com esse filtro.'
                  }
                </Text>
              ) : (
                <>
                  <Table w="100%" border="1px" borderColor="gray.200" boxShadow="md" mb="4">
                    <Thead bgColor="gray.200">
                      <Tr>
                        <Th>Nome</Th>
                        <Th>Gênero</Th>
                        <Th>CPF</Th>
                        <Th>Data de nascimento</Th>
                        <Th>Bairro residencial</Th>
                        <Th>Plano de saúde</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      { data?.patients.map(patient => (
                        <Tr 
                          key={patient.id} 
                          _hover={{ bgColor: 'gray.50' }} 
                        >
                          <Td>
                            <NextLink href={`/dashboard/patients/details/${patient.id}`} passHref>
                              <Link color="blue.500" fontWeight="semibold">
                                {patient.name}
                              </Link>
                            </NextLink>
                          </Td>
                          <Td>
                            <Text>{patient.gender}</Text>
                          </Td>
                          <Td>
                            <Text>{patient.CPF}</Text>
                          </Td>
                          <Td>
                            <Text>{patient.birthdate}</Text>
                          </Td>
                          <Td>
                            <Text>{patient.neighborhood}</Text>
                          </Td>
                          <Td>
                            <Badge colorScheme={patient.hasHealthPlan ? 'green' : 'red'}>
                              {patient.hasHealthPlan ? 'Possui' : 'Não possui'}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge colorScheme={getBadgeColor(patient.status)}>
                              {patient.status}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  
                  <Box w="100%" mt="3" mb="5">
                    <Pagination 
                      currentPage={page} 
                      totalRegisters={data?.totalPatients} 
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

Patients.layout = DashboardLayout

export const getServerSideProps = withSSRAuth(async (ctx) => { 
  return { props: {} }
})