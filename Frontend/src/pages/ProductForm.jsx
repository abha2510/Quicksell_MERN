import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Input,
  Text,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  useBreakpointValue
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
function ProductForm() {
  const boxWidth = useBreakpointValue({ base: "90%", md: "70%", lg: "40%" });
  const authToken = localStorage.getItem("authToken");
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    brand: "",
    price: "",
    image: "",
    location: "",
  });
  
  const navigate = useNavigate();
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "price") {
        setProductData((prevData) => ({
            ...prevData,
            [name]: value ? parseFloat(value) : "", 
        }));
    } else {
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    }
};

  const submitProduct = async () => {
    try {
      const response = await axios.post(
        "https://wild-gold-beetle-vest.cyclic.cloud/products",
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );   
      toast({
        title: "Success",
        description: response.data.msg,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      navigate("/allproducts");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error adding product.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  return (
    <Box
    p={6}
    boxShadow="lg"
    rounded="md"
    width={boxWidth} 
    margin="auto"
    bg={"white"}
  >
      <Text fontSize="2xl" mb={5}>
        Add a New Product
      </Text>

      <FormControl mb={4}>
        <FormLabel>Title</FormLabel>
        <Input
          name="title"
          value={productData.title}
          onChange={handleInputChange}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Description</FormLabel>
        <Textarea
          name="description"
          value={productData.description}
          onChange={handleInputChange}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Brand</FormLabel>
        <Input
          name="brand"
          value={productData.brand}
          onChange={handleInputChange}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Price</FormLabel>
        <Input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleInputChange}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Image URL</FormLabel>
        <Input
          name="image"
          value={productData.image}
          onChange={handleInputChange}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Location</FormLabel>
        <Input
          name="location"
          value={productData.location}
          onChange={handleInputChange}
        />
      </FormControl>

      <Button colorScheme="blue" onClick={submitProduct}>
        Add Product
      </Button>
    </Box>
  );
}

export default ProductForm;
