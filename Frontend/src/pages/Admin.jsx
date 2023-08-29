import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, 
    Flex, 
    Table, 
    Thead, 
    Tbody, 
    Tr, 
    Th, 
    Td, 
    useColorModeValue,
    Heading,
    Text
} from '@chakra-ui/react';
import { BarChart } from '@toast-ui/react-chart';

function Admin() {
    const [sellers, setSellers] = useState([]);
    const [buyers, setBuyers] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch sellers, buyers, and orders
        const fetchSellers = async () => {
            const response = await axios.get('https://wild-gold-beetle-vest.cyclic.cloud/admin/sellers');
            setSellers(response.data);
        };
        const fetchBuyers = async () => {
            const response = await axios.get('https://wild-gold-beetle-vest.cyclic.cloud/admin/buyers');
            setBuyers(response.data);
        };
        const fetchOrders = async () => {
            const response = await axios.get('https://wild-gold-beetle-vest.cyclic.cloud/admin/orders');
            setOrders(response.data);
        };
        fetchSellers();
        fetchBuyers();
        fetchOrders();
    }, []);

    const tableBg = useColorModeValue('gray.100', 'gray.700');

    return (
        <Flex direction="column" p={5}>
            <Heading mb={5}>Admin Dashboard</Heading>

            {/* Sellers Table */}
            <Box mb={6}>
                <Text fontSize="xl" fontWeight="semibold" mb={4}>Sellers</Text>
                <Table variant="striped" bg={tableBg}>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Phone Number</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {sellers.map(seller => (
                            <Tr key={seller._id}>
                                <Td>{seller.username}</Td>
                                <Td>{seller.phoneNumber}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Buyers Table */}
            <Box mb={6}>
                <Text fontSize="xl" fontWeight="semibold" mb={4}>Buyers</Text>
                <Table variant="striped" bg={tableBg}>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Phone Number</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {buyers.map(buyer => (
                            <Tr key={buyer._id}>
                                <Td>{buyer.username}</Td>
                                <Td>{buyer.phoneNumber}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            {/* Bar Graph for Orders */}
            <Box mb={6}>
                <Text fontSize="xl" fontWeight="semibold" mb={4}>Order Analytics</Text>
                <BarChart 
                    data={{
                        labels: orders.map(order => order.date.date),
                        datasets: [{
                            label: 'Orders',
                            data: orders.map(order => order.totalAmount)
                        }]
                    }}
                />
            </Box>
        </Flex>
    );
}

export default Admin;
