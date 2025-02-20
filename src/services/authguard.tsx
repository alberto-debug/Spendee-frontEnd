import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";

const AuthGuard = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authToken = sessionStorage.getItem("auth-token");
    setIsAuthenticated(!!authToken);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="gray.100">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AuthGuard;
