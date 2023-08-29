"use client";

import {
  Box,
  Flex,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon} from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BiUser } from "react-icons/bi";
import "./SellButton.css"

const NavLink = (props) => {
  const { children } = props;
  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"#"}
    >
      {children}
    </Box>
  );
};

export default function WithAction() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      let usernameFromLocalStorage = localStorage.getItem("username");
      //console.log(usernameFromLocalStorage);
      if (usernameFromLocalStorage) {
        usernameFromLocalStorage = usernameFromLocalStorage.replace(
          /^'(.*)'$/,
          '"$1"'
        );

        setName(JSON.parse(usernameFromLocalStorage));
      }
    } catch (error) {
      console.error("Error parsing username from localStorage:", error);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `https://wild-gold-beetle-vest.cyclic.cloud/users/logout`
      );
      localStorage.removeItem("authToken");
      localStorage.removeItem('user');
      toast({
        title: response.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Logout failed!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box bg={useColorModeValue("white", "white")} px={4} position={"fixed"} zIndex={2} w={"100%"}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"} >
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Link to="/allproducts">
              <Text
                fontFamily={"cursive"}
                color={"#f03a64"}
                fontWeight={"bold"}
                fontSize={22}
              >
                QUICKSELL
              </Text>
            </Link>
          
          </HStack>
          <Flex alignItems={"center"}>
            <Link to="/addproduct">
              { <Button
                variant={"solid"}
                // colorScheme={"teal"}
                size={"sm"}
                mr={4}
                boxShadow="0px 0px 0px 2px red, 0px 0px 0px 4px blue, 0px 0px 0px 6px green"
                leftIcon={<AddIcon />}
              >
                Sell
              </Button>}
              
              {/* <a class="rainbow-btn" href=""><span> + Sell</span></a> */}
            </Link>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Box
                   width="40px"
                   height="40px"
                   borderRadius="50%"
                   bg="#f03a64"
                   display="flex"
                   alignItems="center"
                   justifyContent="center"
                >
                  {name ? (
                    <Text color={"white"} size="24px">{name.charAt(0)}</Text>
                  ) : (
                    <BiUser color="white" size="20px" />
                  )}
                </Box>
              </MenuButton>
              <MenuList zIndex={99}>
                <Link to="profile">
                  <MenuItem>Account</MenuItem>
                </Link>
                <MenuDivider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>

      <Box p={4}></Box>
    </>
  );
}
