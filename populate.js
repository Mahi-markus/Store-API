require("dotenv").config();

const productDB = require("./db/connect");

const Product = require("./models/product");

const jsonProduct = require("./products.json");

const start = async () => {
  try {
    await productDB(process.env.MONGO_URI);
    await Product.deleteMany();
    await Product.create(jsonProduct);
    console.log("success!!");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
