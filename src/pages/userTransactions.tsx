

import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  useMediaQuery,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

interface UserSummary {
  id: number;
  name: string;
  email: string;
}

interface Transaction {
  id: number;
  amount: number;
  date: string;
  description: string;
}

const UserTransactions = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { email } = useParams();

  const bg = "#1a202c";
  const color = "white";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<UserSummary[]>("http://localhost:8080/admin/users", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth-token")}`,
          },
        });
        setUsers(response.data);

        if (email) {
          const user = response.data.find((u) => u.email === email) || null;
          setSelectedUser(user);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    const fetchUserTransactions = async () => {
      if (!email) return;

      try {
        const response = await axios.get<Transaction[]>(`http://localhost:8080/admin/users/${email}/transactions`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth-token")}`,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchUsers();
    if (email) fetchUserTransactions();
  }, [email]);

  const handleUserClick = (email: string) => {
    navigate(`/admin/transactions/${email}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box bg={bg} minH="100vh" w="100vw" color={color} p={4}>
      <Box p={4} bg={bg} mb={6}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading fontSize={isMobile ? "2xl" : "4xl"}>User Transactions</Heading>
          <IconButton
            aria-label="Go Back"
            icon={<FiArrowLeft />}
            colorScheme="whiteAlpha"
            size={isMobile ? "xs" : "sm"}
            onClick={handleGoBack}
          />
        </Flex>
      </Box>

      <Box
        bg="gray.800"
        borderRadius="md"
        boxShadow="md"
        p={4}
        maxW="container.md"
        mx="auto"
        overflowX="auto"
      >
        {!selectedUser ? (
          <Table variant="simple" size={isMobile ? "sm" : "md"} colorScheme="teal">
            <Thead bg="gray.700">
              <Tr>
                <Th color="white">ID</Th>
                <Th color="white">Name</Th>
                <Th color="white">Email</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr
                  key={user.id}
                  onClick={() => handleUserClick(user.email)}
                  cursor="pointer"
                  _hover={{ bg: "gray.700" }}
                >
                  <Td>{user.id}</Td>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <>
            <Box mb={4}>
              <Text fontWeight="bold" fontSize="lg">
                Transactions for: {selectedUser.name} ({selectedUser.email})
              </Text>
            </Box>
            <Table variant="simple" size={isMobile ? "sm" : "md"} colorScheme="teal">
              <Thead bg="gray.700">
                <Tr>
                  <Th color="white">ID</Th>
                  <Th color="white">Amount</Th>
                  <Th color="white">Date</Th>
                  <Th color="white">Description</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transactions.map((transaction) => (
                  <Tr key={transaction.id} _hover={{ bg: "gray.700" }}>
                    <Td>{transaction.id}</Td>
                    <Td>{transaction.amount}</Td>
                    <Td>{transaction.date}</Td>
                    <Td>{transaction.description}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        )}
      </Box>
    </Box>
  );
};

export default UserTransactions;
