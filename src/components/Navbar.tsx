
import React from "react";
import {
  Box,
  Flex,
  Button,
  Link,
  IconButton,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import homeImage from "../images/nob.png"; // Adjust the path to your logo image

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure(); // For the hamburger menu

  return (
    <Box
      bg="#1a202c" // TaskManager dark gray
      color="white"
      px={{ base: 4, md: 6 }} // Responsive padding
      py={{ base: 3, md: 4 }}
      boxShadow="0 4px 15px rgba(0, 0, 0, 0.2)" // Deeper shadow
      position="sticky" // Sticky navbar
      top={0}
      zIndex={1000} // Above content
    >
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        {/* Home Link with Logo */}
        <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <Flex align="center">
            <Image
              src={homeImage}
              alt="Home"
              boxSize={{ base: "36px", md: "44px", lg: "52px" }} // Slightly smaller on mobile
              objectFit="contain"
              transition="transform 0.2s ease" // Smooth hover effect
              _hover={{ transform: "scale(1.05)" }} // Subtle zoom on hover
            />
          </Flex>
        </Link>

        {/* Desktop Menu */}
        <Flex gap={{ base: 3, md: 4 }} display={{ base: "none", md: "flex" }}>
          <Link as={RouterLink} to="/login" _hover={{ textDecoration: "none" }}>
            <Button
              bg="transparent"
              color="white"
              border="2px solid"
              borderColor="gray.600"
              borderRadius="full"
              fontSize={{ base: "sm", md: "md" }}
              px={{ base: 4, md: 6 }}
              _hover={{
                bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderColor: "transparent",
              }}
              _active={{ bg: "gray.700" }}
              transition="all 0.2s ease"
            >
              Login
            </Button>
          </Link>
          <Link
            as={RouterLink}
            to="/register"
            _hover={{ textDecoration: "none" }}
          >
            <Button
              bg="linear-gradient(135deg, #34d399 0%, #059669 100%)" // TaskManager green gradient
              color="white"
              borderRadius="full"
              fontSize={{ base: "sm", md: "md" }}
              px={{ base: 4, md: 6 }}
              boxShadow="0 2px 8px rgba(52, 211, 153, 0.3)" // Subtle shadow
              _hover={{
                bg: "linear-gradient(135deg, #2cc084 0%, #048554 100%)",
                transform: "translateY(-1px)",
              }}
              _active={{ bg: "#048554" }}
              transition="all 0.2s ease"
            >
              Register
            </Button>
          </Link>
        </Flex>

        {/* Hamburger Menu for Mobile */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          bg="transparent"
          color="white"
          border="2px solid"
          borderColor="gray.600"
          borderRadius="full"
          size={{ base: "sm", md: "md" }}
          _hover={{ bg: "gray.700", borderColor: "gray.500" }}
          _active={{ bg: "gray.800" }}
          transition="all 0.2s ease"
          onClick={onToggle}
        />
      </Flex>

      {/* Mobile Menu */}
      {isOpen && (
        <Box
          display={{ base: "block", md: "none" }}
          bg="#1a202c"
          px={4}
          py={4}
          position="absolute"
          top="100%" // Position below navbar
          left={0}
          right={0}
          zIndex={999} // Below navbar but above content
          boxShadow="0 4px 15px rgba(0, 0, 0, 0.2)" // Consistent shadow
        >
          <Flex direction="column" gap={3}>
            <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "gray.700" }}
                _active={{ bg: "gray.800" }}
                width="100%"
                justifyContent="flex-start"
                fontSize="md"
                transition="all 0.2s ease"
              >
                Home
              </Button>
            </Link>
            <Link
              as={RouterLink}
              to="/login"
              _hover={{ textDecoration: "none" }}
            >
              <Button
                bg="transparent"
                color="white"
                border="2px solid"
                borderColor="gray.600"
                borderRadius="full"
                _hover={{ bg: "gray.700", borderColor: "gray.500" }}
                _active={{ bg: "gray.800" }}
                width="100%"
                fontSize="md"
                transition="all 0.2s ease"
              >
                Login
              </Button>
            </Link>
            <Link
              as={RouterLink}
              to="/register"
              _hover={{ textDecoration: "none" }}
            >
              <Button
                bg="linear-gradient(135deg, #34d399 0%, #059669 100%)"
                color="white"
                borderRadius="full"
                _hover={{
                  bg: "linear-gradient(135deg, #2cc084 0%, #048554 100%)",
                }}
                _active={{ bg: "#048554" }}
                width="100%"
                fontSize="md"
                transition="all 0.2s ease"
              >
                Register
              </Button>
            </Link>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
