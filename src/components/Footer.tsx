import {
  Box,
  Container,
  Text,
  Link,
  Flex,
  VStack,
  Heading,
  Icon,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaCreditCard,
  FaShieldAlt,
  FaHeadset,
  FaBook,
} from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Footer = () => {
  const hoverColor = useColorModeValue("cyan.400", "cyan.300");

  const features = [
    { icon: FaCreditCard, label: "Secure Payments" },
    { icon: FaShieldAlt, label: "Data Protection" },
    { icon: FaHeadset, label: "24/7 Support" },
    { icon: FaBook, label: "Detailed Documentation" },
  ];

  const socialLinks = [
    {
      icon: FaTwitter,
      label: "Twitter",
      href: "https://github.com/alberto-debug",
    },
    {
      icon: FaGithub,
      label: "GitHub",
      href: "https://github.com/alberto-debug",
    },
    {
      icon: FaLinkedin,
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/alberto-juniorr/",
    },
    {
      icon: FaInstagram,
      label: "Instagram",
      href: "https://www.linkedin.com/in/alberto-juniorr/",
    },
  ];

  return (
    <Box bg="gray.900" color="white" position="relative">
      <Container maxW="7xl" py={10}>
        {/* Features Section */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          gap={8}
          mb={10}
          display={{ base: "none", md: "flex" }} // Hide on small screens, show on larger screens
        >
          {features.map((feature, index) => (
            <MotionBox
              key={index}
              whileHover={{ y: -5 }}
              flex="1"
              textAlign="center"
              p={4}
              borderRadius="lg"
              bg="whiteAlpha.100"
            >
              <Icon as={feature.icon} w={6} h={6} mb={3} color="cyan.400" />
              <Text fontWeight="medium">{feature.label}</Text>
            </MotionBox>
          ))}
        </Flex>

        {/* Bottom Section */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align="center"
          pt={6}
          borderTop="1px solid"
          borderColor="whiteAlpha.200"
          gap={4}
        >
          <VStack align={{ base: "center", md: "flex-start" }} spacing={2}>
            <Heading
              size="md"
              bgGradient="linear(to-r, cyan.400, blue.500)"
              bgClip="text"
              mb={2}
            >
              Spendee
            </Heading>
            <Text
              fontSize="sm"
              color="gray.400"
              textAlign={{ base: "center", md: "left" }}
            >
              © {new Date().getFullYear()} Spendee. All rights reserved.
            </Text>
          </VStack>

          {/* Social Links */}
          <Flex gap={3} wrap="wrap" justify="center">
            {socialLinks.map((social, index) => (
              <IconButton
                key={index}
                as={Link}
                href={social.href}
                aria-label={social.label}
                icon={<Icon as={social.icon} />}
                size="sm"
                variant="ghost"
                color="gray.400"
                _hover={{
                  color: hoverColor,
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              />
            ))}
          </Flex>

          {/* Essential Links */}
          <Flex
            gap={6}
            wrap="wrap"
            justify={{ base: "center", md: "flex-end" }}
          >
            <Link
              href="#"
              fontSize="sm"
              color="gray.400"
              _hover={{ color: hoverColor }}
              transition="color 0.2s"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              fontSize="sm"
              color="gray.400"
              _hover={{ color: hoverColor }}
              transition="color 0.2s"
            >
              Terms of Service
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
