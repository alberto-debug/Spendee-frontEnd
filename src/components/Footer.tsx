// src/components/Footer.tsx
import { Box, Text, Link, Flex } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box bg="black" color="white" py={6} mt={10}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        maxW="1200px"
        mx="auto"
        px={4}
      >
        <Text>&copy; 2025 Spendee. All rights reserved.</Text>
        <Flex gap={4}>
          <Link href="#" color="white">
            Privacy Policy
          </Link>
          <Link href="#" color="white">
            Terms of Service
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
