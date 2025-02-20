import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  VStack,
  Select,
  useToast,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import axios from "axios";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Navbar from "../components/navbar2";
import Footer from "../components/Footer";

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

  return (
    <Box>
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
          bg="white"
          borderRadius="lg"
          shadow="xl"
          p={6}
        >
          <Heading
            fontSize={["lg", "xl", "2xl"]}
            textAlign="center"
            mb={4}
            color="gray.700"
          >
            Add Transaction
          </Heading>

          <VStack spacing={4}>
            <Input
              placeholder="Amount"
              type="number"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, amount: e.target.value })
              }
              borderColor="green.500"
              _hover={{ borderColor: "green.700" }}
              _focus={{ borderColor: "green.900" }}
              fontSize={["sm", "md", "lg"]}
            />
            <Select
              value={newTransaction.type}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, type: e.target.value })
              }
              borderColor={
                newTransaction.type === "INCOME" ? "green.500" : "red.500"
              }
              bg={newTransaction.type === "INCOME" ? "green.100" : "red.100"}
              color={newTransaction.type === "INCOME" ? "green.800" : "red.800"}
              _hover={{
                borderColor:
                  newTransaction.type === "INCOME" ? "green.700" : "red.700",
              }}
              _focus={{
                borderColor:
                  newTransaction.type === "INCOME" ? "green.900" : "red.900",
              }}
              fontSize={["sm", "md", "lg"]}
            >
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </Select>
            <Input
              type="date"
              value={newTransaction.date}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, date: e.target.value })
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

            <Button
              bg="black"
              color="white"
              borderRadius="full"
              _hover={{
                bg: "white",
                color: "black",
                border: "2px solid black",
              }}
              w="40%"
              fontSize={["13px", "md", "lg"]}
              onClick={handleAddTransaction}
            >
              Add Transaction
            </Button>
          </VStack>
        </Box>

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
                bg={transaction.type === "INCOME" ? "green.100" : "red.100"}
                color={transaction.type === "INCOME" ? "green.800" : "red.800"}
                w="100%"
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold" fontSize={["sm", "md", "lg"]}>
                      ${transaction.amount} - {transaction.type}
                    </Text>
                    <Text fontSize={["xs", "sm", "md"]}>
                      {transaction.description}
                    </Text>
                    <Text fontSize={["xs", "sm", "md"]} color="gray.500">
                      {format(new Date(transaction.date), "dd/MM/yyyy")}
                    </Text>
                  </Box>
                  <IconButton
                    aria-label="Delete transaction"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  />
                </Flex>
              </Box>
            ))}
          </VStack>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default DashboardPage;
