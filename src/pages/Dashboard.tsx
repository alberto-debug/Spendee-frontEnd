import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  useToast,
  IconButton,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Circle,
  Text as ChakraText,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Navbar from "../components/navbar2";
import Footer from "../components/Footer";
import { useSwipeable } from "react-swipeable";

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

    try {
      await axios.post(
        "https://spendee-track-spending-easily.onrender.com/finance/transaction",
        newTransaction,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth-token")}`,
          },
        },
      );
      toast({
        title: "Transaction added!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchTransactions();
      setNewTransaction({
        amount: "",
        type: "INCOME",
        date: new Date().toISOString().split("T")[0],
        description: "",
      });
      setIsIncomeOpen(false);
      setIsExpenseOpen(false);
    } catch (error) {
      toast({
        title: "Error adding transaction",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await axios.delete(
        `https://spendee-track-spending-easily.onrender.com/finance/transaction/${id}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth-token")}`,
          },
        },
      );
      toast({
        title: "Transaction removed!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchTransactions();
    } catch (error) {
      toast({
        title: "Error removing transaction",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      const target = eventData.event.currentTarget as HTMLElement;
      const id = target.dataset.id;
      if (id) {
        handleDeleteTransaction(parseInt(id, 10));
      }
    },
  });

  return (
    <Box bg="black" color="white">
      <Navbar onLogout={handleLogout} />
      <Box
        bg="linear-gradient(to right, #1a1a1d, #0C0F15)"
        color="white"
        py={20}
        textAlign="center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Heading as="h1" size={["2xl", "2xl", "2xl"]} mb={4}>
            Total Control of Your Finances
          </Heading>
          <Text mb={4} fontSize={["lg", "xl", "2xl"]}>
            Manage, analyze, and optimize your finances efficiently.
          </Text>
          <Box
            fontSize={["xl", "xl", "2xl"]}
            fontWeight="bold"
            p={4}
            border="3px solid #00FFFF"
            borderRadius="40px"
            bg="rgba(255, 255, 255, 0.1)"
            display="inline-block"
            mt={4}
            fontFamily="monospace"
            textShadow="2px 2px 5px rgba(0,0,0,0.5)"
          >
            Current Balance:{" "}
            <span style={{ color: "#FFD700" }}>${balance.toFixed(2)}</span>
          </Box>
        </motion.div>
      </Box>

      <Box
        w="100%"
        p={8}
        display="flex"
        flexDirection="column"
        alignItems="center"
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
              bg="green.500"
              color="white"
              borderRadius="full"
              _hover={{
                bg: "green.700",
              }}
              onClick={() => setIsIncomeOpen(true)}
            >
              Income
            </Button>
            <Button
              bg="red.500"
              color="white"
              borderRadius="full"
              _hover={{
                bg: "red.700",
              }}
              onClick={() => setIsExpenseOpen(true)}
            >
              Expense
            </Button>
            <Button
              bg="blue.500"
              color="white"
              borderRadius="full"
              _hover={{
                bg: "blue.700",
              }}
              onClick={() => { }}
            >
              Summary
            </Button>
          </Flex>

          <Modal isOpen={isIncomeOpen} onClose={() => setIsIncomeOpen(false)}>
            <ModalOverlay />
            <ModalContent maxW="300px">
              <ModalHeader>Add Income</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
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
                    fontSize={["sm", "md", "lg"]}
                  />
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button
                  bg="green.500"
                  color="white"
                  borderRadius="full"
                  _hover={{
                    bg: "green.700",
                  }}
                  onClick={handleAddTransaction}
                >
                  Add Income
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal isOpen={isExpenseOpen} onClose={() => setIsExpenseOpen(false)}>
            <ModalOverlay />
            <ModalContent maxW="300px">
              <ModalHeader>Add Expense</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
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
                    fontSize={["sm", "md", "lg"]}
                  />
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  _hover={{
                    bg: "red.700",
                  }}
                  onClick={handleAddTransaction}
                >
                  Add Expense
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Box mt={8} w="100%" maxW="600px">
            <Heading
              fontSize={["lg", "xl", "2xl"]}
              textAlign="center"
              mb={4}
              color="gray.700"
            >
              Transactions
            </Heading>
            <VStack spacing={4}>
              {transactions.map((transaction) => (
                <Box
                  key={transaction.id}
                  p={4}
                  borderRadius="md"
                  shadow="md"
                  bg="black"
                  color="white"
                  w="100%"
                  justifyContent="space-between"
                  alignItems="center"
                  {...swipeHandlers}
                  data-id={transaction.id}
                >
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                      <Circle
                        size="10px"
                        bg={
                          transaction.type === "INCOME"
                            ? "green.500"
                            : "red.500"
                        }
                      />
                    </Box>
                    <Box>
                      <ChakraText
                        fontWeight="bold"
                        fontSize={["sm", "md", "lg"]}
                      >
                        {transaction.description}
                      </ChakraText>
                      <ChakraText
                        fontSize={["xs", "sm", "md"]}
                        color="gray.500"
                      >
                        {format(new Date(transaction.date), "dd/MM/yyyy")}
                      </ChakraText>
                    </Box>
                    <Box>
                      <ChakraText
                        fontWeight="bold"
                        fontSize={["sm", "md", "lg"]}
                        color={
                          transaction.type === "INCOME"
                            ? "green.500"
                            : "red.500"
                        }
                      >
                        ${transaction.amount}
                      </ChakraText>
                      <ChakraText
                        fontSize={["xs", "sm", "md"]}
                        color="gray.500"
                      >
                        {transaction.type}
                      </ChakraText>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default DashboardPage;
