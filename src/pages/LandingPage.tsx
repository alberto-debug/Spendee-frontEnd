// src/pages/LandingPage.tsx
import { Box, Heading, Text, Button, Flex, Link, Icon } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChartLine, FaPiggyBank, FaChartPie } from "react-icons/fa"; // Ícones para as features
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <Box bg="white" color="black" minH="100vh">
      <Navbar />
      {/* Hero Section */}
      <Box
        bg="#0C0F15"
        color="white"
        py={40}
        textAlign="center"
        bgImage="url('https://via.placeholder.com/1200x600')" // Substitua por uma imagem real
        bgSize="cover"
        bgPosition="center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Heading
            as="h1"
            size="2xl"
            mb={4}
            fontSize={{ base: "md", md: "2xl", lg: "5xl" }}
          >
            Take Control of Your Finances
          </Heading>
          <Text mb={8} fontSize={{ base: "sm", md: "md", lg: "2xl" }}>
            Track, plan, and optimize your finances with ease.
          </Text>
          <Flex justifyContent="center" gap={4}>
            <Link
              as={RouterLink}
              to="/register"
              _hover={{ textDecoration: "none" }}
            >
              <Button
                size="lg"
                bg="black"
                color="white"
                borderRadius="full"
                _hover={{
                  bg: "white",
                  color: "black",
                  border: "2px solid black",
                }}
                fontSize={{ base: "md", md: "lg" }}
                boxShadow="lg"
              >
                Get Started
              </Button>
            </Link>
            <Link
              as={RouterLink}
              to="/login"
              _hover={{ textDecoration: "none" }}
            >
              <Button
                size="lg"
                variant="outline"
                border="2px solid black"
                bg="white"
                borderRadius="full"
                _hover={{ bg: "black", color: "white" }}
                fontSize={{ base: "md", md: "lg" }}
                boxShadow="lg"
              >
                Login
              </Button>
            </Link>
          </Flex>
        </motion.div>
      </Box>

      {/* Features Section */}
      <Box maxW="1200px" mx="auto" py={20} px={4}>
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={10}
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
        >
          Features
        </Heading>
        <Flex direction={{ base: "column", md: "row" }} gap={8}>
          {[
            {
              icon: FaChartLine,
              title: "Track Expenses",
              description: "Easily log and categorize your daily expenses.",
            },
            {
              icon: FaPiggyBank,
              title: "Plan Budgets",
              description: "Set budgets and track your progress over time.",
            },
            {
              icon: FaChartPie,
              title: "Visualize Data",
              description: "Get insights with beautiful charts and graphs.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.3 }}
            >
              <Box
                flex={1}
                textAlign="center"
                p={6}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                _hover={{ boxShadow: "xl", transform: "translateY(-5px)" }}
                transition="all 0.3s ease"
              >
                <Icon as={feature.icon} w={12} h={12} mb={4} color="black" />
                <Heading
                  as="h3"
                  size="lg"
                  mb={4}
                  fontSize={{ base: "xl", md: "2xl" }}
                >
                  {feature.title}
                </Heading>
                <Text fontSize={{ base: "md", md: "lg" }}>
                  {feature.description}
                </Text>
              </Box>
            </motion.div>
          ))}
        </Flex>
      </Box>

      {/* About Us Section */}
      <Box bg="white" color="black" py={20}>
        <Box maxW="1200px" mx="auto" px={4}>
          <Heading
            as="h2"
            size="xl"
            textAlign="center"
            mb={10}
            fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          >
            About Us
          </Heading>
          <Text
            textAlign="center"
            fontSize={{ base: "md", md: "lg" }}
            maxW="800px"
            mx="auto"
          >
            We are a team of financial experts dedicated to helping you take
            control of your finances. Our platform is designed to make tracking,
            planning, and optimizing your finances as easy as possible.
          </Text>
        </Box>
      </Box>

      {/* Testimonials Section */}
      <Box maxW="1200px" mx="auto" py={20} px={4}>
        <Heading
          as="h2"
          size="xl"
          textAlign="center"
          mb={10}
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
        >
          What Our Users Say
        </Heading>
        <Flex direction={{ base: "column", md: "row" }} gap={8}>
          {[
            {
              name: "John Doe",
              testimonial:
                "This platform has completely changed the way I manage my finances. Highly recommended!",
            },
            {
              name: "Jane Smith",
              testimonial:
                "Easy to use and incredibly helpful. I love the budgeting features!",
            },
            {
              name: "Mike Johnson",
              testimonial:
                "The data visualization tools are amazing. I can see my progress at a glance.",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: index * 0.3 }}
            >
              <Box
                flex={1}
                textAlign="center"
                p={6}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                _hover={{ boxShadow: "xl", transform: "translateY(-5px)" }}
                transition="all 0.3s ease"
              >
                <Text fontSize={{ base: "md", md: "lg" }} mb={4}>
                  "{testimonial.testimonial}"
                </Text>
                <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }}>
                  - {testimonial.name}
                </Text>
              </Box>
            </motion.div>
          ))}
        </Flex>
      </Box>

      {/* Call-to-Action Section */}
      <Box bg="white" color="black" py={20}>
        <Box maxW="1200px" mx="auto" px={4} textAlign="center">
          <Heading
            as="h2"
            size="xl"
            mb={6}
            fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          >
            Ready to Take Control of Your Finances?
          </Heading>
          <Text mb={8} fontSize={{ base: "md", md: "lg" }}>
            Join thousands of users who are already managing their finances with
            ease.
          </Text>
          <Link
            as={RouterLink}
            to="/register"
            _hover={{ textDecoration: "none" }}
          >
            <Button
              size="lg"
              bg="black"
              color="white"
              borderRadius="full"
              _hover={{
                bg: "white",
                color: "black",
                border: "2px solid black",
              }}
              fontSize={{ base: "md", md: "lg" }}
              boxShadow="lg"
            >
              {" "}
              Get Started
            </Button>
          </Link>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default LandingPage;
