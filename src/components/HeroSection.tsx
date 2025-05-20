

import React, { useState, useEffect, TouchEvent } from "react";
import {
  Box,
  Text,
  Flex,
  Icon,
  IconButton,
  Container,
  Heading,
  VStack,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash, FaWifi } from "react-icons/fa";
import { RiVisaLine } from "react-icons/ri";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

interface HeroSectionProps {
  balance: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ balance }) => {
  const [showBalance, setShowBalance] = useState(false);
  const [cardholderName, setCardholderName] = useState("João C. Santos");
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("cardholderName");
    if (savedName) setCardholderName(savedName);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCardholderName(val);
    localStorage.setItem("cardholderName", val);
  };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    const threshold = 50;
    if (diffX > threshold) setIsFlipped(false);
    else if (diffX < -threshold) setIsFlipped(true);
    setTouchStartX(null);
  };

  const cardFontSize = useBreakpointValue({
    base: {
      number: "sm",
      label: "xs",
      balance: "lg",
      input: "sm",
    },
    sm: {
      number: "md",
      label: "sm",
      balance: "xl",
      input: "md",
    },
    md: {
      number: "lg",
      label: "sm",
      balance: "2xl",
      input: "md",
    },
  });

  return (
    <Box
      bg="linear-gradient(135deg, #1a1a1d 0%, #0C0F15 100%)"
      color="white"
      py={{ base: 8, md: 16 }}
      position="relative"
      overflow="hidden"
      minH={{ base: "50vh", md: "auto" }}
      display="flex"
      alignItems="center"
    >
      <Container maxW="container.xl">
        <MotionFlex
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="space-between"
          gap={10}
        >
          <MotionBox
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            flex="1"
            textAlign={{ base: "center", lg: "left" }}
          >
            <VStack align="start" spacing={6} maxW="600px">
              <Heading
                fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
                fontWeight="bold"
                bgGradient="linear(to-r, #00ff5f, #B3EA1B)"
                bgClip="text"
              >
                Smart Money Management
              </Heading>
              <Text fontSize={{ base: "md", md: "xl" }} color="whiteAlpha.800">
                Controle seu dinheiro com um cartão moderno e inteligente.
              </Text>
            </VStack>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            w={{ base: "90vw", sm: "480px", md: "560px" }}
            maxW="600px"
            flexShrink={0}
            sx={{ perspective: "1200px" }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <MotionBox
              position="relative"
              h={{ base: "240px", sm: "280px", md: "320px" }}
              borderRadius="2xl"
              boxShadow="0 0 40px rgba(0,0,0,0.95)"
              style={{
                transformStyle: "preserve-3d",
                transition: "transform 0.7s",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              <Box
                position="absolute"
                w="100%"
                h="100%"
                borderRadius="2xl"
                color="white"
                sx={{
                  backfaceVisibility: "hidden",
                  p: { base: 5, sm: 8 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundImage: `
                    radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                    repeating-linear-gradient(45deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 2px, transparent 2px, transparent 6px),
                    repeating-linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 1px, transparent 1px, transparent 4px)
                  `,
                  backgroundSize: `20px 20px, 8px 8px, 6px 6px`,
                  backgroundPosition: `0 0, 0 0, 4px 4px`,
                  backgroundColor: "black",
                }}
              >
                <Flex justify="space-between" mb={{ base: 4, sm: 6 }} flexShrink={0}>
                  <Icon
                    as={RiVisaLine}
                    w={{ base: 8, sm: 12 }}
                    h={{ base: 6, sm: 8 }}
                    color="white"
                  />
                  <Icon
                    as={FaWifi}
                    w={{ base: 5, sm: 6 }}
                    h={{ base: 5, sm: 6 }}
                    transform="rotate(90deg)"
                    color="whiteAlpha.700"
                  />
                </Flex>

                <Flex
                  justify="space-between"
                  align="center"
                  mb={{ base: 4, sm: 6 }}
                  flexShrink={0}
                >
                  <Box
                    w={{ base: "40px", sm: "55px" }}
                    h={{ base: "30px", sm: "40px" }}
                    bg="linear-gradient(135deg, #f9e265, #a0843c)"
                    borderRadius="xs"
                    position="relative"
                    boxShadow="
                      0 0 15px 5px #fff9b0 inset,
                      0 0 12px 4px #f9e265 inset,
                      0 2px 6px rgba(0,0,0,0.5)
                    "
                  >
                    <Box
                      position="absolute"
                      top="45%"
                      left="10%"
                      right="10%"
                      height="2px"
                      bg="rgba(0,0,0,0.5)"
                    />
                    <Box
                      position="absolute"
                      top="30%"
                      left="15%"
                      width="5px"
                      height="8px"
                      bg="rgba(255,255,255,0.6)"
                      borderRadius="1px"
                      boxShadow="0 0 5px 1px rgba(255,255,255,0.9)"
                    />
                    <Box
                      position="absolute"
                      top="55%"
                      left="20%"
                      width="7px"
                      height="4px"
                      bg="rgba(255,255,255,0.8)"
                      borderRadius="1px"
                      boxShadow="0 0 3px 1px rgba(255,255,255,0.8)"
                    />
                  </Box>

                  <Text
                    fontSize={cardFontSize?.number}
                    fontFamily="'Courier New', monospace"
                    color="white"
                    letterSpacing="2px"
                    flexShrink={0}
                  >
                    4929 7534 2315 5466
                  </Text>
                </Flex>

                <Flex justify="space-between" align="center" mt={4} flexShrink={0}>
                  <Box maxW="60%">
                    <Text
                      fontSize={cardFontSize?.label}
                      color="gray.400"
                      mb={1}
                      userSelect="none"
                    >
                      CARDHOLDER
                    </Text>
                    <Input
                      value={cardholderName}
                      onChange={handleNameChange}
                      variant="unstyled"
                      fontSize={cardFontSize?.input}
                      color="white"
                      fontWeight="medium"
                      maxLength={30}
                      _focus={{ outline: "none", borderBottom: "1px solid #B3EA1B" }}
                      sx={{
                        caretColor: "#B3EA1B",
                        userSelect: "text",
                        px: 0,
                      }}
                    />
                  </Box>

                  <Box flexShrink={0}>
                    <Text
                      fontSize={cardFontSize?.label}
                      color="gray.400"
                      mb={1}
                      userSelect="none"
                    >
                      EXP
                    </Text>
                    <Text
                      fontSize={cardFontSize?.input}
                      color="white"
                      fontWeight="medium"
                      userSelect="none"
                    >
                      04/28
                    </Text>
                  </Box>
                </Flex>

                <Flex justify="space-between" align="center" mt={6} flexShrink={0}>
                  <Box>
                    <Text fontSize={cardFontSize?.label} color="gray.400" userSelect="none">
                      Balance
                    </Text>
                    <Text
                      fontSize={cardFontSize?.balance}
                      fontWeight="bold"
                      color="white"
                      fontFamily="monospace"
                      style={{
                        filter: showBalance ? "none" : "blur(3px)",
                        userSelect: "none",
                      }}
                    >
                      {showBalance ? `$${balance.toFixed(2)}` : "••••••"}
                    </Text>
                  </Box>

                  <IconButton
                    icon={showBalance ? <FaEyeSlash /> : <FaEye />}
                    aria-label="Toggle balance"
                    colorScheme="whiteAlpha"
                    variant="ghost"
                    onClick={() => setShowBalance(!showBalance)}
                    flexShrink={0}
                    size={useBreakpointValue({ base: "sm", sm: "md" })}
                  />
                </Flex>

                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  w="100%"
                  h="100%"
                  borderRadius="2xl"
                  background="linear-gradient(115deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.03) 60%)"
                  backgroundSize="200% 100%"
                  animation="shine 5s infinite linear"
                  sx={{
                    "@keyframes shine": {
                      "0%": { backgroundPosition: "200% 0" },
                      "100%": { backgroundPosition: "-200% 0" },
                    },
                    pointerEvents: "none",
                  }}
                />
              </Box>

              <Box
                bg="linear-gradient(135deg, #111111 0%, #000000 100%)"
                position="absolute"
                w="100%"
                h="100%"
                borderRadius="2xl"
                color="white"
                sx={{ backfaceVisibility: "hidden" }}
                transform="rotateY(180deg)"
                p={{ base: 5, sm: 8 }}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                userSelect="none"
              >
                <Box
                  bg="rgba(0,0,0,0.9)"
                  h={{ base: "30px", sm: "40px" }}
                  borderRadius="sm"
                  mb={{ base: 4, sm: 6 }}
                  boxShadow="inset 0 0 8px rgba(255,255,255,0.15)"
                />

                <Box flex="1" position="relative" mb={{ base: 4, sm: 6 }}>
                  <Box
                    position="absolute"
                    top="20%"
                    left="0"
                    right="0"
                    height="1px"
                    bg="rgba(255,255,255,0.1)"
                    boxShadow="0 0 4px rgba(255,255,255,0.05)"
                  />
                  <Box
                    position="absolute"
                    top="40%"
                    left="0"
                    right="0"
                    height="1px"
                    bg="rgba(255,255,255,0.1)"
                    boxShadow="0 0 4px rgba(255,255,255,0.05)"
                  />
                  <Box
                    position="absolute"
                    top="60%"
                    left="0"
                    right="0"
                    height="1px"
                    bg="rgba(255,255,255,0.1)"
                    boxShadow="0 0 4px rgba(255,255,255,0.05)"
                  />
                  <Box
                    position="absolute"
                    top="80%"
                    left="0"
                    right="0"
                    height="1px"
                    bg="rgba(255,255,255,0.1)"
                    boxShadow="0 0 4px rgba(255,255,255,0.05)"
                  />
                </Box>

                <Text fontSize="xs" color="gray.500" textAlign="center" userSelect="none">
                  Authorized Signature — Not valid unless signed
                </Text>
              </Box>
            </MotionBox>
          </MotionBox>
        </MotionFlex>
      </Container>
    </Box>
  );
};

export default HeroSection;
