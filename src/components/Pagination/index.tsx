import { Flex, Text, HStack } from "@chakra-ui/react";
import { PaginationItem } from "./PaginationItem";
import { GeneratePagesList } from "../../utils/generatePagesList";

interface PaginationProps {
  totalRegisters: number | undefined;
  registersPerPage?: number | undefined;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ totalRegisters = 0, registersPerPage = 10, currentPage = 1, onPageChange }: PaginationProps) {
  let initialRange = 1 + registersPerPage * (currentPage - 1)
  let finalRange = registersPerPage * currentPage 
  if(finalRange > totalRegisters) {
    finalRange = totalRegisters
  }
  if(initialRange > finalRange) {
    initialRange = finalRange
  }

  const pages = GeneratePagesList({ currentPage, registersPerPage, totalRegisters })
  
  return (
    <Flex w="100%" justifyContent="space-between" alignItems="center" overflow="auto">
      <Text borderRadius="4" px="2"><strong>{initialRange}</strong> - <strong> {finalRange}</strong> de <strong>{totalRegisters}</strong></Text>
      <HStack spacing="2" height="10">
        { pages.map(page => {
          if(page === -1) {
            return (
              <Text textAlign="center" width="4">...</Text>
            )
          }
          return ( page > 0 &&
            <PaginationItem
              key={page}
              page={page} 
              isCurrent={currentPage === page ?? false} 
              onPageChange={onPageChange}
            />
          )
        })}
      </HStack>
    </Flex>
  )
}