
import React from "react";
import { Flex, Button, HStack, IconButton } from "@chakra-ui/react";
import { FaSignOutAlt, FaHome, FaLinkedin } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <Flex
      as="nav"
      bg="#1a202c" // TaskManager dark gray
      p={{ base: 3, md: 4 }} // Responsive padding
      color="white"
      align="center"
      justify="space-between"
      boxShadow="0 4px 15px rgba(0, 0, 0, 0.2)" // Deeper shadow
      position="sticky" // Sticky navbar
      top={0}
      zIndex={1000} // Ensure it stays above content
    >
      {/* Home Button */}
      <Button
        leftIcon={<FaHome />}
        bg="transparent" // Cleaner look
        color="white"
        variant="ghost"
        fontSize={{ base: "sm", md: "md", lg: "lg" }}
        _hover={{
          bg: "gray.700",
          transform: "translateY(-1px)", // Subtle lift
        }}
        _active={{ bg: "gray.800" }}
        transition="all 0.2s ease" // Smooth transition
        onClick={() => navigate("/")}
        px={{ base: 3, md: 4 }} // Adjusted padding
      >
        Home
      </Button>

      {/* Right Section: LinkedIn and Logout */}
      <HStack spacing={{ base: 2, md: 4 }}>
        <IconButton
          icon={<FaSignOutAlt />}
          bg="linear-gradient(135deg, #e53e3e 0%, #c53030 100%)" // Red gradient for logout
          color="white"
          variant="solid"
          aria-label="Logout"
          fontSize={{ base: "md", md: "lg" }}
          size={{ base: "sm", md: "md" }}
          boxShadow="0 2px 8px rgba(229, 62, 62, 0.3)" // Matching shadow
          _hover={{
            bg: "linear-gradient(135deg, #d73636 0%, #b82a2a 100%)",
            transform: "translateY(-1px)",
          }}
          _active={{ bg: "#c53030" }}
          transition="all 0.2s ease"
          onClick={onLogout}
        />
      </HStack>
    </Flex>
  );
};

export default Navbar;
