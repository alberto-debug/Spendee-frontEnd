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
        "https://spendee-track-spending-easily.onrender.com/auth/register",
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
      toast({
        title: "Registration Error",
        description: error.response?.data || "Unknown error.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <Navbar />

      <Flex
        flex="1"
        direction="column"
        align="center"
        justify="center"
        px={4}
        py={8}
      >
        <Box
          maxW="md"
          w="100%"
          p={8}
          bg="white"
          boxShadow="lg"
          borderRadius="20px"
          border="1px solid"
          borderColor="gray.200"
        >
          <Heading mb={6} textAlign="center" fontSize="2xl" color="black">
            Register
          </Heading>

          <InputGroup mb={4}>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaUser} color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              border="1px solid"
              borderColor="gray.300"
              borderRadius="15px"
              _focus={{ borderColor: "blue.500" }}
              _hover={{ borderColor: "gray.500" }}
              fontSize={["sm", "md"]}
            />
          </InputGroup>

          <InputGroup mb={4}>
            <InputLeftElement pointerEvents="none">
              <Icon as={EmailIcon} color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              border="1px solid"
              borderColor={emailError ? "red.500" : "gray.300"}
              borderRadius="15px"
              _focus={{ borderColor: "blue.500" }}
              _hover={{ borderColor: emailError ? "red.500" : "gray.500" }}
              fontSize={["sm", "md"]}
            />
          </InputGroup>
          {emailError && (
            <Text color="red.500" fontSize="sm">
              Invalid email format.
            </Text>
          )}

          <InputGroup mb={6}>
            <InputLeftElement pointerEvents="none">
              <Icon as={LockIcon} color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              border="1px solid"
              borderColor={passwordError ? "red.500" : "gray.300"}
              borderRadius="15px"
              _focus={{ borderColor: "blue.500" }}
              _hover={{ borderColor: passwordError ? "red.500" : "gray.500" }}
              fontSize={["sm", "md"]}
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={toggleShowPassword}
                variant="ghost"
                color="gray.500"
                _hover={{ bg: "transparent" }}
                fontSize={["sm", "md"]}
              />
            </InputRightElement>
          </InputGroup>
          {passwordError && (
            <Text color="red.500" fontSize="sm">
              Password must be at least 8 characters long and include at least
              one uppercase letter, one lowercase letter, one number, and one
              special character.
            </Text>
          )}

          <Button
            bg="black"
            color="white"
            width={["50%", "50%"]}
            size="md"
            borderRadius="full"
            onClick={handleRegister}
            isLoading={loading}
            _hover={{ bg: "gray.800", borderColor: "gray.600" }}
            _active={{ bg: "gray.900" }}
            fontSize={["sm", "md"]}
          >
            {loading ? <Spinner size="sm" /> : "Register"}
          </Button>

          <Text
            mt={4}
            textAlign="center"
            color="gray.600"
            fontSize={["sm", "md"]}
          >
            Already have an account?{" "}
            <Link
              as={RouterLink}
              to="/login"
              color="blue.500"
              fontWeight="bold"
              fontSize={["sm", "md"]}
            >
              Click here to log in
            </Link>
          </Text>
        </Box>
      </Flex>

      <Footer />
    </Box>
  );
};

export default RegisterPage;
