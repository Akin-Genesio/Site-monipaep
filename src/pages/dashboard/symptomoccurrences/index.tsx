import { useState, useCallback, ChangeEvent, useMemo } from "react";
import Head from "next/head"
import NextLink from "next/link"
import { debounce } from "ts-debounce"
import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import { 
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
  Spinner,
} from "@chakra-ui/react";
import { MdSearch } from 'react-icons/md'

import { withSSRAuth } from "../../../utils/withSSRAuth";
import { Pagination } from "../../../components/Pagination";
import { useSymptomOccurrences } from "../../../hooks/useSymptomOccurrences";

export default function SymptomOccurrences() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading, isFetching, error } = useSymptomOccurrences({ page, filter: search })

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
        <title>MoniPaEp | Ocorrências de sintomas</title>
      </Head>

      <Flex h="100%" w="100%" bgColor="white" borderRadius="4" direction="column" >
        <Heading ml="8" my="6">
          Ocorrências de sintomas
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
            <Flex mx="8" mb="8" justifyContent="space-between" alignItems="center">
              <InputGroup w="30">
                <InputLeftElement>
                  <Icon as={MdSearch} fontSize="xl" color="gray.400"/>
                </InputLeftElement>
                <Input placeholder="Filtrar por paciente..." onChange={debouncedChangeInputHandler}/>
              </InputGroup>  
            </Flex>

            <Flex direction="column" w="100%" overflow="auto" px="8">
              { data?.totalSymptomOccurrences === 0 ? (
                <Text mt="2">
                  { search === '' ? 
                    'Não existem ocorrências de sintomas em aberto até o momento.' : 
                    'A busca não encontrou nenhuma ocorrência em aberto desse paciente.'
                  }
                </Text>
              ) : (
                <>
                  <Table w="100%" border="1px" borderColor="gray.200" boxShadow="md" mb="4">
                    <Thead bgColor="gray.200">
                      <Tr>
                        <Th>Nome do paciente</Th>
                        <Th>Início dos sintomas</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      { data?.symptomOccurrences.map(symptomOccurrence => (
                        <Tr key={symptomOccurrence.id} _hover={{ bgColor: 'gray.50' }}>
                          <Td>
                            <NextLink 
                              href={`/dashboard/patients/unassignedsymptoms/${symptomOccurrence.patient_id}`} 
                              passHref
                            >
                              <Link color="blue.500" fontWeight="semibold">
                                {symptomOccurrence.patient.name}
                              </Link>
                            </NextLink>
                          </Td>
                          <Td>
                            {symptomOccurrence.registered_date}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  <Box w="100%" mt="3" mb="5">
                    <Pagination 
                      currentPage={page} 
                      totalRegisters={data?.totalSymptomOccurrences} 
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

SymptomOccurrences.layout = DashboardLayout

export const getServerSideProps = withSSRAuth(async (ctx) => { 
  return { props: {} }
})