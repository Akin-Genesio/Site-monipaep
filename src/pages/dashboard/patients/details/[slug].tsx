import Head from "next/head"
import Router from "next/router"

import { Box, Button, Flex, Icon, Text, Spinner, VStack, useDisclosure } from "@chakra-ui/react";
import { BiTrash } from 'react-icons/bi'
import { IoChevronBack } from "react-icons/io5"

import { withSSRAuth } from "../../../../utils/withSSRAuth";
import { usePatientDetails } from "../../../../hooks/usePatientDetails";
import { PatientDataWrapper } from "../../../../components/Layouts/PatientDataWrapper"
import DashboardLayout from "../../../../components/Layouts/DashboardLayout";
import { Can } from "../../../../components/Can";
import { PatientExcludeAlert } from "../../../../components/AlertDialog/PatientExcludeAlert";

interface PatientDetailsProps {
  patientId: string;
}

export default function PatientDetails({ patientId }: PatientDetailsProps) {
  const { data, isLoading, isFetching, error } = usePatientDetails({ patientId })
  const { 
    isOpen: isOpenExcludeAlert, 
    onOpen: onOpenExcludeAlert, 
    onClose: onCloseExcludeAlert 
  } = useDisclosure()

  return (
    <PatientDataWrapper id={patientId} isFetching={isFetching} isLoading={isLoading}>
      <Head>
        <title>MoniPaEp | Detalhes do paciente</title>
      </Head>
      <Flex h="100%" w="100%" bgColor="white" borderRadius="4" direction="column">
        { isLoading ? (
          <Box w="100%" h="100%" display="flex" justifyContent="center" alignItems="center">
            <Spinner size="lg" mt="10"/>
          </Box>
        ) : error ? (
          <Box w="100%" display="flex" justifyContent="center" alignItems="center">
            <Text>Erro ao carregar os dados</Text>
          </Box>
        ) : (
          <>
            <PatientExcludeAlert 
              isOpen={isOpenExcludeAlert}
              onClose={onCloseExcludeAlert}
              patientId={patientId}
            />

            <Flex pl="5">
              <Icon 
                as={IoChevronBack} 
                fontSize="22px" 
                mt="9" 
                mr="6"
                _hover={{ cursor: 'pointer' }}
                onClick={() => Router.back()}
              />
              <Flex direction="column">
                <VStack mt="8" alignItems="flex-start">
                  <Flex>
                    <Text fontWeight="bold">Nome:&nbsp;</Text>
                    <Text>{data?.patients[0].name}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold">Gênero:&nbsp;</Text>
                    <Text>{data?.patients[0].gender}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold">CPF:&nbsp;</Text>
                    <Text>{data?.patients[0].CPF}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold">Email:&nbsp;</Text>
                    <Text>{data?.patients[0].email}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold">Data de nascimento:&nbsp;</Text>
                    <Text>{data?.patients[0].birthdate}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold">Telefone:&nbsp;</Text>
                    <Text>{data?.patients[0].phone}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold">Endereço residencial:&nbsp;</Text>
                    <Text>{data?.patients[0].homeAddress}, {data?.patients[0].houseNumber}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold">Bairro residencial:&nbsp;</Text>
                    <Text>{data?.patients[0].neighborhood}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold">Endereço do trabalho:&nbsp;</Text>
                    <Text>{data?.patients[0].workAddress}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold">Plano de saúde:&nbsp;</Text>
                    <Text>{data?.patients[0].hasHealthPlan ? 'Possui' : 'Não possui'}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold">Status do paciente:&nbsp;</Text>
                    <Text>{data?.patients[0].status}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold">Status da conta:&nbsp;</Text>
                    <Text>{data?.patients[0].activeAccount ? 'Ativa': 'Inativa'}</Text>
                  </Flex>
                  <Flex>
                    <Text fontWeight="bold">Data de registro no aplicativo:&nbsp;</Text>
                    <Text>{data?.patients[0].createdAt}</Text>
                  </Flex>
                </VStack>
                <Can roles={['general.admin']}>
                  <Button 
                    colorScheme="red"
                    mt="5"
                    w="200px"
                    leftIcon={<Icon as={BiTrash} fontSize="22"/>}
                    onClick={onOpenExcludeAlert}
                  >
                    Excluir paciente
                  </Button>
                </Can>
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
    </PatientDataWrapper>
  )
}

PatientDetails.layout = DashboardLayout

export const getServerSideProps = withSSRAuth(async (ctx) => { 
  const params = ctx.params
  return { 
    props: { 
      patientId: params?.slug 
    } 
  }
})