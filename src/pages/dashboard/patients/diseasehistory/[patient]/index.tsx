import { useState, useCallback, ChangeEvent, useMemo } from "react";
import Head from "next/head"
import NextLink from "next/link"
import { debounce } from "ts-debounce"

import { 
  Badge, 
  Box, 
  Flex, 
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

import { withSSRAuth } from "../../../../../utils/withSSRAuth";
import { Pagination } from "../../../../../components/Pagination";
import DashboardLayout from "../../../../../components/Layouts/DashboardLayout";
import { usePatientDiseaseHistory } from "../../../../../hooks/usePatientDiseaseHistory";
import { PatientDataWrapper } from "../../../../../components/Layouts/PatientDataWrapper";

interface PatientDiseaseHistoryProps {
  patientId: string;
}

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

export default function PatientDiseaseHistory({ patientId }: PatientDiseaseHistoryProps) {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState('disease_name')
  const [search, setSearch] = useState('')
  const { data , isLoading, isFetching, error } = usePatientDiseaseHistory({ page, patientId, filter: [filter, search]})

  const handleChangeInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    setSearch(event.target.value)
  }, [])

  const debouncedChangeInputHandler = useMemo(
    () => debounce(handleChangeInput, 600)  
  , [handleChangeInput]) 
  
  return (
    <PatientDataWrapper id={patientId} isFetching={isFetching} isLoading={isLoading}>
      <Head>
        <title>MoniPaEp | Histórico de doenças</title>
      </Head>
      <Flex h="100%" w="100%" bgColor="white" borderRadius="4" direction="column" mt="9">
        { isLoading ? (
          <Box w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
            <Spinner size="lg" mt="10"/>
          </Box>
        ) : error ? (
          <Flex mx="8" mt="2" alignItems="flex-start" justifyContent="flex-start">
            <Text>Erro ao carregar os dados</Text>
          </Flex>
        ) : (
          <>
            { (data?.totalDiseaseOccurrences === 0 && search === '') ? <></> : (
              <Flex mx="8" mb="8">
                <InputGroup w="30">
                  <InputLeftElement>
                    <Icon as={MdSearch} fontSize="xl" color="gray.400"/>
                  </InputLeftElement>
                  <Input placeholder="Filtrar..." onChange={debouncedChangeInputHandler}/>
                </InputGroup>
                <Select w="32" onChange={e => {setFilter(e.target.value)}} ml="2">
                  <option value="disease_name">Doença</option>
                  <option value="status">Status</option>
                </Select>            
              </Flex>
            )}  

            <Flex direction="column" w="100%" overflow="auto" px="8">
              { data?.totalDiseaseOccurrences === 0 ? (
                <Text>
                  { search === '' ? 
                    'Não existem ocorrências de doença registradas até o momento para este paciente.' :
                    'A busca não encontrou nenhuma ocorrência de doença com esse filtro.'
                  }
                </Text>
              ) : (
                <>
                  <Table w="100%" border="1px" borderColor="gray.200" boxShadow="md" mb="4">
                    <Thead bgColor="gray.200">
                      <Tr>
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
                              href={`/dashboard/patients/diseasehistory/${patientId}/${diseaseOccurrence.id}`} 
                              passHref
                            >
                              <Link color="blue.500" fontWeight="semibold">
                                {diseaseOccurrence.disease_name}
                              </Link>
                            </NextLink>
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
    </PatientDataWrapper>
  )
}

PatientDiseaseHistory.layout = DashboardLayout

export const getServerSideProps = withSSRAuth(async (ctx) => { 
  const params = ctx.params
  return { 
    props: { 
      patientId: params?.patient 
    } 
  }
})