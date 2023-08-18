import { ReactNode } from "react";
import { Divider, Flex, Heading, Spinner } from "@chakra-ui/react";
import { TabNavLink } from "./NavLink/TabNavLink";

interface PatientDataWrapperProps {
  children: ReactNode;
  id: string;
  isFetching: boolean;
  isLoading: boolean;
}

export function PatientDataWrapper({ children, id, isFetching, isLoading }: PatientDataWrapperProps) {
  return (
    <Flex direction="column" width="100%" bgColor="white">
      <Flex alignItems="center">
        <Heading ml="8" my="6">
          Detalhes do paciente
        </Heading>
        { !isLoading && isFetching && <Spinner ml="4"/> }
      </Flex>
      <Flex ml="8">
        <TabNavLink href={`/dashboard/patients/details/${id}`} dynamicRoute>
          Dados cadastrais
        </TabNavLink>
        <TabNavLink href={`/dashboard/patients/diseasehistory/${id}`} ml="6" dynamicRoute>
          Histórico de doenças
        </TabNavLink>
        <TabNavLink href={`/dashboard/patients/unassignedsymptoms/${id}`} ml="6" dynamicRoute>
          Sintomas em aberto
        </TabNavLink>
      </Flex>
      <Divider />
      {children}
    </Flex>
  )
}
