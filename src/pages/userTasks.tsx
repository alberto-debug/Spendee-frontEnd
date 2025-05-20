

import {
  Box,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  TableContainer,
  useMediaQuery,
  IconButton,
  Flex,
  HStack,
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

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
}

const UserTasks = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const { email } = useParams();

  // Use same bg and colors as AdminDashboard
  const bg = "#1a202c";
  const color = "white";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<UserSummary[]>("https://spendee-track-spending-easily.onrender.com/admin/users", {
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

    const fetchUserTasks = async () => {
      if (!email) return;

      try {
        const response = await axios.get<Task[]>(`https://spendee-track-spending-easily.onrender.com/admin/users/${email}/tasks`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("auth-token")}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchUsers();
    if (email) fetchUserTasks();
  }, [email]);

  const handleUserClick = (email: string) => {
    navigate(`/admin/tasks/${email}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box bg={bg} minH="100vh" w="100vw" color={color} p={4}>
      <Box p={4} bg={bg} mb={6}>
        <Flex justifyContent="space-between" alignItems="center">
          <Heading fontSize={isMobile ? "2xl" : "4xl"}>User Tasks</Heading>
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
                Tasks for: {selectedUser.name} ({selectedUser.email})
              </Text>
            </Box>
            <Table variant="simple" size={isMobile ? "sm" : "md"} colorScheme="teal">
              <Thead bg="gray.700">
                <Tr>
                  <Th color="white">ID</Th>
                  <Th color="white">Title</Th>
                  <Th color="white">Due Date</Th>
                  <Th color="white">Description</Th>
                </Tr>
              </Thead>
              <Tbody>
                {tasks.map((task) => (
                  <Tr key={task.id} _hover={{ bg: "gray.700" }}>
                    <Td>{task.id}</Td>
                    <Td>{task.title}</Td>
                    <Td>{task.dueDate}</Td>
                    <Td>{task.description}</Td>
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

export default UserTasks;
