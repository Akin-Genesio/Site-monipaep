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
import { useDiseaseOccurrences } from "../../../hooks/useDiseaseOccurrences";
import { Pagination } from "../../../components/Pagination";
import DashboardLayout from "../../../components/Layouts/DashboardLayout";

function getBadgeColor(status: string) {
  if(status === "Saudável" || status === "Curado") {
    return "green"
  } else if(status === "Suspeito") {
    return "yellow"
  } else if(status === "Infectado") {
    return "red"
  } else {
    return "purple"
  }
}

export default function DiseaseOccurrences() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('patient_name')
  const [search, setSearch] = useState('')
  const { data , isLoading, isFetching, error } = useDiseaseOccurrences({ page, filter: [filter, search]})

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
        <title>MoniPaEp | Ocorrências de doenças</title>
      </Head>
      <Flex h="100%" w="100%" bgColor="white" borderRadius="4" direction="column" >
        <Heading ml="8" my="6">
          Ocorrências de doenças
          { !isLoading && isFetching && <Spinner ml="4"/> }
        </Heading>
        { isLoading ? (
          <Box w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
            <Spinner size="lg"/>
          </Box>
        ) : error ? (
          <Flex mx="8" mt="2" alignItems="flex-start" justifyContent="flex-start">
            <Text>Erro ao carregar os dados</Text>
          </Flex>
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
                <option value="patient_name">Paciente</option>
                <option value="disease_name">Doença</option>
                <option value="status">Status</option>
              </Select>            
            </Flex>

            <Flex direction="column" w="100%" overflow="auto" px="8">
              { data?.totalDiseaseOccurrences === 0 ? (
                <Text mt="2">
                  { search === '' ? 
                    'Não existem ocorrências de doença registradas até o momento.' :
                    'A busca não encontrou nenhuma ocorrência de doença com esse filtro.'
                  }
                </Text>
              ) : (
                <>
                  <Table w="100%" border="1px" borderColor="gray.200" boxShadow="md" mb="4">
                    <Thead bgColor="gray.200">
                      <Tr>
                        <Th>Paciente</Th>
                        <Th>Doença</Th>
                        <Th>Data de início</Th>
                        <Th>Data de término</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>

                    <Tbody>
                      { data?.diseaseOccurrences.map(diseaseOccurrence => (
                        <Tr key={diseaseOccurrence.id} _hover={{ bgColor: 'gray.50' }}>
                          <Td>
                            <NextLink 
                              href={`/dashboard/patients/diseasehistory/${diseaseOccurrence.patient_id}/${diseaseOccurrence.id}`} 
                              passHref
                            >
                              <Link color="blue.500" fontWeight="semibold">
                                {diseaseOccurrence.patient.name}
                              </Link>
                            </NextLink>
                          </Td>
                          <Td>
                            <Text>{diseaseOccurrence.disease_name}</Text>
                          </Td>
                          <Td>
                            <Text>{diseaseOccurrence.date_start}</Text>
                          </Td>
                          <Td>
                            { diseaseOccurrence.date_end ? (
                              <Text>{diseaseOccurrence.date_end}</Text>
                            ) : (
                              <Badge colorScheme="green">
                                Em andamento
                              </Badge>
                            ) }
                          </Td>
                          <Td>
                            <Badge colorScheme={getBadgeColor(diseaseOccurrence.status)}>
                              {diseaseOccurrence.status}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                  
                  <Box w="100%" mt="3" mb="5">
                    <Pagination 
                      currentPage={page} 
                      totalRegisters={data?.totalDiseaseOccurrences} 
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

DiseaseOccurrences.layout = DashboardLayout

export const getServerSideProps = withSSRAuth(async (ctx) => { 
  return { props: {} }
})