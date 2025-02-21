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
import img1 from "../images/logo2.png"; // Adjust the path to your logo image

const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure(); // For the hamburger menu

  return (
    <Box bg="black" color="white" px={4} py={3}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        maxW="1200px"
        mx="auto"
      >
        {/* Home Link with Logo */}
        <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <Flex alignItems="center">
            <Image
              src={img1} // Use the imported image
              alt="SPENDEE Logo"
              width="80px"
              height="50px"
              mr={2}
            />
          </Flex>
        </Link>

        {/* Desktop Menu */}
        <Flex gap={4} display={{ base: "none", md: "flex" }}>
          <Link as={RouterLink} to="/login" _hover={{ textDecoration: "none" }}>
            <Button
              variant="outline"
              border="2px solid white"
              borderRadius="full"
              color="white"
              _hover={{ bg: "white", color: "black" }}
              fontSize={{ base: "sm", md: "md" }}
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
              bg="black"
              color="white"
              borderRadius="full"
              _hover={{ bg: "none", border: "2px solid white", color: "white" }}
              fontSize={{ base: "sm", md: "md" }}
            >
              Register
            </Button>
          </Link>
        </Flex>

        {/* Hamburger Menu for Mobile */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          aria-label="Open Menu"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={onToggle}
          variant="outline"
          color="white"
          _hover={{ bg: "whiteAlpha.200" }}
        />
      </Flex>

      {/* Mobile Menu (appears when the hamburger icon is clicked) */}
      {isOpen && (
        <Box
          display={{ base: "block", md: "none" }}
          bg="black"
          color="white"
          px={4}
          py={2}
          position="absolute"
          top="60px"
          left="0"
          right="0"
          zIndex="1000"
        >
          <Flex direction="column" gap={2}>
            <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                width="100%"
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
                variant="outline"
                border="2px solid white"
                borderRadius="full"
                color="white"
                _hover={{ bg: "white", color: "black" }}
                width="100%"
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
                variant="outline"
                border="2px solid white"
                borderRadius="full"
                color="white"
                _hover={{ bg: "white", color: "black" }}
                width="100%"
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
