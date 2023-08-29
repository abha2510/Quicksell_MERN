import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box, 
  Text, 
  Flex, 
  Image,
  VStack,
  useBreakpointValue,
  useToast,
  Button,
  FormControl,
  FormLabel,
  Input
} from '@chakra-ui/react';

function ProductDetail() {
    const authToken = localStorage.getItem("authToken");
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1); 
    const { id } = useParams();
    const imageSize = useBreakpointValue({ base: "100%", sm: "80%", md: "60%", lg: "50%", xl: "60%" });
    const toast = useToast();

  useEffect(() => {
    async function fetchProductDetail() {
      try {
        const response = await axios.get(`https://wild-gold-beetle-vest.cyclic.cloud/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    fetchProductDetail();
  }, [id]);

  const placeOrder = async () => {
    try {
      const response = await axios.post('https://wild-gold-beetle-vest.cyclic.cloud/users/place-order', {
        products: [{
            productId: id
          }]
        }, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
      });

      toast({
        title: "Order placed successfully!",
        description: response.data.msg,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error placing order",
        description: error.response?.data?.message || "An error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
};



  if (!product) {
    return <Text>Loading...</Text>;
  }

  return (
    <Flex direction={{ base: 'column', md: 'row' }} justifyContent="center" alignItems="center" height="100vh" p={4}>
      <Image src={product.image} alt={product.title} boxSize={imageSize} borderRadius="md"  mb={{ base: 4, md: 0 }} mr={{ md: 6 }}/>
      
      <VStack spacing={4} align="start">
        <Text fontSize="2xl" fontWeight="bold">{product.title}</Text>
        <Text>{product.description}</Text>
        <Box>
          <Text fontSize="xl" fontWeight="semibold" color="blue.500">${product.price}</Text>
        </Box>
        <Box>
          <Text fontSize="md" fontWeight="medium">Location: {product.location}</Text>
        </Box>
        <FormControl>
        <FormLabel>Quantity</FormLabel>
        <Input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
      </FormControl>
        <Button colorScheme="blue" onClick={placeOrder}>
        Place Order
      </Button>
      </VStack>
    </Flex>
  );
}

export default ProductDetail;
