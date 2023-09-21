import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate} from "react-router-dom";

function Signup() {
  const navigate=useNavigate()
  const [userType, setUserType] = useState("buyer");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phoneNumber: "",
  });
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.post(
        `https://wild-gold-beetle-vest.cyclic.cloud/users/signup/${userType}`,
        formData
      );
     // console.log(response, formData);
      if (response.status === 201) {
        toast({
          title: `${
            userType.charAt(0).toUpperCase() + userType.slice(1)
          } saved successfully.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      navigate("/login");
      localStorage.setItem("userType", JSON.stringify(userType));
    }catch (error) {
      let errorMessage = "An error occurred.";
      if (error.response && error.response.data) {
        errorMessage = error.response.data;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
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
        <ButtonGroup isAttached mb={10}>
          <Button
            padding={7}
            onClick={() => setUserType("buyer")}
            colorScheme={userType === "buyer" ? "blue" : "gray"}
          >
            Buyer
          </Button>
          <Button
            padding={7}
            onClick={() => setUserType("seller")}
            colorScheme={userType === "seller" ? "blue" : "gray"}
          >
            Seller
          </Button>
        </ButtonGroup>
        {userType && (
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
            <FormControl id="phoneNumber" isRequired mt={4}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </FormControl>
            <Button
              mt={4}
              type="submit"
              bg="#3182ce"
              color={"white"}
              _hover={{
                color: "#3182ce",
                backgroundColor: "white",
                border: "1px solid #3182ce",
              }}
            >
              Sign Up as {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </Button>
            <br />
            <br />
            <Link to="/login" textDecoration={"underline"} color={"blue"}>
              <Text textDecoration={"underline"}>Already have an account?</Text>
            </Link>
            <br />
            <Link to="/login">
              <Text textDecoration={"underline"}>Are you Admin?</Text>
            </Link>
          </form>
        )}
      </Box>
    </Box>
  );
}

export default Signup;
