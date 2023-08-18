import { ReactNode } from "react";
import { Divider, Flex, Heading } from "@chakra-ui/react";
import { Sidebar } from "../Sidebar";
import { TabNavLink } from "./NavLink/TabNavLink";
interface HealthProtocolsLayoutProps {
  children: ReactNode
}

const HealthProtocolsLayout = ({ children }: HealthProtocolsLayoutProps) => {
  return (
    <Flex w="100vw" h="100%" maxWidth="100%" bgColor="gray.100">
      <Sidebar />
      <Flex ml="64" direction="column" h="100%" width="calc(100% - 256px)" bgColor="white">
        <Heading ml="8" my="6">
          Protocolos de saúde
        </Heading>
        <Flex ml="8">
          <TabNavLink href="/dashboard/healthprotocols">
            Protocolos
          </TabNavLink>
          <TabNavLink href="/dashboard/healthprotocols/assignments" ml="6">
            Associações
          </TabNavLink>
        </Flex>
        <Divider />
        {children}
      </Flex>
    </Flex>
  )
}

export default HealthProtocolsLayout