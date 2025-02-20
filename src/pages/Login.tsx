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

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
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
      const response = await axios.post(
        "https://spendee-track-spending-easily.onrender.com/auth/login",
        {
          email,
          password,
        },
      );
      toast({
        title: "Login Successful",
        description: "You are now logged in.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      const userResponse = await axios.get(
        "https://spendee-track-spending-easily.onrender.com/user",
        {
          headers: {
            Authorization: `Bearer ${response.data.token}`,
          },
        },
      );

      sessionStorage.setItem("auth-token", response.data.token); // Store the JWT token
      sessionStorage.setItem("username", userResponse.data.username); // Store the username

      navigate("/dashboard"); // Redirect to the dashboard
    } catch (error: any) {
      toast({
        title: "Login Error",
        description: error.response?.data?.message || "Something went wrong.",
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
          <Heading
            mb={6}
            textAlign="center"
            fontSize={["2xl", "3xl"]}
            color="black"
          >
            Login
          </Heading>

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

          <Button
            bg="black"
            color="white"
            width={["60%", "50%"]}
            size="md"
            borderRadius="full"
            border="1px solid black"
            onClick={handleLogin}
            isLoading={loading}
            _hover={{ bg: "white", borderColor: "black", color: "black" }}
            _active={{ bg: "black" }}
            fontSize={["sm", "md"]}
          >
            {loading ? <Spinner size="sm" /> : "Login"}
          </Button>

          <Text
            mt={4}
            textAlign="center"
            color="gray.600"
            fontSize={["sm", "md"]}
          >
            Don't have an account?{" "}
            <Link
              as={RouterLink}
              to="/register"
              color="red"
              fontWeight="bold"
              fontSize={["sm", "md"]}
            >
              Click here to register
            </Link>
          </Text>
        </Box>
      </Flex>

      <Footer />
    </Box>
  );
};

export default LoginPage;
