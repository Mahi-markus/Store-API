const Product = require("../models/product");

const getAllProductStatic = async (req, res) => {
  // throw new Error("testing async errors");

  const search = "ab";

  const products = await Product.find({ price: { $gt: 100 } })
    .select("name price")
    .sort("price");
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProduct = async (req, res) => {
  try {
    const { featured, company, name, sort, field, numericFilters } = req.query;

    // Initialize the query object to store MongoDB filters
    const queryObject = {};

    // Initialize the result query
    let result = Product.find(queryObject);

    // Filter for 'featured' products
    if (featured) {
      queryObject.featured = featured === "true";
    }

    // Filter by 'company'
    if (company) {
      queryObject.company = company;
    }

    // Filter by 'name' with a case-insensitive regular expression
    if (name) {
      queryObject.name = { $regex: name, $options: "i" };
    }

    // Apply sorting if the 'sort' query parameter is provided
    if (sort) {
      const sortList = sort.split(",").join(" ");
      result = result.sort(sortList);
    } else {
      result = result.sort("createdAt"); // Sort by creation date if no sort parameter is provided
    }

    // Apply field selection if the 'field' query parameter is provided
    if (field) {
      const fieldsList = field.split(",").join(" ");
      result = result.select(fieldsList);
    }

    // Handle pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    // Handle numeric filters
    if (numericFilters) {
      const operatorMap = {
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
      };

      // Regular expression to match operators in numeric filters
      const regEx = /\b(<|>|>=|=|<|<=)\b/g;

      // Replace operators with MongoDB operators and split the filters
      const filters = numericFilters
        .replace(regEx, (match) => `-${operatorMap[match]}-`)
        .split(",");

      // Valid fields for numeric filters
      const options = ["price", "rating"];

      // Build the query object for numeric filters
      filters.forEach((item) => {
        const [field, operator, value] = item.split("-");
        if (options.includes(field)) {
          queryObject[field] = { [operator]: Number(value) };
        }
      });
    }

    console.log(queryObject);

    // Execute the query with the built query object
    const products = await result.find(queryObject);

    // Send the response with the products and the number of hits
    res.status(200).json({ products, nbHits: products.length });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const createProduct = async (req, res) => {
  productget = await Product.create(req.body);

  res.status(201).json({ productget });
};

module.exports = {
  getAllProduct,
  getAllProductStatic,
  createProduct,
};
