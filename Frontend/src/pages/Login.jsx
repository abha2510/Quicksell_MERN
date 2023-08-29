import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import {  Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://wild-gold-beetle-vest.cyclic.cloud/users/login`,
        formData
      );

      if (response.data.token) {
        // Store the token in local storage or context for subsequent API calls
        localStorage.setItem("authToken", response.data.token);
        toast({
          title: response.data.msg,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Optionally navigate to another page using react-router
      }
      localStorage.setItem("username", JSON.stringify(formData.username));
      navigate("/allproducts")
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      backgroundColor={"#e6f6f8"}
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        w={["90%", "80%", "60%", "30%"]}
        textAlign="center"
        boxShadow={"lg"}
        padding={20}
        bg={"white"}
      >
        <form onSubmit={handleSubmit}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </FormControl>
          <FormControl id="password" isRequired mt={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </FormControl>
          <Button mt={4} type="submit" colorScheme="blue">
            Login
          </Button>
          <br />
          <br />
          <Link to="/register">
            <Text textDecoration={"underline"}>Create a new Account</Text>
          </Link>
        </form>
      </Box>
    </Box>
  );
}

export default Login;
