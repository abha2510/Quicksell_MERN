const express = require("express");
const { connection } = require("./db");
require("dotenv").config();
const { UserRouter } = require("./router/User.Router");
const cors = require("cors");
const { ProductRouter } = require("./router/Product.Router");
const { AdminRouter } = require("./router/Admin.Router");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Welcome to Abha's Channel!");
});

app.use("/users", UserRouter);
app.use("/products",ProductRouter);
app.use("/orders",UserRouter);
app.use("/admin",AdminRouter);


app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to the DataBase!!!");
  } catch (err) {
    console.log("Data connection Failed");
  }
  console.log("Port is Running on port", process.env.port);
});
