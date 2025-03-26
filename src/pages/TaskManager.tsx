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
  IconButton,
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
  FormLabel,
  FormControl,
  useBreakpointValue,
} from "@chakra-ui/react";
import axios from "axios";
import { FaTrash, FaClock, FaBook, FaPlus } from "react-icons/fa";
import { format } from "date-fns";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

const TaskManager: React.FC = () => {
  const toast = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "ONGOING",
  });
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchTasks = async () => {
    setIsFetching(true);
    try {
      const token = sessionStorage.getItem("auth-token");
      const response = await axios.get<Task[]>(
        "https://spendee-track-spending-easily.onrender.com/tasks/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTasks(response.data);
    } catch (error) {
      toast({
        title: "Error loading tasks",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
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
      const token = sessionStorage.getItem("auth-token");
      const response = await axios.post(
        "https://spendee-track-spending-easily.onrender.com/tasks/add",
        newTask,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTasks([response.data, ...tasks]);
      setNewTask({
        title: "",
        description: "",
        dueDate: "",
        status: "ONGOING",
      });
      setIsAddTaskOpen(false);
      toast({
        title: "Task added!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error adding task",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      const token = sessionStorage.getItem("auth-token");
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      await axios.patch(
        `https://spendee-track-spending-easily.onrender.com/tasks/${taskId}/status?newStatus=${newStatus}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      );
      setTasks(updatedTasks);
      toast({
        title: "Task updated!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
        toast({
          title: "Error updating task",
          description: error.response?.data?.message || "An error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (error instanceof Error) {
        console.error("Error updating task:", error.message);
        toast({
          title: "Error updating task",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error("Unknown error updating task:", error);
        toast({
          title: "Error updating task",
          description: "An unknown error occurred",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteTask = async () => {
    if (deleteId === null) return;

    try {
      const token = sessionStorage.getItem("auth-token");
      await axios.delete(
        `https://spendee-track-spending-easily.onrender.com/tasks/task/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const updatedTasks = tasks.filter((task) => task.id !== deleteId);
      setTasks(updatedTasks);
      toast({
        title: "Task deleted!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setDeleteId(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast({
        title: "Error deleting task",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const drawerWidth = useBreakpointValue({ base: "100%", md: "60%" });

  return (
    <>
      {/* Main Button to open TaskManager */}
      <Button
        bg="linear-gradient(135deg, #6B7280, #374151)"
        color="white"
        borderRadius="lg"
        boxShadow="md"
        _hover={{
          bg: "linear-gradient(135deg, #4B5563, #1F2937)",
          boxShadow: "lg",
        }}
        _active={{ bg: "gray.700" }}
        onClick={handleOpen}
        leftIcon={<Icon as={FaBook} color="teal.300" boxSize={5} />}
        size="lg"
        px={6}
        py={6}
        fontSize={{ base: "md", md: "lg" }}
        fontWeight="semibold"
      >
        Tasks
      </Button>

      {/* TaskManager Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={handleClose}
        size="md"
      >
        <DrawerOverlay bg="rgba(0, 0, 0, 0.5)" />
        <DrawerContent
          bg="gray.800"
          color="white"
          borderRadius="xl"
          boxShadow="2xl"
          maxH="60vh"
          mx="auto"
          w={drawerWidth}
        >
          <DrawerCloseButton color="gray.300" size="lg" mt={2} />
          <DrawerHeader borderBottomWidth="1px" borderColor="gray.700" py={4}>
            <Heading size="lg" color="teal.300" fontWeight="bold">
              Task Manager
            </Heading>
          </DrawerHeader>
          <DrawerBody py={6}>
            <Container maxW="container.md">
              <VStack spacing={6} align="stretch">
                <Button
                  bg="teal.500"
                  color="white"
                  onClick={() => setIsAddTaskOpen(true)}
                  leftIcon={<Icon as={FaPlus} />}
                  size="lg"
                  borderRadius="md"
                  _hover={{ bg: "teal.600", transform: "translateY(-2px)" }}
                  _active={{ bg: "teal.700" }}
                  boxShadow="md"
                  fontWeight="medium"
                >
                  Add New Task
                </Button>
                {isAddTaskOpen && (
                  <Drawer
                    isOpen={isAddTaskOpen}
                    placement="bottom"
                    onClose={() => setIsAddTaskOpen(false)}
                    size="md"
                  >
                    <DrawerOverlay bg="rgba(0, 0, 0, 0.5)" />
                    <DrawerContent
                      bg="gray.800"
                      color="white"
                      borderRadius="xl"
                      boxShadow="2xl"
                      maxH="60vh"
                      mx="auto"
                      w={drawerWidth}
                    >
                      <DrawerCloseButton color="gray.300" size="lg" mt={2} />
                      <DrawerHeader
                        borderBottomWidth="1px"
                        borderColor="gray.700"
                        py={4}
                      >
                        <Heading size="md" color="teal.300" fontWeight="bold">
                          Create Task
                        </Heading>
                      </DrawerHeader>
                      <DrawerBody py={6}>
                        <VStack spacing={5} align="stretch">
                          <FormControl>
                            <FormLabel
                              color="gray.300"
                              fontSize="sm"
                              fontWeight="medium"
                            >
                              Title
                            </FormLabel>
                            <Input
                              placeholder="Enter task title"
                              value={newTask.title}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  title: e.target.value,
                                })
                              }
                              bg="gray.700"
                              border="1px solid"
                              borderColor="gray.600"
                              borderRadius="md"
                              _hover={{ borderColor: "gray.500" }}
                              _focus={{
                                borderColor: "teal.400",
                                bg: "gray.600",
                              }}
                              color="white"
                              fontSize="md"
                              py={5}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel
                              color="gray.300"
                              fontSize="sm"
                              fontWeight="medium"
                            >
                              Description
                            </FormLabel>
                            <Input
                              placeholder="Enter description"
                              value={newTask.description}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  description: e.target.value,
                                })
                              }
                              bg="gray.700"
                              border="1px solid"
                              borderColor="gray.600"
                              borderRadius="md"
                              _hover={{ borderColor: "gray.500" }}
                              _focus={{
                                borderColor: "teal.400",
                                bg: "gray.600",
                              }}
                              color="white"
                              fontSize="md"
                              py={5}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel
                              color="gray.300"
                              fontSize="sm"
                              fontWeight="medium"
                            >
                              Due Date
                            </FormLabel>
                            <Input
                              type="date"
                              value={newTask.dueDate}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  dueDate: e.target.value,
                                })
                              }
                              bg="gray.700"
                              border="1px solid"
                              borderColor="gray.600"
                              borderRadius="md"
                              _hover={{ borderColor: "gray.500" }}
                              _focus={{
                                borderColor: "teal.400",
                                bg: "gray.600",
                              }}
                              color="white"
                              fontSize="md"
                              py={5}
                              sx={{
                                "::-webkit-calendar-picker-indicator": {
                                  filter: "invert(0.8)",
                                  cursor: "pointer",
                                  padding: "8px",
                                },
                                "::-webkit-datetime-edit": { color: "white" },
                              }}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel
                              color="gray.300"
                              fontSize="sm"
                              fontWeight="medium"
                            >
                              Status
                            </FormLabel>
                            <Select
                              value={newTask.status}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  status: e.target.value,
                                })
                              }
                              bg="gray.700"
                              border="1px solid"
                              borderColor="gray.600"
                              borderRadius="md"
                              _hover={{ borderColor: "gray.500" }}
                              _focus={{
                                borderColor: "teal.400",
                                bg: "gray.600",
                              }}
                              color="white"
                              fontSize="md"
                              py={2}
                            >
                              <option value="ONGOING">Ongoing</option>
                              <option value="DONE">Done</option>
                              <option value="DELAYED">Delayed</option>
                            </Select>
                          </FormControl>
                        </VStack>
                      </DrawerBody>
                      <DrawerFooter
                        borderTopWidth="1px"
                        borderColor="gray.700"
                        py={4}
                      >
                        <Button
                          variant="outline"
                          color="white"
                          borderColor="gray.600"
                          mr={3}
                          onClick={() => setIsAddTaskOpen(false)}
                          _hover={{ bg: "gray.700" }}
                          borderRadius="md"
                        >
                          Cancel
                        </Button>
                        <Button
                          bg="teal.500"
                          color="white"
                          onClick={handleAddTask}
                          _hover={{ bg: "teal.600" }}
                          borderRadius="md"
                        >
                          Add Task
                        </Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                )}
                <VStack spacing={4} align="stretch">
                  {isFetching ? (
                    <Flex justify="center" py={10}>
                      <Spinner size="lg" color="teal.400" thickness="3px" />
                    </Flex>
                  ) : (
                    tasks.map((task) => (
                      <Box
                        key={task.id}
                        p={4}
                        borderRadius="lg"
                        bg="gray.700"
                        border="1px solid"
                        borderColor="gray.600"
                        _hover={{ borderColor: "teal.500", boxShadow: "lg" }}
                      >
                        <Flex justify="space-between" align="center">
                          <VStack align="start" spacing={2}>
                            <Text
                              fontWeight="semibold"
                              fontSize="md"
                              color="white"
                            >
                              {task.title}
                            </Text>
                            <Text fontSize="sm" color="gray.300">
                              {task.description}
                            </Text>
                            <Flex align="center">
                              <Icon
                                as={FaClock}
                                color="teal.400"
                                boxSize={4}
                                mr={2}
                              />
                              <Text fontSize="sm" color="gray.400">
                                {format(new Date(task.dueDate), "MMM dd, yyyy")}
                              </Text>
                            </Flex>
                          </VStack>
                          <Flex align="center" gap={3}>
                            <Select
                              value={task.status}
                              onChange={(e) =>
                                handleStatusChange(task.id, e.target.value)
                              }
                              bg={
                                task.status === "DONE"
                                  ? "green.600"
                                  : task.status === "DELAYED"
                                    ? "red.600"
                                    : "teal.600"
                              }
                              color="white"
                              border="none"
                              borderRadius="md"
                              fontSize="sm"
                              w="110px"
                              _focus={{ boxShadow: "none" }}
                            >
                              <option value="ONGOING">Ongoing</option>
                              <option value="DONE">Done</option>
                              <option value="DELAYED">Delayed</option>
                            </Select>
                            <IconButton
                              aria-label="Delete task"
                              icon={<Icon as={FaTrash} />}
                              size="sm"
                              bg="red.500"
                              color="white"
                              borderRadius="md"
                              _hover={{ bg: "red.600" }}
                              onClick={() => {
                                setDeleteId(task.id);
                                setIsDeleteModalOpen(true);
                              }}
                            />
                          </Flex>
                        </Flex>
                      </Box>
                    ))
                  )}
                </VStack>
              </VStack>
            </Container>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px" borderColor="gray.700" py={4}>
            <Container maxW="container.md">
              <Flex justify="flex-end">
                <Button
                  variant="outline"
                  color="white"
                  borderColor="gray.600"
                  onClick={handleClose}
                  _hover={{ bg: "gray.700" }}
                  borderRadius="md"
                  px={6}
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
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
        <ModalContent bg="gray.800" color="white" borderRadius="lg">
          <ModalHeader fontSize="lg" fontWeight="bold" color="teal.300">
            Delete Task
          </ModalHeader>
          <ModalCloseButton color="gray.300" />
          <ModalBody>
            <Text fontSize="md" color="gray.200">
              Are you sure you want to delete this task?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              color="white"
              borderColor="gray.600"
              mr={3}
              onClick={() => setIsDeleteModalOpen(false)}
              _hover={{ bg: "gray.700" }}
              borderRadius="md"
            >
              Cancel
            </Button>
            <Button
              bg="red.500"
              color="white"
              _hover={{ bg: "red.600" }}
              onClick={handleDeleteTask}
              borderRadius="md"
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TaskManager;
