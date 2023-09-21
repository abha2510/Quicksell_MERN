import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Grid,
  Image,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Input, Select, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "../Alert.css";
const MotionBox = motion(Box);

function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("");
  // const [selectedProducts, setSelectedProducts] = useState({});
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const user = JSON.parse(localStorage.getItem("userType"));

  async function fetchProducts() {
    try {
      const response = await axios.get(
        "https://wild-gold-beetle-vest.cyclic.cloud/products",
        {
          params: {
            search,
            brand,
            location,
            sort,
          },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [search, brand, location, sort]);

  const handleButtonClick = (id) => {
    if (user==="buyer") {
      navigate(`/product/${id}`);
    } else {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 5000); // Alert will hide after 5 seconds
    }
  };
  const inputFocusBorderColor = useColorModeValue("blue.500", "blue.300");
  const btnHoverBg = useColorModeValue("blue.600", "blue.400");

  return (
    <>
       <Flex
      as="nav"
      mb={6}
      flexDirection={["column", "column", "row", "row"]}
      alignItems={["center", "center", "stretch", "stretch"]}
      justifyContent="space-between"
      bg="white"
      p={6}
      spacing={4} 
       mt={8}
      // position={"fixed"}
      // width={"100%"}
      // zIndex={2}
    >
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        focusBorderColor={inputFocusBorderColor}
        size="md"
        width={["100%", "100%", "25%", "20%"]}
        
      />
      <Input
        placeholder="Brand..."
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        focusBorderColor={inputFocusBorderColor}
        size="md"
        width={["100%", "100%", "20%", "15%"]}
      />
      <Input
        placeholder="Location..."
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        focusBorderColor={inputFocusBorderColor}
        size="md"
        width={["100%", "100%", "20%", "15%"]}
      />
      <Select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        size="md"
        width={["100%", "100%", "20%", "15%"]}
      >
        <option value="">Sort by...</option>
        <option value="price">Price (Low to High)</option>
        <option value="-price">Price (High to Low)</option>
      </Select>
      <Button
        onClick={() => fetchProducts()}
        p={5}
        colorScheme="blue"
        _hover={{ bg: btnHoverBg }}
        width={["100%", "100%", "auto", "auto"]}
      >
        Search
      </Button>
    </Flex>
      <Grid
        templateColumns={[
          "1fr",
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
          "repeat(4, 1fr)",
        ]}
        gap={6}
      >
        {products.map((product) => (
          <MotionBox
            key={product._id}
            boxShadow="lg"
            p={5}
            rounded="md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            backgroundColor={"white"}
            borderRadius={20}
            // mt={[80,80,40]}
          >
            <Image src={product.image} alt={product.title} rounded="md" />
            <Text fontWeight="bold" mt={4}>
              <span>Title : </span>{product.title}
            </Text>
            <Text mt={2}><span>Description : </span>{product.description}</Text>
            <Text mt={2} color="blue.500">
            <span>Price : </span>${product.price}
            </Text>
            <Text mt={2}><span>Location : </span>{product.location}</Text>
            <Button
              mt={2}
              colorScheme="orange"
              onClick={() => handleButtonClick(product._id)}
            >
              View Product
            </Button>

            {showAlert && (
              <div className="alert">
                Only buyers can view this product detail.
              </div>
            )}
          </MotionBox>
        ))}
      </Grid>
    </>
  );
}

export { ProductList };
