import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Heading,
  IconButton,
  useToast,
  Text,
  Spinner,
  Link,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, EmailIcon, LockIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async () => {
    let hasError = false;

    if (!name.trim()) {
      toast({
        title: "Required Field",
        description: "Please enter your name.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      hasError = true;
    }

    if (!validateEmail(email)) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }

    if (!validatePassword(password)) {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "https://spendee-track-spending-easily.onrender.com/auth/register ",
        {
          name,
          email,
          password,
        },
      );

      toast({
        title: "Registration Successful",
        description: "You can now log in with your credentials.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate("/login");
    } catch (error: any) {
      if (
        error.response?.status === 400 &&
        error.response?.data === "Email already exists"
      ) {
        setEmailError(true);
        toast({
          title: "Email Already Exists",
          description:
            "This email is already registered. Please use a different email or log in.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Registration Error",
          description: error.response?.data || "Unknown error.",
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
            Register
          </Heading>

          <InputGroup mb={4}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaUser} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              bg="gray.900"
              border="1px solid"
              borderColor="gray.600"
              borderRadius="12px"
              _focus={{ borderColor: "#667eea", bg: "gray.800" }}
              _hover={{ borderColor: "gray.500" }}
              color="white"
              fontSize={{ base: "sm", md: "md" }}
              py={{ base: 5, md: 6 }}
            />
          </InputGroup>

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
              {validateEmail(email)
                ? "Email already exists."
                : "Invalid email format."}
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
              Password must be at least 8 characters with 1 uppercase, 1
              lowercase, 1 number, and 1 special character.
            </Text>
          )}

          <Button
            bg="linear-gradient(135deg, #34d399 0%, #059669 100%)"
            color="white"
            width="100%"
            size="md"
            borderRadius="full"
            boxShadow="0 2px 8px rgba(52, 211, 153, 0.3)"
            _hover={{
              bg: "linear-gradient(135deg, #2cc084 0%, #048554 100%)",
              transform: "translateY(-1px)",
            }}
            _active={{
              bg: "linear-gradient(135deg, #25a971 0%, #037a47 100%)",
            }}
            transition="all 0.2s ease"
            onClick={handleRegister}
            isLoading={loading}
            fontSize={{ base: "sm", md: "md" }}
          >
            {loading ? <Spinner size="sm" /> : "Register"}
          </Button>

          <Text
            mt={4}
            textAlign="center"
            color="gray.400"
            fontSize={{ base: "sm", md: "md" }}
          >
            Already have an account?{" "}
            <Link
              as={RouterLink}
              to="/login"
              color="#667eea"
              fontWeight="bold"
              _hover={{ color: "#5a6cd8", textDecoration: "underline" }}
            >
              Log In
            </Link>
          </Text>
        </Box>
      </Flex>

      <Footer />
    </Box>
  );
};

export default RegisterPage;
