import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Link,
  Icon,
  VStack,
  Spinner,
  Circle,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaPiggyBank,
  FaChartPie,
  FaArrowRight,
  FaWallet,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay (e.g., 2 seconds) when the page opens
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  // Simulated Logo Component (used only after loading)
  const Logo = () => (
    <MotionBox
      position="relative"
      w={{ base: "120px", sm: "150px" }}
      h={{ base: "120px", sm: "150px" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Circle
        size="100%"
        bg="gray.800"
        border="4px solid"
        borderColor="#34d399"
        boxShadow="0 0 20px rgba(52, 211, 153, 0.5)"
      >
        <Icon as={FaWallet} w={12} h={12} color="#34d399" />
      </Circle>
    </MotionBox>
  );

  return (
    <Box minH="100vh">
      {/* Mobile Layout */}
      <Box
        display={{ base: "block", md: "none" }} // Visible only on mobile
        minH="100vh"
        bg="linear-gradient(135deg, #1a202c 0%, #0C0F15 100%)"
        color="white"
      >
        {isLoading ? (
          <Flex
            minH="100vh"
            align="center"
            justify="center"
            bg="gray.900"
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            zIndex={9999}
          >
            <MotionBox
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.600"
                color="#34d399"
                size={{ base: "xl", sm: "xl" }} // Larger spinner for standalone effect
              />
            </MotionBox>
          </Flex>
        ) : (
          <VStack
            minH="100vh"
            spacing={8}
            justify="center"
            px={6}
            py={10}
            textAlign="center"
            position="relative"
            overflow="hidden"
          >
            {/* Decorative Background Element */}
            <MotionBox
              position="absolute"
              top="-20%"
              left="-20%"
              w="150%"
              h="150%"
              bg="radial-gradient(circle, rgba(52, 211, 153, 0.2) 0%, rgba(26, 32, 44, 0) 70%)"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
            />
            <Logo /> {/* Logo above text */}
            <Heading
              as="h1"
              size={{ base: "xl", sm: "2xl" }}
              fontWeight="extrabold"
              bgGradient="linear(to-r, #34d399, #667eea)"
              bgClip="text"
              zIndex={1}
            >
              Master Your Money
            </Heading>
            <Text
              fontSize={{ base: "md", sm: "lg" }}
              color="gray.300"
              maxW="400px"
              lineHeight="tall"
              zIndex={1}
            >
              Take charge of your finances with a simple, powerful app designed
              to help you save, track, and succeed.
            </Text>
            <Link
              as={RouterLink}
              to="/login"
              _hover={{ textDecoration: "none" }}
            >
              <MotionButton
                size="lg"
                bg="linear-gradient(135deg, #34d399 0%, #059669 100%)"
                color="white"
                borderRadius="full"
                boxShadow="0 4px 15px rgba(52, 211, 153, 0.4)"
                _hover={{
                  bg: "linear-gradient(135deg, #2cc084 0%, #048554 100%)",
                  transform: "translateY(-2px)",
                }}
                _active={{ bg: "#048554" }}
                fontSize={{ base: "md", sm: "lg" }}
                px={{ base: 8, sm: 10 }}
                rightIcon={<Icon as={FaArrowRight} />}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                zIndex={1}
              >
                Get Started
              </MotionButton>
            </Link>
          </VStack>
        )}
      </Box>

      {/* Desktop Layout */}
      <Box
        display={{ base: "none", md: "block" }}
        bg="white" // Original white background
        color="black"
      >
        <Navbar />
        {/* Hero Section */}
        <MotionBox
          bg="#0C0F15"
          color="white"
          py={{ md: 32, lg: 40 }}
          textAlign="center"
          bgImage="url('https://via.placeholder.com/1200x600')" // Replace with real image
          bgSize="cover"
          bgPosition="center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <VStack spacing={8} maxW="900px" mx="auto" px={4}>
            <Heading
              as="h1"
              size={{ md: "2xl", lg: "3xl" }}
              fontWeight="bold"
              letterSpacing="tight"
            >
              Take Control of Your Finances
            </Heading>
            <Text
              fontSize={{ md: "lg", lg: "xl" }}
              color="gray.200"
              maxW="700px"
            >
              Track, plan, and optimize your finances with ease using our
              intuitive tools.
            </Text>
            <Flex gap={6}>
              <Link
                as={RouterLink}
                to="/register"
                _hover={{ textDecoration: "none" }}
              >
                <MotionButton
                  size="lg"
                  bg="black"
                  color="white"
                  borderRadius="full"
                  boxShadow="lg"
                  _hover={{
                    bg: "white",
                    color: "black",
                    border: "2px solid black",
                  }}
                  fontSize="lg"
                  px={8}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  Get Started
                </MotionButton>
              </Link>
              <Link
                as={RouterLink}
                to="/login"
                _hover={{ textDecoration: "none" }}
              >
                <MotionButton
                  size="lg"
                  bg="white"
                  color="black"
                  border="2px solid black"
                  borderRadius="full"
                  boxShadow="lg"
                  _hover={{ bg: "black", color: "white" }}
                  fontSize="lg"
                  px={8}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  Login
                </MotionButton>
              </Link>
            </Flex>
          </VStack>
        </MotionBox>

        {/* Features Section */}
        <Box maxW="1200px" mx="auto" py={20} px={{ md: 6, lg: 8 }}>
          <Heading
            as="h2"
            size="xl"
            textAlign="center"
            mb={12}
            fontWeight="bold"
          >
            Features
          </Heading>
          <Flex direction="row" gap={8} justify="center" wrap="wrap">
            {[
              {
                icon: FaChartLine,
                title: "Track Expenses",
                description:
                  "Log and categorize your daily expenses effortlessly.",
              },
              {
                icon: FaPiggyBank,
                title: "Plan Budgets",
                description: "Set budgets and monitor your progress over time.",
              },
              {
                icon: FaChartPie,
                title: "Visualize Data",
                description: "Gain insights with stunning charts and graphs.",
              },
            ].map((feature, index) => (
              <MotionBox
                key={index}
                flex={{ md: "1 1 300px", lg: "1 1 360px" }}
                textAlign="center"
                p={6}
                bg="gray.50"
                borderRadius="lg"
                boxShadow="md"
                _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
              >
                <Icon as={feature.icon} w={12} h={12} mb={4} color="black" />
                <Heading as="h3" size="lg" mb={4}>
                  {feature.title}
                </Heading>
                <Text fontSize="md" color="gray.600">
                  {feature.description}
                </Text>
              </MotionBox>
            ))}
          </Flex>
        </Box>

        {/* About Us Section */}
        <Box bg="white" py={20}>
          <Box maxW="1200px" mx="auto" px={{ md: 6, lg: 8 }}>
            <Heading
              as="h2"
              size="xl"
              textAlign="center"
              mb={10}
              fontWeight="bold"
            >
              About Us
            </Heading>
            <Text
              textAlign="center"
              fontSize={{ md: "md", lg: "lg" }}
              maxW="800px"
              mx="auto"
              color="gray.600"
            >
              We’re a team of financial experts dedicated to simplifying money
              management. Our platform empowers you to track, plan, and optimize
              your finances effortlessly.
            </Text>
          </Box>
        </Box>

        {
          <Box maxW="1200px" mx="auto" py={20} px={{ md: 6, lg: 8 }}>
            <Heading
              as="h2"
              size="xl"
              textAlign="center"
              mb={12}
              fontWeight="bold"
            >
              What Our Users Say
            </Heading>
            <Flex direction="row" gap={8} justify="center" wrap="wrap">
              {[
                {
                  name: "John Doe",
                  testimonial:
                    "This platform transformed how I manage my finances. Highly recommended!",
                },
                {
                  name: "Jane Smith",
                  testimonial:
                    "User-friendly and incredibly helpful. The budgeting tools are a game-changer!",
                },
                {
                  name: "Mike Johnson",
                  testimonial:
                    "The visualizations are top-notch. I see my progress instantly.",
                },
              ].map((testimonial, index) => (
                <MotionBox
                  key={index}
                  flex={{ md: "1 1 300px", lg: "1 1 360px" }}
                  textAlign="center"
                  p={6}
                  bg="gray.50"
                  borderRadius="lg"
                  boxShadow="md"
                  _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.3 }}
                >
                  <Text fontSize="md" color="gray.600" mb={4}>
                    "{testimonial.testimonial}"
                  </Text>
                  <Text fontWeight="bold" fontSize="lg">
                    - {testimonial.name}
                  </Text>
                </MotionBox>
              ))}
            </Flex>
          </Box>
        }

        {/* Call-to-Action Section */}
        <Box bg="white" py={20}>
          <Box maxW="1200px" mx="auto" px={{ md: 6, lg: 8 }} textAlign="center">
            <Heading as="h2" size="xl" mb={6} fontWeight="bold">
              Ready to Take Control?
            </Heading>
            <Text
              mb={8}
              fontSize={{ md: "md", lg: "lg" }}
              color="gray.600"
              maxW="600px"
              mx="auto"
            >
              Join thousands of users mastering their finances with our powerful
              tools.
            </Text>
            <Link
              as={RouterLink}
              to="/register"
              _hover={{ textDecoration: "none" }}
            >
              <MotionButton
                size="lg"
                bg="black"
                color="white"
                borderRadius="full"
                boxShadow="lg"
                _hover={{
                  bg: "white",
                  color: "black", // Fixed: Changed = to :
                  border: "2px solid black",
                }}
                fontSize="lg"
                px={8}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                Get Started
              </MotionButton>
            </Link>
          </Box>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default LandingPage;
