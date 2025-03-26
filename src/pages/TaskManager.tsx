import React, { useState, useEffect, useCallback } from "react";
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
  HStack,
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

  const fetchTasks = useCallback(async () => {
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
  }, [toast]);

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
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task,
        ),
      );
      toast({
        title: "Task updated!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating task",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(error);
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
      setTasks(tasks.filter((task) => task.id !== deleteId));
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
  }, [fetchTasks]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const drawerPlacement = useBreakpointValue<"bottom" | "right">(
    { base: "bottom", md: "right" },
    { fallback: "right" },
  );
  const drawerWidth = useBreakpointValue({
    base: "100%",
    md: "70%",
    lg: "50%",
  });
  const drawerMaxHeight = useBreakpointValue({ base: "80vh", md: "100vh" });

  return (
    <>
      <Button
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        color="white"
        borderRadius="12px"
        boxShadow="0 4px 15px rgba(102, 126, 234, 0.4)"
        _hover={{
          bg: "linear-gradient(135deg, #5a6cd8 0%, #6a3e92 100%)",
          transform: "translateY(-2px)",
        }}
        _active={{
          bg: "linear-gradient(135deg, #4e5ec6 0%, #5e3482 100%)",
          transform: "translateY(0)",
        }}
        onClick={handleOpen}
        leftIcon={<Icon as={FaBook} boxSize={5} />}
        size="lg"
        px={6}
        py={7}
        fontSize={{ base: "md", md: "lg" }}
        transition="all 0.3s ease"
      >
        Tasks
      </Button>

      <Drawer isOpen={isOpen} placement={drawerPlacement} onClose={handleClose}>
        <DrawerOverlay bg="rgba(0, 0, 0, 0.4)" />
        <DrawerContent
          bg="#1a202c"
          color="white"
          borderRadius={
            drawerPlacement === "bottom" ? "16px 16px 0 0" : "16px 0 0 16px"
          }
          w={drawerWidth}
          maxW={drawerPlacement === "right" ? "600px" : "100%"}
          maxH={drawerMaxHeight}
          zIndex={1200}
        >
          <DrawerCloseButton color="white" size="lg" mt={2} />
          <DrawerHeader
            py={6}
            px={8}
            borderBottom="1px solid"
            borderColor="gray.700"
          >
            <Heading size="lg" fontWeight="extrabold" letterSpacing="tight">
              Task Manager
            </Heading>
          </DrawerHeader>
          <DrawerBody px={8} py={6} overflowY="auto">
            <VStack spacing={6} align="stretch">
              <Button
                bg="linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)"
                color="white"
                borderRadius="12px"
                boxShadow="0 4px 15px rgba(0, 198, 255, 0.3)"
                _hover={{
                  bg: "linear-gradient(135deg, #00b4e6 0%, #0066e6 100%)",
                  transform: "translateY(-2px)",
                }}
                _active={{
                  bg: "linear-gradient(135deg, #00a3cc 0%, #0059cc 100%)",
                }}
                onClick={() => setIsAddTaskOpen(true)}
                leftIcon={<Icon as={FaPlus} />}
                size="lg"
                fontSize="md"
                py={6}
                transition="all 0.3s ease"
              >
                Add New Task
              </Button>

              <Drawer
                isOpen={isAddTaskOpen}
                placement={drawerPlacement}
                onClose={() => setIsAddTaskOpen(false)}
              >
                <DrawerOverlay bg="rgba(0, 0, 0, 0.4)" />
                <DrawerContent
                  bg="#1a202c"
                  color="white"
                  borderRadius={
                    drawerPlacement === "bottom"
                      ? "16px 16px 0 0"
                      : "16px 0 0 16px"
                  }
                  maxW={drawerPlacement === "right" ? "450px" : "100%"}
                  maxH={drawerMaxHeight}
                  zIndex={1300}
                >
                  <DrawerCloseButton color="white" size="lg" mt={2} />
                  <DrawerHeader
                    py={6}
                    px={6}
                    borderBottom="1px solid"
                    borderColor="gray.700"
                  >
                    <Heading size="md" fontWeight="bold">
                      Create Task
                    </Heading>
                  </DrawerHeader>
                  <DrawerBody px={6} py={6} overflow="visible">
                    <VStack spacing={5} align="stretch">
                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.300"
                          mb={1}
                        >
                          Task Title
                        </FormLabel>
                        <Input
                          placeholder="Enter task title"
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                          }
                          bg="gray.800"
                          border="1px solid"
                          borderColor="gray.600"
                          borderRadius="8px"
                          _hover={{ borderColor: "gray.500" }}
                          _focus={{ bg: "gray.700", borderColor: "#667eea" }}
                          color="white"
                          fontSize="md"
                          py={5}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.300"
                          mb={1}
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
                          bg="gray.800"
                          border="1px solid"
                          borderColor="gray.600"
                          borderRadius="8px"
                          _hover={{ borderColor: "gray.500" }}
                          _focus={{ bg: "gray.700", borderColor: "#667eea" }}
                          color="white"
                          fontSize="md"
                          py={5}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.300"
                          mb={1}
                        >
                          Due Date
                        </FormLabel>
                        <Input
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) =>
                            setNewTask({ ...newTask, dueDate: e.target.value })
                          }
                          bg="gray.800"
                          border="1px solid"
                          borderColor="gray.600"
                          borderRadius="8px"
                          _hover={{ borderColor: "gray.500" }}
                          _focus={{ bg: "gray.700", borderColor: "#667eea" }}
                          color="white"
                          fontSize="md"
                          py={5}
                          sx={{
                            "::-webkit-calendar-picker-indicator": {
                              filter: "invert(1)",
                              cursor: "pointer",
                              padding: "8px",
                            },
                            "::-webkit-datetime-edit": {
                              color: "white",
                            },
                          }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.300"
                          mb={1}
                        >
                          Status
                        </FormLabel>
                        <Select
                          value={newTask.status}
                          onChange={(e) =>
                            setNewTask({ ...newTask, status: e.target.value })
                          }
                          bg="gray.800"
                          border="1px solid"
                          borderColor="gray.600"
                          borderRadius="8px"
                          _hover={{ borderColor: "gray.500" }}
                          _focus={{ bg: "gray.700", borderColor: "#667eea" }}
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
                    borderTop="1px solid"
                    borderColor="gray.700"
                    py={4}
                  >
                    <Button
                      variant="outline"
                      colorScheme="gray"
                      color="white"
                      mr={3}
                      onClick={() => setIsAddTaskOpen(false)}
                      borderRadius="8px"
                      _hover={{ bg: "gray.700" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      bg="linear-gradient(135deg, #34d399 0%, #059669 100%)"
                      color="white"
                      _hover={{
                        bg: "linear-gradient(135deg, #2cc084 0%, #048554 100%)",
                      }}
                      onClick={handleAddTask}
                      borderRadius="8px"
                    >
                      Add Task
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>

              {isFetching ? (
                <Flex justify="center" py={10}>
                  <Spinner size="xl" color="#667eea" thickness="4px" />
                </Flex>
              ) : (
                <VStack spacing={4} align="stretch">
                  {tasks.map((task) => (
                    <Box
                      key={task.id}
                      p={4}
                      borderRadius="12px"
                      bg="gray.800"
                      boxShadow="0 4px 12px rgba(0, 0, 0, 0.2)"
                      transition="transform 0.2s ease"
                      _hover={{
                        transform: "translateY(-4px)",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <Flex justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="bold" fontSize="md" color="white">
                            {task.title}
                          </Text>
                          <Text fontSize="sm" color="gray.400">
                            {task.description}
                          </Text>
                          <HStack spacing={2}>
                            <Icon as={FaClock} color="gray.500" boxSize={4} />
                            <Text fontSize="sm" color="gray.500">
                              {format(new Date(task.dueDate), "MMM dd, yyyy")}
                            </Text>
                          </HStack>
                        </VStack>
                        <HStack spacing={3}>
                          <Select
                            value={task.status}
                            onChange={(e) =>
                              handleStatusChange(task.id, e.target.value)
                            }
                            size="sm"
                            bg={
                              task.status === "DONE"
                                ? "green.600"
                                : task.status === "DELAYED"
                                  ? "red.600"
                                  : "blue.600"
                            }
                            color="white"
                            border="none"
                            borderRadius="8px"
                            fontSize="sm"
                            w="120px"
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
                            bg="red.600"
                            color="white"
                            borderRadius="8px"
                            _hover={{ bg: "red.700" }}
                            onClick={() => {
                              setDeleteId(task.id);
                              setIsDeleteModalOpen(true);
                            }}
                          />
                        </HStack>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              )}
            </VStack>
          </DrawerBody>
          <DrawerFooter
            borderTop="1px solid"
            borderColor="gray.700"
            py={4}
            px={8}
          >
            <Button
              variant="outline"
              colorScheme="gray"
              color="white"
              onClick={handleClose}
              borderRadius="8px"
              fontSize="md"
              px={6}
              _hover={{ bg: "gray.700" }}
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <ModalOverlay bg="rgba(0, 0, 0, 0.6)" />
        <ModalContent bg="#1a202c" color="white" borderRadius="12px">
          <ModalHeader fontSize="lg" fontWeight="bold">
            Delete Task
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody>
            <Text fontSize="md">
              Are you sure you want to delete this task?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              colorScheme="gray"
              color="white"
              mr={3}
              onClick={() => setIsDeleteModalOpen(false)}
              borderRadius="8px"
            >
              Cancel
            </Button>
            <Button
              bg="red.600"
              color="white"
              _hover={{ bg: "red.700" }}
              onClick={handleDeleteTask}
              borderRadius="8px"
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
