import { ReactNode } from "react";
import { Flex } from "@chakra-ui/react";
import { Sidebar } from "../Sidebar";

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <Flex w="100vw" h="100%" maxWidth="100%" bgColor="gray.100">
      <Sidebar />
      <Flex ml="64" direction="column" h="100%" width="calc(100% - 256px)">
        {children}
      </Flex>
    </Flex>
  )
}

export default DashboardLayout