import { Box, Flex, Heading, Icon } from "@chakra-ui/react";

import { AiOutlineDatabase } from "react-icons/ai"
import { BiArchive, BiBookHeart, BiClinic, BiHealth } from "react-icons/bi"
import { FiUsers } from "react-icons/fi"
import { RiQuestionAnswerLine, RiHealthBookLine } from "react-icons/ri"
import { HiOutlineClipboardList } from "react-icons/hi"

import { Can } from "../Can";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";
import { AccountSection } from "./AccountSection";

export function Sidebar() {
  return (
    <Box 
      as="aside" 
      w="64" 
      h="100%" 
      pb="9"
      bgColor="custom.blue-dark"
      display="flex"
      flexDir="column"
      justifyContent="flex-start"
      alignItems="center"
      boxShadow="base"
      position="fixed"
    >
      <Flex align="center" my="5">
        <Icon as={BiBookHeart} color="custom.blue-logo" height="30px" width="30px" mr="2"/>
        <Heading 
          color="custom.blue-logo"
          fontSize="3xl" 
          fontWeight="500" 
          fontFamily="Comfortaa" 
          pt="6px"
        >
          MoniPaEp
        </Heading>
      </Flex>

      <NavSection title="ACOMPANHAMENTO">
        <NavLink href="/dashboard/patients" icon={FiUsers}>
          Pacientes
        </NavLink>
        <NavLink href="/dashboard/diseaseoccurrences" icon={BiArchive}>
          Ocorrências de doenças
        </NavLink>
        <NavLink href="/dashboard/symptomoccurrences" icon={HiOutlineClipboardList}>
          Ocorrências de sintomas
        </NavLink>
        
      </NavSection>
      <NavSection title="GERENCIAMENTO">
        <NavLink href="/dashboard/faqs" icon={RiQuestionAnswerLine}>
          Área de FAQ
        </NavLink>
        <NavLink href="/dashboard/usms" icon={BiClinic}>
          Unidades de saúde
        </NavLink>
        <NavLink href="/dashboard/diseases" icon={RiHealthBookLine}>
          Doenças
        </NavLink>
        <NavLink href="/dashboard/symptoms" icon={AiOutlineDatabase}>
          Sintomas
        </NavLink>
        <NavLink href="/dashboard/healthprotocols" icon={BiHealth}>
          Protocolos de saúde
        </NavLink>
      </NavSection>
      
      <Can roles={["local.admin", "general.admin"]}>
        <NavSection title="PAINEL DE ADMINISTRADOR">
          <NavLink href="/dashboard/systemusers" icon={FiUsers}>
            Usuários do sistema
          </NavLink>
        </NavSection>
      </Can>

      <AccountSection />
    </Box>
  )
}