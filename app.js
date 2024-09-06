require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");

//using middleware

app.use(express.json());

//get

app.get("/", (req, res) => {
  res.send(
    '<h1>app store api</h1> <a href="/api/v1/products"> go to product</a>'
  );
});

app.use("/api/v1/products", productsRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = 3000;

const start = async () => {
  try {
    app.listen(port, () => console.log(`Server is listening port ${port}...`));
    await connectDB(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
  }
};

start();
