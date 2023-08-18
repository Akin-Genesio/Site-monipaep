import { useContext } from "react";
import Head from "next/head"
import Router from "next/router"

import { 
  Box, 
  Button,
  Flex, 
  Heading, 
  HStack,
  Icon,
  Text, 
  Spinner,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { BiPencil } from 'react-icons/bi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { IoChevronBack } from "react-icons/io5"

import { withSSRAuth } from "../../utils/withSSRAuth";
import { useUserDetails } from "../../hooks/useUserDetails";
import { AuthContext } from "../../contexts/AuthContext";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { UserDetailsEditModal } from "../../components/Modal/UserDetailsEditModal";
import { UserPasswordEditModal } from "../../components/Modal/UserPasswordEditModal";

export default function Account() {
  const { user } = useContext(AuthContext)
  const { data, isLoading, isFetching, error, refetch } = useUserDetails({ userId: user?.user.id })
  const { 
    isOpen: isOpenEditDetailsModal, 
    onOpen: onOpenEditDetailsModal, 
    onClose: onCloseEditDetailsModal 
  } = useDisclosure()

  const { 
    isOpen: isOpenEditPasswordModal, 
    onOpen: onOpenEditPasswordModal, 
    onClose: onCloseEditPasswordModal 
  } = useDisclosure()

  return (
    <>
      <Head>
        <title>MoniPaEp | Detalhes do usuário</title>
      </Head>
      <Flex h="100%" w="100%" bgColor="white" borderRadius="4" direction="column" >
        <Heading ml="8" my="6">
          Detalhes do usuário
          { !isLoading && isFetching && <Spinner ml="4"/> }
        </Heading>
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
            { data && (
              <UserDetailsEditModal 
                isOpen={isOpenEditDetailsModal}
                onClose={onCloseEditDetailsModal}
                user={data}
                refetch={refetch}
              />
            )}

            { data && (
              <UserPasswordEditModal 
                isOpen={isOpenEditPasswordModal}
                onClose={onCloseEditPasswordModal}
                userId={data?.id}
              />
            )}

            <Flex pl="5">
              <Icon 
                as={IoChevronBack} 
                fontSize="22px" 
                mt="9" 
                mr="6"
                _hover={{ cursor: 'pointer' }}
                onClick={() => Router.back()}
              />
              <VStack mt="8" alignItems="flex-start">
                <Flex>
                  <Text fontWeight="bold">Nome:&nbsp;</Text>
                  <Text>{data?.name}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold">CPF:&nbsp;</Text>
                  <Text>{data?.CPF}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold">Email:&nbsp;</Text>
                  <Text>{data?.email}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold">Departamento:&nbsp;</Text>
                  <Text>{data?.department}</Text>
                </Flex>
                <Flex>
                  <Text fontWeight="bold">Criado em:&nbsp;</Text>
                  <Text>{data?.createdAt}</Text>
                </Flex>
                <HStack w="100%" pt="2" spacing="2">
                  <Button 
                    colorScheme="blue"
                    flex="1"
                    leftIcon={<Icon as={BiPencil} fontSize="20"/>}
                    onClick={onOpenEditDetailsModal}
                  >
                    Editar dados
                  </Button>
                  <Button 
                    colorScheme="purple"
                    flex="1"
                    leftIcon={<Icon as={RiLockPasswordLine} fontSize="20"/>}
                    onClick={onOpenEditPasswordModal}
                  >
                    Alterar senha
                  </Button>
                </HStack>
              </VStack>
            </Flex>
          </>
        )}
      </Flex>
    </>
  )
}

Account.layout = DashboardLayout

export const getServerSideProps = withSSRAuth(async (ctx) => { 
  return { props: {} }
})