import React from "react";
import { Flex, Button, HStack, Spacer, IconButton } from "@chakra-ui/react";
import { FaSignOutAlt, FaHome, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <Flex
      bg="black"
      p={4}
      color="white"
      align="center"
      justifyContent="space-between"
      boxShadow="md"
    >
      {/* Navigation Links */}
      <Button
        leftIcon={<FaHome />}
        colorScheme="whiteAlpha"
        variant="ghost"
        onClick={() => navigate("/")}
        fontSize={["sm", "md", "lg"]}
      >
        Home
      </Button>

      {/* LinkedIn Icon and Logout Button */}
      <HStack spacing={4}>
        <IconButton
          as="a"
          href="https://www.linkedin.com/in/alberto-juniorr/"
          target="_blank"
          icon={<FaLinkedin />}
          color="#0A66C2"
          variant="solid"
          aria-label="LinkedIn"
          colorScheme="#00FFFF"
          fontSize={["sm", "md", "lg"]}
          size={["sm", "md", "lg"]}
        />
        <Spacer />

        <IconButton
          icon={<FaSignOutAlt />}
          colorScheme="black"
          border="1px solid grey"
          variant="solid"
          onClick={onLogout}
          aria-label="Logout"
          fontSize={["sm", "md", "lg"]}
          size={["sm", "md", "md"]}
        />
      </HStack>
    </Flex>
  );
};

export default Navbar;
