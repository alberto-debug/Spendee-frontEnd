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
  Checkbox,
  FormLabel,
  FormControl,
  useBreakpointValue,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import {
  FaDownload,
  FaUpload,
  FaTrash,
  FaCheck,
  FaClock,
  FaBook,
  FaPlus,
} from "react-icons/fa"; // Import icons
import { format, parse } from "date-fns"; // Import date-fns for date formatting

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string; // Add dueDate field
  status: string;
}

const TaskManager: React.FC = () => {
  const toast = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "", // Add dueDate field
    status: "ONGOING",
  });
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // State for fetching tasks
  const [isOpen, setIsOpen] = useState(false); // State to control the drawer
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete modal
  const [deleteId, setDeleteId] = useState<number | null>(null); // State for the task ID to be deleted

  const fetchTasks = async () => {
    setIsFetching(true);
    try {
      const token = sessionStorage.getItem("auth-token");
      const response = await axios.get<Task[]>(
        "http://localhost:8080/tasks/user",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        "http://localhost:8080/tasks/add",
        newTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

      const response = await axios.patch(
        `http://localhost:8080/tasks/${taskId}/status?newStatus=${newStatus}`,
        null, // No body needed
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
      await axios.delete(`http://localhost:8080/tasks/task/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        bg="black"
        border="1px solid #4a5568"
        color="white"
        borderRadius="10px"
        _hover={{ bg: "#374151" }}
        _active={{ bg: "#4a5568" }}
        onClick={handleOpen}
        leftIcon={
          <Icon
            as={FaBook}
            color="blue.500"
            boxSize={{ base: "16px", md: "20px", lg: "24px" }}
          />
        }
        size="lg"
        height={{ base: "60px", md: "75px", lg: "90px" }}
        width={{ base: "100px", md: "115px", lg: "130px" }}
        fontSize={{ base: "12px", md: "14px", lg: "16px" }}
      >
        Task
      </Button>

      {/* TaskManager Drawer */}
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={handleClose}
        size="md" // Adjusted size to 'md' for better fit
      >
        <DrawerOverlay />
        <DrawerContent
          bg="#282c34"
          color="white"
          borderRadius="10px"
          boxShadow="lg"
          maxH="50vh" // Limit height to 50% of viewport height
          mx="auto" // Center horizontally
          w={drawerWidth} // Adjust width responsively
        >
          <DrawerCloseButton color="white" />
          <DrawerHeader borderBottomWidth="1px" borderColor="#4a5568">
            <Heading size="lg" color="white">
              Task Manager
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            <Container maxW="container.lg">
              <VStack spacing={4} align="stretch">
                <Button
                  colorScheme="blue"
                  onClick={() => setIsAddTaskOpen(true)}
                  mb={4}
                  leftIcon={<Icon as={FaPlus} color="white" />}
                  size={{ base: "sm", md: "lg" }} // Responsive size
                  borderRadius="full"
                  _hover={{
                    bg: "blue.600",
                    transform: "scale(1.05)",
                    transition: "all 0.2s ease-in-out",
                  }}
                  _active={{
                    bg: "blue.700",
                    transform: "scale(0.95)",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  Add Task
                </Button>
                {isAddTaskOpen && (
                  <Drawer
                    isOpen={isAddTaskOpen}
                    placement="bottom"
                    onClose={() => setIsAddTaskOpen(false)}
                    size="md"
                  >
                    <DrawerOverlay />
                    <DrawerContent
                      bg="#282c34"
                      color="white"
                      borderRadius="10px"
                      boxShadow="lg"
                      maxH="50vh" // Limit height to 50% of viewport height
                      mx="auto" // Center horizontally
                      w={drawerWidth} // Adjust width responsively
                    >
                      <DrawerCloseButton color="white" />
                      <DrawerHeader
                        borderBottomWidth="1px"
                        borderColor="#4a5568"
                      >
                        <Heading size="lg" color="white">
                          Add Task
                        </Heading>
                      </DrawerHeader>
                      <DrawerBody>
                        <VStack spacing={4} align="stretch">
                          <FormControl>
                            <FormLabel color="white">Title</FormLabel>
                            <Input
                              placeholder="Title"
                              value={newTask.title}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  title: e.target.value,
                                })
                              }
                              borderColor="#4a5568"
                              _hover={{ borderColor: "#374151" }}
                              _focus={{ borderColor: "#282c34" }}
                              color="white"
                              fontSize={["sm", "md", "lg"]}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel color="white">Description</FormLabel>
                            <Input
                              placeholder="Description"
                              value={newTask.description}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  description: e.target.value,
                                })
                              }
                              borderColor="#4a5568"
                              _hover={{ borderColor: "#374151" }}
                              _focus={{ borderColor: "#282c34" }}
                              color="white"
                              fontSize={["sm", "md", "lg"]}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel color="white">Due Date</FormLabel>
                            <Input
                              type="date"
                              value={newTask.dueDate}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  dueDate: e.target.value,
                                })
                              }
                              borderColor="#4a5568"
                              _hover={{ borderColor: "#374151" }}
                              _focus={{ borderColor: "#282c34" }}
                              color="white"
                              fontSize={["sm", "md", "lg"]}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel color="white">Status</FormLabel>
                            <Select
                              value={newTask.status}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  status: e.target.value,
                                })
                              }
                              borderColor="#4a5568"
                              _hover={{ borderColor: "#374151" }}
                              _focus={{ borderColor: "#282c34" }}
                              color="white"
                              fontSize={["sm", "md", "lg"]}
                            >
                              <option value="ONGOING">Ongoing</option>
                              <option value="DONE">Done</option>
                              <option value="DELAYED">Delayed</option>
                            </Select>
                          </FormControl>
                        </VStack>
                      </DrawerBody>
                      <DrawerFooter borderTopWidth="1px" borderColor="#4a5568">
                        <Button
                          variant="outline"
                          color="white"
                          mr={3}
                          onClick={() => setIsAddTaskOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={handleAddTask}>
                          Add Task
                        </Button>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                )}
                <VStack spacing={4} align="stretch">
                  {isFetching ? (
                    <Spinner size="lg" color="blue.500" />
                  ) : (
                    tasks.map((task) => (
                      <Box
                        key={task.id}
                        p={2} // Reduced padding
                        borderRadius="md"
                        bg="#374151"
                        border="1px solid"
                        borderColor="#4a5568"
                      >
                        <Flex justify="space-between" align="center">
                          <Box>
                            <Text fontWeight="bold" color="white" fontSize="sm">
                              {task.title}
                            </Text>
                            <Text color="#a0aec0" fontSize="xs">
                              {task.description}
                            </Text>
                            <Text color="#a0aec0" fontSize="xs">
                              Due Date:{" "}
                              {format(new Date(task.dueDate), "yyyy-MM-dd")}
                            </Text>
                            <Text
                              color={
                                task.status === "DONE"
                                  ? "green.500"
                                  : task.status === "DELAYED"
                                    ? "red.500"
                                    : "blue.500"
                              }
                              fontWeight="bold"
                              fontSize="xs"
                            >
                              Status: {task.status}
                            </Text>
                          </Box>
                          <Flex align="center">
                            <Select
                              value={task.status}
                              onChange={(e) =>
                                handleStatusChange(task.id, e.target.value)
                              }
                              borderColor="#4a5568"
                              _hover={{ borderColor: "#374151" }}
                              _focus={{ borderColor: "#282c34" }}
                              color="white"
                              fontSize="xs"
                            >
                              <option value="ONGOING">Ongoing</option>
                              <option value="DONE">Done</option>
                              <option value="DELAYED">Delayed</option>
                            </Select>
                            <IconButton
                              aria-label="Delete task"
                              icon={<Icon as={FaTrash} />}
                              variant="ghost"
                              colorScheme="red"
                              size="sm"
                              ml={2}
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
          <DrawerFooter borderTopWidth="1px" borderColor="#4a5568">
            <Container maxW="container.lg">
              <Flex justify="flex-end">
                <Button
                  variant="outline"
                  color="white"
                  mr={3}
                  onClick={handleClose}
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
        <ModalContent bg="#282c34" color="white">
          <ModalHeader>Delete Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this task?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteTask}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TaskManager;
