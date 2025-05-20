
// src/pages/AdminLoginPage.tsx
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Heading,
  useToast,
  Text,
  Spinner,
  Link,
  Flex,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import axios from "axios";
import { ViewIcon, ViewOffIcon, EmailIcon, LockIcon } from "@chakra-ui/icons";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface AdminLoginProps {}

const AdminLoginPage: React.FC<AdminLoginProps> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleAdminLogin = async () => {
    let hasError = false;

    if (!email) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (!password) {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (hasError) {
      toast({
        title: "Required Fields",
        description: "Please fill in all fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post<{ token: string; username: string }>(
        "/admin/login",
        {
          email,
          password,
        }
      );
      toast({
        title: "Login Successful",
        description: "You are now logged in.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      sessionStorage.setItem("auth-token", response.data.token);
      sessionStorage.setItem("username", response.data.username);
      navigate("https://spendee-track-spending-easily.onrender.com/admin/dashboard");
    } catch (error: any) {
      if (
        error.response?.status === 401 &&
        error.response?.data === "Invalid credentials"
      ) {
        setPasswordError(true); // Highlight password field
        toast({
          title: "Incorrect Credentials",
          description: "The password is incorrect. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (
        error.response?.status === 404 &&
        error.response?.data === "User not found"
      ) {
        setEmailError(true); // Highlight email field
        toast({
          title: "User Does Not Exist",
          description: "No account found with this email. Please register.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Login Error",
          description: error.response?.data?.message || "Something went wrong.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minH="100vh"
      bg="#1a202c"
      color="white"
    >
      <Navbar />

      <Flex
        flex="1"
        direction="column"
        align="center"
        justify="center"
        px={{ base: 4, md: 8 }}
        py={{ base: 6, md: 12 }}
      >
        <Box
          maxW="md"
          w="100%"
          p={{ base: 6, md: 8 }}
          bg="gray.800"
          boxShadow="0 4px 15px rgba(0, 0, 0, 0.2)"
          borderRadius="16px"
          border="1px solid"
          borderColor="gray.700"
        >
          <Heading
            mb={6}
            textAlign="center"
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="extrabold"
            color="white"
            letterSpacing="tight"
          >
            Admin Login
          </Heading>

          <InputGroup mb={emailError ? 2 : 4}>
            <InputLeftElement pointerEvents="none">
              <Icon as={EmailIcon} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="gray.900"
              border="1px solid"
              borderColor={emailError ? "red.500" : "gray.600"}
              borderRadius="12px"
              _focus={{ borderColor: "#667eea", bg: "gray.800" }}
              _hover={{ borderColor: emailError ? "red.500" : "gray.500" }}
              color="white"
              fontSize={{ base: "sm", md: "md" }}
              py={{ base: 5, md: 6 }}
            />
          </InputGroup>
          {emailError && (
            <Text color="red.400" fontSize="sm" mb={4}>
              {email
                ? "No account found with this email."
                : "Email is required."}
            </Text>
          )}

          <InputGroup mb={passwordError ? 2 : 6}>
            <InputLeftElement pointerEvents="none">
              <Icon as={LockIcon} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="gray.900"
              border="1px solid"
              borderColor={passwordError ? "red.500" : "gray.600"}
              borderRadius="12px"
              _focus={{ borderColor: "#667eea", bg: "gray.800" }}
              _hover={{ borderColor: passwordError ? "red.500" : "gray.500" }}
              color="white"
              fontSize={{ base: "sm", md: "md" }}
              py={{ base: 5, md: 6 }}
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                variant="ghost"
                color="gray.400"
                _hover={{ color: "gray.300", bg: "transparent" }}
                _active={{ color: "gray.500" }}
                fontSize={{ base: "md", md: "lg" }}
                onClick={toggleShowPassword}
              />
            </InputRightElement>
          </InputGroup>
          {passwordError && (
            <Text color="red.400" fontSize="sm" mb={6}>
              {password ? "Incorrect password." : "Password is required."}
            </Text>
          )}

          <Button
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            width="100%"
            size="md"
            borderRadius="full"
            boxShadow="0 2px 8px rgba(102, 126, 234, 0.3)"
            _hover={{
              bg: "linear-gradient(135deg, #5a6cd8 0%, #6a3e92 100%)",
              transform: "translateY(-1px)",
            }}
            _active={{
              bg: "linear-gradient(135deg, #4e5ec6 0%, #5e3482 100%)",
            }}
            transition="all 0.2s ease"
            onClick={handleAdminLogin}
            isLoading={loading}
            fontSize={{ base: "sm", md: "md" }}
          >
            {loading ? <Spinner size="sm" /> : "Login"}
          </Button>
        </Box>
      </Flex>

      <Footer />
    </Box>
  );
};

export default AdminLoginPage;
