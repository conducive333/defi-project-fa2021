import { SearchIcon } from "@chakra-ui/icons"
import {
  chakra,
  Flex,
  HStack,
  HTMLChakraProps,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react"
import * as React from "react"

export const SearchButton = (
  props: HTMLChakraProps<"button">,
) => {
  return (
    <Flex width="60%">
      <InputGroup>
        <InputLeftElement children={<SearchIcon color="gray.300" />} />
        <Input
            // type="button"
            // role="search"
            // mx="6"
            lineHeight="1.2"
            w="100%"
            bg={useColorModeValue("white", "gray.700")}
            // whiteSpace="nowrap"
            // display={{ base: "none", sm: "flex" }}
            // alignItems="center"
            color="gray.400"
            // _focus={{ shadow: "outline" }}
            // shadow="base"
            // rounded="md"
            // aria-label="Search items"
            placeholder="Search items"
            // {...props}
        />
      </InputGroup>
    </Flex>
  )
}
