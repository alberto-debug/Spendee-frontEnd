// pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  useToast,
  Flex,
  Circle,
  IconButton,
  Text as ChakraText,
  Spinner,
  Icon,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Container,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaUpload, FaDownload  ,FaCalendarAlt} from "react-icons/fa";
import axios from "axios";
import { format, parse } from "date-fns";
import { motion } from "framer-motion";
import Navbar from "../components/navbar2";
import DownloadPdfButton from "../components/DownloadPdfButton";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection"; // Import the HeroSection component
import { DeleteIcon } from "@chakra-ui/icons";
import TaskManagerWithButton from "../pages/TaskManager";

interface Transaction {
  id: number;
  amount: string;
  type: string;
  date: string;
  description: string;
}

const DashboardPage = () => {
  const toast = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    type: "INCOME",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  const handleLogout = () => {
    sessionStorage.removeItem("auth-token");
    sessionStorage.removeItem("username");
    window.location.href = "/login";
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get<Transaction[]>(
        "https://spendee-track-spending-easily.onrender.com/finance/transactions",
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth-token")}`,
          },
        },
      );
      const sortedTransactions = response.data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      setTransactions(sortedTransactions);
      calculateBalance(sortedTransactions);
    } catch (error) {
      toast({
        title: "Error loading transactions",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const calculateBalance = (transactions: Transaction[]) => {
    const totalIncome = transactions.reduce(
      (sum, transaction) =>
        transaction.type === "INCOME"
          ? sum + parseFloat(transaction.amount)
          : sum,
      0,
    );
    const totalExpense = transactions.reduce(
      (sum, transaction) =>
        transaction.type === "EXPENSE"
          ? sum + parseFloat(transaction.amount)
          : sum,
      0,
    );
    setBalance(totalIncome - totalExpense);
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.description) {
      toast({
        title: "Required fields",
        description: "Please fill in all fields.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://spendee-track-spending-easily.onrender.com/finance/transaction",
        newTransaction,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth-token")}`,
          },
        },
      );
      const newTransactionData = response.data;
      setTransactions([newTransactionData, ...transactions]);
      calculateBalance([newTransactionData, ...transactions]);
      setNewTransaction({
        amount: "",
        type: "INCOME",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setIsIncomeOpen(false);
      setIsExpenseOpen(false);
      toast({
        title: "Transaction added!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error adding transaction",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async () => {
    if (deleteId === null) return;

    setIsLoading(true);
    try {
      await axios.delete(
        `https://spendee-track-spending-easily.onrender.com/finance/transaction/${deleteId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth-token")}`,
          },
        },
      );
      const updatedTransactions = transactions.filter(
        (transaction) => transaction.id !== deleteId,
      );
      setTransactions(updatedTransactions);
      calculateBalance(updatedTransactions);
      toast({
        title: "Transaction removed!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setDeleteId(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast({
        title: "Error removing transaction",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const dateMatches =
      !filterDate ||
      new Date(transaction.date).toDateString() ===
      new Date(filterDate).toDateString();
    const typeMatches = !filterType || transaction.type === filterType;
    return dateMatches && typeMatches;
  });


  return (
    <Box>
      <Navbar onLogout={handleLogout} />
      <HeroSection balance={balance} />
      <Box
        w="100%"
        p={8}
        background="#0A1122"
        backgroundImage="url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiM2NEZERjYiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')"
        display="flex"
        flexDirection="column"
        alignItems="center"
        flex="1"
        position="relative"
        overflow="hidden"
      >
        {/* Background gradient orbs */}
        <Box
          position="absolute"
          width="300px"
          height="300px"
          borderRadius="full"
          bg="linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)"
          filter="blur(120px)"
          opacity="0.07"
          top="-100px"
          left="-100px"
          zIndex="0"
        />
        <Box
          position="absolute"
          width="400px"
          height="400px"
          borderRadius="full"
          bg="linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)"
          filter="blur(130px)"
          opacity="0.05"
          bottom="-150px"
          right="-150px"
          zIndex="0"
        />

        <Box
          as="main"
          w="100%"
          maxW="600px"
          bg="#111827"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.05)"
          borderRadius="lg"
          shadow="xl"
          p={6}
          position="relative"
          zIndex="1"
        >
          <Flex
            justifyContent="space-between"
            alignItems="center"
            mb={6}
            mx="auto"
            maxW={{ base: "100%", md: "90%" }}
            px={{ base: 4, md: 6 }}
            gap={1}
            flexWrap="wrap" // Allow buttons to wrap on smaller screens
          >
            <Button
              bg="linear-gradient(135deg, #34d399 0%, #059669 100%)"
              color="white"
              borderRadius="12px"
              boxShadow="0 4px 15px rgba(52, 211, 153, 0.3)"
              _hover={{
                bg: "linear-gradient(135deg, #2cc084 0%, #048554 100%)",
                transform: "translateY(-2px)",
              }}
              _active={{
                bg: "linear-gradient(135deg, #23a670 0%, #03704a 100%)",
              }}
              onClick={() => setIsIncomeOpen(true)}
              leftIcon={<Icon as={FaDownload} color="white" boxSize={{ base: "16px", md: "20px", lg: "24px" }} />}
              size="lg"
              height={{ base: "60px", md: "75px", lg: "90px" }}
              width={{ base: "100px", md: "115px", lg: "130px" }}
              fontSize={{ base: "12px", md: "14px", lg: "16px" }}
              transition="all 0.3s ease"
            >
              Income
            </Button>

            <Button
              bg="linear-gradient(135deg, #ff7171 0%, #e02e2e 100%)"
              color="white"
              borderRadius="12px"
              boxShadow="0 4px 15px rgba(255, 113, 113, 0.3)"
              _hover={{
                bg: "linear-gradient(135deg, #e05a5a 0%, #c02424 100%)",
                transform: "translateY(-2px)",
              }}
              _active={{
                bg: "linear-gradient(135deg, #d04a4a 0%, #a01e1e 100%)",
              }}
              onClick={() => setIsExpenseOpen(true)}
              leftIcon={<Icon as={FaUpload} color="white" boxSize={{ base: "16px", md: "20px", lg: "24px" }} />}
              size="lg"
              height={{ base: "60px", md: "75px", lg: "90px" }}
              width={{ base: "100px", md: "115px", lg: "130px" }}
              fontSize={{ base: "12px", md: "14px", lg: "16px" }}
              transition="all 0.3s ease"
            >
              Outcome
            </Button>

            {/* Bottom row of buttons */}
            <Flex justifyContent="space-between" width="100%" gap={1} flexWrap="wrap">
              <DownloadPdfButton transactions={transactions} balance={balance} />

              <TaskManagerWithButton />
            </Flex>
          </Flex>

          {/* Add Income Drawer */}
          <Drawer isOpen={isIncomeOpen} placement="bottom" onClose={() => setIsIncomeOpen(false)} size="full">
            <DrawerOverlay />
            <DrawerContent
              bg="#111827"
              maxH="80vh"
              mx="auto"
              mt="auto"
              borderTopRadius="20px"
              w={{ base: "100%", md: "75%", lg: "65%" }}
              boxShadow="0 -10px 30px rgba(0, 0, 0, 0.3)"
              borderTop="1px solid"
              borderColor="rgba(255, 255, 255, 0.1)"
            >
              <DrawerCloseButton color="white" />
              <DrawerHeader borderBottomWidth="1px" borderColor="#1E293B">
                <Container maxW="container.lg">
                  <Heading size="lg" color="white">
                    Add Income
                  </Heading>
                </Container>
              </DrawerHeader>
              <DrawerBody>
                <Container maxW="container.lg">
                  <VStack spacing={4} align="stretch">
                    <Input
                      placeholder="Amount"
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          amount: e.target.value,
                          type: "INCOME",
                        })
                      }
                      borderColor="#10B981"
                      _hover={{ borderColor: "#0D9488" }}
                      _focus={{ borderColor: "#0F766E", boxShadow: "0 0 0 1px #0F766E" }}
                      color="white"
                      fontSize={["sm", "md", "lg"]}
                    />
                    <Input
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          date: e.target.value,
                        })
                      }
                      borderColor="#8B5CF6"
                      _hover={{ borderColor: "#7C3AED" }}
                      _focus={{ borderColor: "#6D28D9", boxShadow: "0 0 0 1px #6D28D9" }}
                      color="white"
                      fontSize={["sm", "md", "lg"]}
                    />
                    <Input
                      placeholder="Description"
                      value={newTransaction.description}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          description: e.target.value,
                        })
                      }
                      borderColor="#0EA5E9"
                      _hover={{ borderColor: "#0284C7" }}
                      _focus={{ borderColor: "#0369A1", boxShadow: "0 0 0 1px #0369A1" }}
                      color="white"
                      fontSize={["sm", "md", "lg"]}
                    />
                  </VStack>
                </Container>
              </DrawerBody>
              <DrawerFooter borderTopWidth="1px" borderColor="#1E293B">
                <Container maxW="container.lg">
                  <Flex justify="flex-end">
                    <Button
                      bg="#10B981"
                      color="white"
                      borderRadius="full"
                      _hover={{
                        bg: "#0D9488",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.4)",
                      }}
                      _active={{ bg: "#0F766E" }}
                      onClick={handleAddTransaction}
                      isLoading={isLoading}
                      size="lg"
                      transition="all 0.2s"
                    >
                      Add Income
                    </Button>
                  </Flex>
                </Container>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* Add Expense Drawer */}
          <Drawer isOpen={isExpenseOpen} placement="bottom" onClose={() => setIsExpenseOpen(false)} size="full">
            <DrawerOverlay />
            <DrawerContent
              bg="#111827"
              maxH="80vh"
              mx="auto"
              mt="auto"
              borderTopRadius="20px"
              w={{ base: "100%", md: "75%", lg: "65%" }}
              boxShadow="0 -10px 30px rgba(0, 0, 0, 0.3)"
              borderTop="1px solid"
              borderColor="rgba(255, 255, 255, 0.1)"
            >
              <DrawerCloseButton color="white" />
              <DrawerHeader borderBottomWidth="1px" borderColor="#1E293B">
                <Container maxW="container.lg">
                  <Heading size="lg" color="white">
                    Add Expense
                  </Heading>
                </Container>
              </DrawerHeader>
              <DrawerBody>
                <Container maxW="container.lg">
                  <VStack spacing={4} align="stretch">
                    <Input
                      placeholder="Amount"
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          amount: e.target.value,
                          type: "EXPENSE",
                        })
                      }
                      borderColor="#F43F5E"
                      _hover={{ borderColor: "#E11D48" }}
                      _focus={{ borderColor: "#BE123C", boxShadow: "0 0 0 1px #BE123C" }}
                      color="white"
                      fontSize={["sm", "md", "lg"]}
                    />
                    <Input
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          date: e.target.value,
                        })
                      }
                      borderColor="#8B5CF6"
                      _hover={{ borderColor: "#7C3AED" }}
                      _focus={{ borderColor: "#6D28D9", boxShadow: "0 0 0 1px #6D28D9" }}
                      color="white"
                      fontSize={["sm", "md", "lg"]}
                    />
                    <Input
                      placeholder="Description"
                      value={newTransaction.description}
                      onChange={(e) =>
                        setNewTransaction({
                          ...newTransaction,
                          description: e.target.value,
                        })
                      }
                      borderColor="#0EA5E9"
                      _hover={{ borderColor: "#0284C7" }}
                      _focus={{ borderColor: "#0369A1", boxShadow: "0 0 0 1px #0369A1" }}
                      color="white"
                      fontSize={["sm", "md", "lg"]}
                    />
                  </VStack>
                </Container>
              </DrawerBody>
              <DrawerFooter borderTopWidth="1px" borderColor="#1E293B">
                <Container maxW="container.lg">
                  <Flex justify="flex-end">
                    <Button
                      bg="#F43F5E"
                      color="white"
                      borderRadius="full"
                      _hover={{
                        bg: "#E11D48",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(244, 63, 94, 0.4)",
                      }}
                      _active={{ bg: "#BE123C" }}
                      onClick={handleAddTransaction}
                      isLoading={isLoading}
                      size="lg"
                      transition="all 0.2s"
                    >
                      Add Expense
                    </Button>
                  </Flex>
                </Container>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* Transactions List - IMPROVED STYLING */}
          <Box
            mt={8}
            bg="#0F172A"
            borderRadius="xl"
            overflow="hidden"
            border="1px solid"
            borderColor="#1E293B"
            boxShadow="0 4px 20px rgba(0, 0, 0, 0.2)"
          >
            <Flex
              justify="space-between"
              align="center"
              bg="#1E293B"
              p={4}
              borderBottom="1px solid"
              borderColor="#334155"
            >
              <Heading size="md" color="white" fontWeight="600">
                Recent Transactions
              </Heading>
              <Button
                bg="linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)"
                color="white"
                borderRadius="full"
                size="sm"
                px={4}
                py={2}
                fontSize="xs"
                fontWeight="medium"
                boxShadow="0 2px 10px rgba(0, 198, 255, 0.3)"
                _hover={{
                  bg: "linear-gradient(135deg, #00b4e6 0%, #0066e6 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0, 198, 255, 0.4)",
                }}
                _active={{
                  bg: "linear-gradient(135deg, #00a3cc 0%, #0059cc 100%)",
                }}
                onClick={() => setIsViewAllOpen(true)}
                transition="all 0.3s ease"
              >
                View All
              </Button>
            </Flex>

            {transactions.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py={10}
                px={4}
                textAlign="center"
                color="#94A3B8"
              >
                <Icon as={FaCalendarAlt} boxSize={10} mb={4} opacity={0.6} />
                <Text fontSize="lg" fontWeight="medium" mb={2}>
                  No transactions yet
                </Text>
                <Text fontSize="sm">Add your first transaction to get started</Text>
              </Flex>
            ) : (
              <Box p={4}>
                {/* Display the 8 most recent transactions on the dashboard */}
                <VStack spacing={3} align="stretch">
                  {transactions.slice(0, 8).map((transaction, index) => (
                    <Box
                      key={transaction.id}
                      position="relative"
                      borderRadius="lg"
                      bg="#1E293B"
                      border="1px solid"
                      borderColor="#334155"
                      transition="all 0.2s"
                      _hover={{
                        borderColor: transaction.type === "INCOME" ? "#10B981" : "#F43F5E",
                        transform: "translateY(-2px)",
                        boxShadow: `0 4px 12px ${
                          transaction.type === "INCOME" ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)"
                        }`,
                      }}
                      overflow="hidden"
                    >
                      {/* Colored accent line on the left */}
                      <Box
                        position="absolute"
                        left={0}
                        top={0}
                        bottom={0}
                        width="4px"
                        bg={transaction.type === "INCOME" ? "#10B981" : "#F43F5E"}
                      />

                      <Flex p={4} pl={6} justify="space-between" align="center">
                        <Flex align="center" flex={1}>
                          <Box
                            bg={transaction.type === "INCOME" ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)"}
                            p={2}
                            borderRadius="md"
                            mr={4}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Icon
                              as={transaction.type === "INCOME" ? FaDownload : FaUpload}
                              color={transaction.type === "INCOME" ? "#10B981" : "#F43F5E"}
                              boxSize={4}
                            />
                          </Box>
                          <Box>
                            <Text fontWeight="600" fontSize="md" color="white" mb={1}>
                              {transaction.description}
                            </Text>
                            <Text fontSize="xs" color="#94A3B8">
                              {format(new Date(transaction.date), "MMM dd, yyyy")}
                            </Text>
                          </Box>
                        </Flex>
                        <Box textAlign="right">
                          <Text
                            fontWeight="bold"
                            fontSize="lg"
                            color={transaction.type === "INCOME" ? "#10B981" : "#F43F5E"}
                          >
                            {transaction.type === "INCOME" ? "+" : "-"}${transaction.amount}
                          </Text>
                          <Text
                            fontSize="xs"
                            px={2}
                            py={1}
                            borderRadius="full"
                            bg={transaction.type === "INCOME" ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)"}
                            color={transaction.type === "INCOME" ? "#10B981" : "#F43F5E"}
                            display="inline-block"
                          >
                            {transaction.type}
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  ))}

                  {transactions.length > 8 && (
                    <Flex
                      justify="center"
                      py={3}
                      borderTop="1px dashed"
                      borderColor="#334155"
                      mt={2}
                      onClick={() => setIsViewAllOpen(true)}
                      cursor="pointer"
                      _hover={{ bg: "rgba(255, 255, 255, 0.03)" }}
                      transition="all 0.2s"
                      borderRadius="md"
                    >
                      <Text color="#94A3B8" fontSize="sm" fontWeight="medium">
                        View {transactions.length - 8} more transactions
                      </Text>
                    </Flex>
                  )}
                </VStack>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Footer />
      {/* View All Drawer */}
      <Drawer isOpen={isViewAllOpen} placement="bottom" onClose={() => setIsViewAllOpen(false)} size="full">
        <DrawerOverlay />
        <DrawerContent
          bg="#111827"
          maxH="80vh"
          mx="auto"
          mt="auto"
          borderTopRadius="20px"
          w={{ base: "100%", md: "75%", lg: "65%" }}
          boxShadow="0 -10px 30px rgba(0, 0, 0, 0.3)"
          borderTop="1px solid"
          borderColor="rgba(255, 255, 255, 0.1)"
        >
          <DrawerCloseButton color="white" />
          <DrawerHeader borderBottomWidth="1px" borderColor="#1E293B">
            <Container maxW="container.lg">
              <Heading size="lg" color="white">
                All Transactions
              </Heading>
            </Container>
          </DrawerHeader>
          <DrawerBody>
            <Container maxW="container.lg">
              <Flex mb={6} flexDirection={{ base: "column", md: "row" }} gap={4}>
                <Box flex="1">
                  <Text color="white" mb={2} fontWeight="medium">
                    Filter by Date:
                  </Text>
                  <Input
                    type="date"
                    value={filterDate || ""}
                    onChange={(e) => setFilterDate(e.target.value || null)}
                    borderColor="#1E293B"
                    _hover={{ borderColor: "#334155" }}
                    _focus={{ borderColor: "#0EA5E9", boxShadow: "0 0 0 1px #0EA5E9" }}
                    color="white"
                    bg="#0F172A"
                  />
                </Box>
                <Box flex="1">
                  <Text color="white" mb={2} fontWeight="medium">
                    Filter by Type:
                  </Text>
                  <Select
                    value={filterType || ""}
                    onChange={(e) => setFilterType(e.target.value || null)}
                    borderColor="#1E293B"
                    _hover={{ borderColor: "#334155" }}
                    _focus={{ borderColor: "#0EA5E9", boxShadow: "0 0 0 1px #0EA5E9" }}
                    color="white"
                    bg="#0F172A"
                    icon={<Icon as={FaDownload} />}
                  >
                    <option value="" style={{ background: "#0F172A" }}>
                      All
                    </option>
                    <option value="INCOME" style={{ background: "#0F172A" }}>
                      Income
                    </option>
                    <option value="EXPENSE" style={{ background: "#0F172A" }}>
                      Expense
                    </option>
                  </Select>
                </Box>
              </Flex>

              {filteredTransactions.length === 0 ? (
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  py={10}
                  px={4}
                  textAlign="center"
                  color="#94A3B8"
                  bg="#0F172A"
                  borderRadius="xl"
                  border="1px dashed #334155"
                >
                  <Icon as={FaCalendarAlt} boxSize={10} mb={4} opacity={0.6} />
                  <Text fontSize="lg" fontWeight="medium" mb={2}>
                    No transactions found
                  </Text>
                  <Text fontSize="sm">Try changing your filters</Text>
                </Flex>
              ) : (
                <VStack spacing={3} align="stretch">
                  {filteredTransactions.map((transaction) => (
                    <Box
                      key={transaction.id}
                      position="relative"
                      borderRadius="lg"
                      bg="#1E293B"
                      border="1px solid"
                      borderColor="#334155"
                      transition="all 0.2s"
                      _hover={{
                        borderColor: transaction.type === "INCOME" ? "#10B981" : "#F43F5E",
                        transform: "translateY(-2px)",
                        boxShadow: `0 4px 12px ${
                          transaction.type === "INCOME" ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)"
                        }`,
                      }}
                      overflow="hidden"
                    >
                      {/* Colored accent line on the left */}
                      <Box
                        position="absolute"
                        left={0}
                        top={0}
                        bottom={0}
                        width="4px"
                        bg={transaction.type === "INCOME" ? "#10B981" : "#F43F5E"}
                      />

                      <Flex p={4} pl={6} justify="space-between" align="center">
                        <Flex align="center" flex={1}>
                          <Box
                            bg={transaction.type === "INCOME" ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)"}
                            p={2}
                            borderRadius="md"
                            mr={4}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Icon
                              as={transaction.type === "INCOME" ? FaDownload : FaUpload}
                              color={transaction.type === "INCOME" ? "#10B981" : "#F43F5E"}
                              boxSize={4}
                            />
                          </Box>
                          <Box>
                            <Text fontWeight="600" fontSize="md" color="white" mb={1}>
                              {transaction.description}
                            </Text>
                            <Text fontSize="xs" color="#94A3B8">
                              {format(new Date(transaction.date), "MMM dd, yyyy")}
                            </Text>
                          </Box>
                        </Flex>
                        <Flex align="center" gap={4}>
                          <Box textAlign="right">
                            <Text
                              fontWeight="bold"
                              fontSize="lg"
                              color={transaction.type === "INCOME" ? "#10B981" : "#F43F5E"}
                            >
                              {transaction.type === "INCOME" ? "+" : "-"}${transaction.amount}
                            </Text>
                            <Text
                              fontSize="xs"
                              px={2}
                              py={1}
                              borderRadius="full"
                              bg={transaction.type === "INCOME" ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)"}
                              color={transaction.type === "INCOME" ? "#10B981" : "#F43F5E"}
                              display="inline-block"
                            >
                              {transaction.type}
                            </Text>
                          </Box>
                          <IconButton
                            aria-label="Delete transaction"
                            icon={<DeleteIcon />}
                            variant="ghost"
                            color="#94A3B8"
                            _hover={{
                              bg: "rgba(244, 63, 94, 0.15)",
                              color: "#F43F5E",
                            }}
                            size="sm"
                            onClick={() => {
                              setDeleteId(transaction.id)
                              setIsDeleteModalOpen(true)
                            }}
                          />
                        </Flex>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              )}
            </Container>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px" borderColor="#1E293B">
            <Container maxW="container.lg">
              <Flex justify="flex-end">
                <Button
                  bg="#0EA5E9"
                  color="white"
                  _hover={{
                    bg: "#0284C7",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.4)",
                  }}
                  _active={{ bg: "#0369A1" }}
                  onClick={() => setIsViewAllOpen(false)}
                  transition="all 0.2s"
                  borderRadius="full"
                >
                  Close
                </Button>
              </Flex>
            </Container>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bg="#111827" borderColor="#1E293B" borderWidth="1px" borderRadius="xl">
          <ModalHeader color="white">Delete Transaction</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Text color="white">Are you sure you want to delete this transaction?</Text>
            <Text color="#94A3B8" fontSize="sm" mt={2}>
              This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              color="white"
              _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              bg="#F43F5E"
              color="white"
              _hover={{
                bg: "#E11D48",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(244, 63, 94, 0.4)",
              }}
              _active={{ bg: "#BE123C" }}
              onClick={handleDeleteTransaction}
              isLoading={isLoading}
              borderRadius="full"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default DashboardPage
