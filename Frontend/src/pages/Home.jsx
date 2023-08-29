import React from "react";
import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import QuickSell from "../assets/QuickSell.png";
import { useNavigate } from "react-router-dom";

const MotionHeading = motion(Heading);

function HomePage() {
  const navigate = useNavigate();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
      mt="-80px"
    >
      <MotionHeading
        fontSize="2xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Image src={QuickSell} zIndex={1} boxShadow="lg" />
        <Flex flexDirection={"column"} mt={"-130px"} zIndex={2}>
          <Button
            mb={5}
            w={"50%"}
            ml={120}
            borderRadius={10}
            boxShadow="lg"
            border={"1px solid #e6f6f8"}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
          <Button
            w={"50%"}
            ml={120}
            borderRadius={10}
            boxShadow="lg"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
        </Flex>
      </MotionHeading>
    </Box>
  );
}

export default HomePage;
