import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Text,
  useToast,
  VStack,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  ModalCloseButton,
  Grid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function UserProfile() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const productsResponse = await axios.get(
          "https://wild-gold-beetle-vest.cyclic.cloud/products/my-products",
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        //console.log(productsResponse);
        setProducts(productsResponse.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch user data";
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchUserProfile();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdateProduct = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const updatedProduct = await axios.patch(
        `https://wild-gold-beetle-vest.cyclic.cloud/products/${selectedProduct._id}`,
        selectedProduct,
        
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          mode: 'cors'
        }
      );
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct.data : product
        )
      );
      window.location.reload(true);
      toast({
        title: "Product Updated",
        description: "Your product was updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setModalOpen(false);
    } catch (error) {
      toast({
        title: "Error updating product",
        description:
          error.response?.data?.message || "Failed to update product.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteProduct = async (productId) => {
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.delete(
        `https://wild-gold-beetle-vest.cyclic.cloud/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== productId)
      );
      toast({
        title: "Product Deleted",
        description: "Your product was deleted successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error deleting product",
        description:
          error.response?.data?.message || "Failed to delete product.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <Box p={6}>
         <Grid
      templateColumns={[
        "1fr",
        "repeat(1, 1fr)",
        "repeat(2, 1fr)",
        "repeat(2, 1fr)",
      ]}
      gap={6}
      p={20}
      
    >
      {products.map((product) => (
        <VStack spacing={4} key={product._id}  bg="white">
          <MotionBox
            p={4}
            borderWidth={1}
            borderRadius="md"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Text fontWeight="bold"><span>Title : </span>{product.title}</Text>
            <Text><span>Brand : </span>{product.brand}</Text>
            <Text><span>Description : </span>{product.description}</Text>
            <Image src={product.image} />
            <Text><span>Price : </span>{product.price}</Text>
            <Button
              colorScheme="teal"
              onClick={() => {
                setSelectedProduct(product);
                setModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              colorScheme="red"
              ml={5}
              onClick={() => handleDeleteProduct(product._id)}
            >
              Delete
            </Button>
          </MotionBox>
        </VStack>
      ))}
    </Grid>


      {/* Modal for editing */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={selectedProduct?.title}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Brand</FormLabel>
              <Input
                name="brand"
                value={selectedProduct?.brand}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={selectedProduct?.description}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>ImageURl</FormLabel>
              <Textarea
                name="image"
                value={selectedProduct?.image}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Price</FormLabel>
              <Textarea
                name="price"
                value={selectedProduct?.price}
                onChange={handleInputChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleUpdateProduct}>
              Update
            </Button>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default UserProfile;
