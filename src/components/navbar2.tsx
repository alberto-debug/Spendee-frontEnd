

"use client"

import type React from "react"
import {
  Flex,
  Button,
  HStack,
  IconButton,
  Box,
  Text,
  useBreakpointValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Divider,
} from "@chakra-ui/react"
import { FaSignOutAlt, FaHome, FaUser, FaCreditCard, FaChartLine, FaBell } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

interface NavbarProps {
  onLogout: () => void
  userName?: string
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, userName = "Alberto Junior" }) => {
  const navigate = useNavigate()

  // Responsive adjustments
  const isMobile = useBreakpointValue({ base: true, md: false })

  // Modern gradient background
  const bgGradient = "linear-gradient(to right, #0F172A, #1E293B)"

  // Accent color for hover effects
  const accentColor = "#10B981"

  // Button hover background
  const buttonHoverBg = "rgba(16, 185, 129, 0.15)"

  return (
    <Flex
      as="nav"
      bg={bgGradient}
      p={{ base: 3, md: 4 }}
      color="white"
      align="center"
      justify="space-between"
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.3)"
      position="sticky"
      top={0}
      zIndex={1000}
      h={{ base: "60px", md: "70px" }}
    >
      {/* Logo and Brand */}
      <Flex align="center">
        <Box
          bg="linear-gradient(135deg, #10B981, #0EA5E9)"
          w={{ base: "32px", md: "36px" }}
          h={{ base: "32px", md: "36px" }}
          borderRadius="lg"
          mr={3}
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 2px 10px rgba(16, 185, 129, 0.4)"
        >
          <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
            S
          </Text>
        </Box>

        <Text
          fontWeight="bold"
          fontSize={{ base: "lg", md: "xl" }}
          bgGradient="linear(to-r, #10B981, #0EA5E9)"
          bgClip="text"
          display={{ base: "none", sm: "block" }}
        >
          Spendee
        </Text>
      </Flex>

      {/* Navigation Links - Center */}
      {!isMobile && (
        <HStack spacing={1} position="absolute" left="50%" transform="translateX(-50%)">
          <Button
            leftIcon={<FaHome />}
            bg="transparent"
            color="white"
            variant="ghost"
            fontSize="md"
            fontWeight="medium"
            _hover={{
              bg: buttonHoverBg,
              color: accentColor,
            }}
            _active={{ bg: "#1A2234" }}
            transition="all 0.2s ease"
            onClick={() => navigate("/")}
            borderRadius="md"
            px={4}
          >
            Home
          </Button>

          <Button
            leftIcon={<FaCreditCard />}
            bg="transparent"
            color="white"
            variant="ghost"
            fontSize="md"
            fontWeight="medium"
            _hover={{
              bg: buttonHoverBg,
              color: accentColor,
            }}
            _active={{ bg: "#1A2234" }}
            transition="all 0.2s ease"
            onClick={() => navigate("/cards")}
            borderRadius="md"
            px={4}
          >
            Cards
          </Button>

          <Button
            leftIcon={<FaChartLine />}
            bg="transparent"
            color="white"
            variant="ghost"
            fontSize="md"
            fontWeight="medium"
            _hover={{
              bg: buttonHoverBg,
              color: accentColor,
            }}
            _active={{ bg: "#1A2234" }}
            transition="all 0.2s ease"
            onClick={() => navigate("/analytics")}
            borderRadius="md"
            px={4}
          >
            Analytics
          </Button>
        </HStack>
      )}

      {/* Right Section: Notifications and User Menu */}
      <HStack spacing={{ base: 2, md: 4 }}>
        {!isMobile && (
          <IconButton
            icon={<FaBell />}
            bg="transparent"
            color="white"
            variant="ghost"
            aria-label="Notifications"
            fontSize="md"
            _hover={{
              bg: buttonHoverBg,
              color: accentColor,
            }}
            _active={{ bg: "#1A2234" }}
            transition="all 0.2s ease"
            position="relative"
          >
            {/* Notification indicator */}
            <Box
              position="absolute"
              top="8px"
              right="8px"
              w="8px"
              h="8px"
              bg="#10B981"
              borderRadius="full"
              border="2px solid"
              borderColor="#1E293B"
            />
          </IconButton>
        )}

        {/* User Menu */}
        <Menu placement="bottom-end">
          <MenuButton
            as={Button}
            variant="ghost"
            p={{ base: 1, md: 2 }}
            _hover={{
              bg: buttonHoverBg,
            }}
            _active={{ bg: "#1A2234" }}
            borderRadius="full"
          >
            <HStack spacing={2}>
              <Avatar
                size={isMobile ? "xs" : "sm"}
                name={userName}
                bg="linear-gradient(135deg, #10B981, #0EA5E9)"
                color="white"
                fontWeight="bold"
                border="2px solid"
                borderColor="whiteAlpha.300"
              />
              {!isMobile && (
                <Text fontSize="sm" fontWeight="medium">
                  {userName}
                </Text>
              )}
            </HStack>
          </MenuButton>
          <MenuList bg="#1E293B" borderColor="gray.700" boxShadow="xl" p={2}>
            <MenuItem
              icon={<FaUser />}
              _hover={{ bg: buttonHoverBg, color: accentColor }}
              _active={{ bg: "#1A2234" }}
              onClick={() => navigate("/profile")}
              borderRadius="md"
              bg="#1E293B"
              color="white"
            >
              Profile
            </MenuItem>
            <MenuItem
              icon={<FaCreditCard />}
              _hover={{ bg: buttonHoverBg, color: accentColor }}
              _active={{ bg: "#1A2234" }}
              onClick={() => navigate("/cards")}
              borderRadius="md"
              bg="#1E293B"
              color="white"
            >
              My Cards
            </MenuItem>
            <Divider my={2} borderColor="gray.700" />
            <MenuItem
              icon={<FaSignOutAlt />}
              _hover={{ bg: "rgba(229, 62, 62, 0.15)", color: "#F56565" }}
              _active={{ bg: "#1A2234" }}
              onClick={onLogout}
              color="gray.300"
              borderRadius="md"
              bg="#1E293B"
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Flex>
  )
}

export default Navbar
