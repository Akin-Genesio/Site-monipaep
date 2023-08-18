import { ElementType } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box, Icon, Text, LinkProps as ChakraLinkProps, Link as ChakraLink } from "@chakra-ui/react";

interface NavLinkProps extends ChakraLinkProps {
  href: string;
  icon: ElementType;
  children: string;
}

export function NavLink({ href, icon, children, ...rest }: NavLinkProps) {
  const { asPath } = useRouter()
  
  let isActive = false

  if(asPath.startsWith(href)) {
    isActive = true
  }
  
  return (
    <Link href={href} passHref>
      <ChakraLink {...rest} _hover={{ textDecoration: "none" }} w="100%">
        <Box 
          w="100%" 
          role="group"
          display="flex" 
          bgColor={ isActive ? "custom.blue-light" : "custom.blue-dark"} 
          align="center" 
          mx="auto"
          _hover= {{ bgColor: "custom.blue-light" }}
          transition= "background"
          transitionDuration="0.2s"
          pl="4" 
          borderRadius={4}
          height="9"
          alignItems="center"
          textDecoration="none"
        >
          <Icon 
            as={icon} 
            fontSize="1.125rem"
            color={isActive ? "white": "custom.gray-light"} 
            transition= "color"
            transitionDuration="0.2s"
            _groupHover={{ color: "white" }}
          />
          <Text 
            ml="3"
            pt="2px"
            fontWeight="medium"
            color={isActive ? "white": "custom.gray-light"}
            transition= "color"
            transitionDuration="0.2s"
            _groupHover={{ color: "white" }}
            align="center"
          >
            {children}
          </Text>
        </Box>
      </ChakraLink>
    </Link>
  )
}