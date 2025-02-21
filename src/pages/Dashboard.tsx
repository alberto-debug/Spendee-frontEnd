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
import { FaUpload, FaDownload } from "react-icons/fa";
import axios from "axios";
import { format, parse } from "date-fns";
import { motion } from "framer-motion";
import Navbar from "../components/navbar2";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection"; // Import the HeroSection component
import { DeleteIcon } from "@chakra-ui/icons";

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
      <HeroSection balance={balance} />{" "}
      {/* Pass the balance prop to HeroSection */}
      <Box
        w="100%"
        p={8}
        background="black"
        display="flex"
        flexDirection="column"
        alignItems="center"
        flex="1"
      >
        <Box
          as="main"
          w="100%"
          maxW="600px"
          bg="black"
          borderRadius="lg"
          shadow="xl"
          p={6}
        >
          <Flex justifyContent="space-around" mb={4}>
            <Button
              bg="black"
              border="1px solid #1a1a1d"
              color="white"
              borderRadius="10px"
              _hover={{
                bg: "#0C0F15",
              }}
              _active={{
                bg: "#1a1a1d",
              }}
              onClick={() => setIsIncomeOpen(true)}
              leftIcon={<Icon as={FaDownload} color="green.500" />}
              size="lg"
              height="90px"
              width="130px"
            >
              Income
            </Button>
            <Button
              bg="black"
              border="1px solid #1a1a1d"
              color="white"
              borderRadius="10px"
              _hover={{
                bg: "#0C0F15",
              }}
              _active={{
                bg: "#1a1a1d",
              }}
              onClick={() => setIsExpenseOpen(true)}
              leftIcon={<Icon as={FaUpload} color="red.500" />}
              size="lg"
              height="90px"
              width="130px"
            >
              Outcome
            </Button>
          </Flex>

          {/* Add Income Drawer */}
          <Drawer
            isOpen={isIncomeOpen}
            placement="bottom"
            onClose={() => setIsIncomeOpen(false)}
            size="full"
          >
            <DrawerOverlay />
            <DrawerContent
              bg="gray.900"
              maxH="80vh"
              mx="auto"
              mt="auto"
              borderTopRadius="20px"
              w={{ base: "100%", md: "75%", lg: "65%" }}
            >
              <DrawerCloseButton color="white" />
              <DrawerHeader
                borderBottomWidth="1px"
                borderColor="whiteAlpha.200"
              >
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
                      borderColor="green.500"
                      _hover={{ borderColor: "green.700" }}
                      _focus={{ borderColor: "green.900" }}
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
                      borderColor="purple.500"
                      _hover={{ borderColor: "purple.700" }}
                      _focus={{ borderColor: "purple.900" }}
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
                      borderColor="orange.500"
                      _hover={{ borderColor: "orange.700" }}
                      _focus={{ borderColor: "orange.900" }}
                      color="white"
                      fontSize={["sm", "md", "lg"]}
                    />
                  </VStack>
                </Container>
              </DrawerBody>
              <DrawerFooter borderTopWidth="1px" borderColor="whiteAlpha.200">
                <Container maxW="container.lg">
                  <Flex justify="flex-end">
                    <Button
                      bg="green.500"
                      color="white"
                      borderRadius="full"
                      _hover={{
                        bg: "green.700",
                      }}
                      onClick={handleAddTransaction}
                      isLoading={isLoading}
                      size="lg"
                    >
                      Add Income
                    </Button>
                  </Flex>
                </Container>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* Add Expense Drawer */}
          <Drawer
            isOpen={isExpenseOpen}
            placement="bottom"
            onClose={() => setIsExpenseOpen(false)}
            size="full"
          >
            <DrawerOverlay />
            <DrawerContent
              bg="gray.900"
              maxH="80vh"
              mx="auto"
              mt="auto"
              borderTopRadius="20px"
              w={{ base: "100%", md: "75%", lg: "65%" }}
            >
              <DrawerCloseButton color="white" />
              <DrawerHeader
                borderBottomWidth="1px"
                borderColor="whiteAlpha.200"
              >
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
                      borderColor="red.500"
                      _hover={{ borderColor: "red.700" }}
                      _focus={{ borderColor: "red.900" }}
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
                      borderColor="purple.500"
                      _hover={{ borderColor: "purple.700" }}
                      _focus={{ borderColor: "purple.900" }}
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
                      borderColor="orange.500"
                      _hover={{ borderColor: "orange.700" }}
                      _focus={{ borderColor: "orange.900" }}
                      color="white"
                      fontSize={["sm", "md", "lg"]}
                    />
                  </VStack>
                </Container>
              </DrawerBody>
              <DrawerFooter borderTopWidth="1px" borderColor="whiteAlpha.200">
                <Container maxW="container.lg">
                  <Flex justify="flex-end">
                    <Button
                      bg="red.500"
                      color="white"
                      borderRadius="full"
                      _hover={{
                        bg: "red.700",
                      }}
                      onClick={handleAddTransaction}
                      isLoading={isLoading}
                      size="lg"
                    >
                      Add Expense
                    </Button>
                  </Flex>
                </Container>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <VStack spacing={8}>
            {/* Transactions List */}
            <Box w="100%">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="lg" color="white">
                  Transactions
                </Heading>
                <Button
                  colorScheme="blue"
                  size="sm"
                  onClick={() => setIsViewAllOpen(true)}
                >
                  View All
                </Button>
              </Flex>

              {/* Display the 8 most recent transactions on the dashboard */}
              <VStack spacing={4} align="stretch">
                {transactions.slice(0, 8).map((transaction) => (
                  <Box
                    key={transaction.id}
                    p={4}
                    borderRadius="md"
                    bg="gray.800"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: "whiteAlpha.400",
                      transform: "translateY(-2px)",
                    }}
                  >
                    <Flex justify="space-between" align="center">
                      <Flex align="center" flex={1}>
                        <Circle
                          size="10px"
                          bg={
                            transaction.type === "INCOME"
                              ? "green.500"
                              : "red.500"
                          }
                          mr={4}
                        />
                        <Box>
                          <Text
                            fontWeight="bold"
                            fontSize={{ base: "sm", md: "md" }}
                            color="white"
                          >
                            {transaction.description}
                          </Text>
                          <Text fontSize="sm" color="gray.400">
                            {format(new Date(transaction.date), "dd/MM/yyyy")}
                          </Text>
                        </Box>
                      </Flex>
                      <Box textAlign="right">
                        <Text
                          fontWeight="bold"
                          fontSize={{ base: "md", md: "lg" }}
                          color={
                            transaction.type === "INCOME"
                              ? "green.500"
                              : "red.500"
                          }
                        >
                          ${transaction.amount}
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          {transaction.type}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Box>
      <Footer />
      {/* View All Drawer */}
      <Drawer
        isOpen={isViewAllOpen}
        placement="bottom"
        onClose={() => setIsViewAllOpen(false)}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent
          bg="gray.900"
          maxH="80vh"
          mx="auto"
          mt="auto"
          borderTopRadius="20px"
          w={{ base: "100%", md: "75%", lg: "65%" }}
        >
          <DrawerCloseButton color="white" />
          <DrawerHeader borderBottomWidth="1px" borderColor="whiteAlpha.200">
            <Container maxW="container.lg">
              <Heading size="lg" color="white">
                All Transactions
              </Heading>
            </Container>
          </DrawerHeader>
          <DrawerBody>
            <Container maxW="container.lg">
              <Flex mb={4}>
                <Box mr={4}>
                  <Text color="white">Filter by Date:</Text>
                  <Input
                    type="date"
                    value={filterDate || ""}
                    onChange={(e) => setFilterDate(e.target.value || null)}
                    borderColor="whiteAlpha.500"
                    _hover={{ borderColor: "whiteAlpha.700" }}
                    _focus={{ borderColor: "whiteAlpha.900" }}
                    color="white"
                  />
                </Box>
                <Box>
                  <Text color="white">Filter by Type:</Text>
                  <Select
                    value={filterType || ""}
                    onChange={(e) => setFilterType(e.target.value || null)}
                    borderColor="whiteAlpha.500"
                    _hover={{ borderColor: "whiteAlpha.700" }}
                    _focus={{ borderColor: "whiteAlpha.900" }}
                    color="white"
                  >
                    <option value="">All</option>
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </Select>
                </Box>
              </Flex>
              <VStack spacing={4} align="stretch">
                {filteredTransactions.map((transaction) => (
                  <Box
                    key={transaction.id}
                    p={4}
                    borderRadius="md"
                    bg="gray.800"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                    transition="all 0.2s"
                    _hover={{
                      borderColor: "whiteAlpha.400",
                      transform: "translateY(-2px)",
                    }}
                  >
                    <Flex justify="space-between" align="center">
                      <Flex align="center" flex={1}>
                        <Circle
                          size="10px"
                          bg={
                            transaction.type === "INCOME"
                              ? "green.500"
                              : "red.500"
                          }
                          mr={4}
                        />
                        <Box>
                          <Text
                            fontWeight="bold"
                            fontSize={{ base: "sm", md: "md" }}
                            color="white"
                          >
                            {transaction.description}
                          </Text>
                          <Text fontSize="sm" color="gray.400">
                            {format(new Date(transaction.date), "dd/MM/yyyy")}
                          </Text>
                        </Box>
                      </Flex>
                      <Flex align="center" gap={4}>
                        <Box textAlign="right">
                          <Text
                            fontWeight="bold"
                            fontSize={{ base: "md", md: "lg" }}
                            color={
                              transaction.type === "INCOME"
                                ? "green.500"
                                : "red.500"
                            }
                          >
                            ${transaction.amount}
                          </Text>
                          <Text fontSize="sm" color="gray.400">
                            {transaction.type}
                          </Text>
                        </Box>
                        <IconButton
                          aria-label="Delete transaction"
                          icon={<DeleteIcon />}
                          variant="ghost"
                          colorScheme="red"
                          size="sm"
                          onClick={() => {
                            setDeleteId(transaction.id);
                            setIsDeleteModalOpen(true);
                          }}
                        />
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Container>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px" borderColor="whiteAlpha.200">
            <Container maxW="container.lg">
              <Flex justify="flex-end">
                <Button
                  colorScheme="blue"
                  onClick={() => setIsViewAllOpen(false)}
                >
                  Close
                </Button>
              </Flex>
            </Container>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent bg="gray.800">
          <ModalHeader color="white">Delete Transaction</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Text color="white">
              Are you sure you want to delete this transaction?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteTransaction}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DashboardPage;
