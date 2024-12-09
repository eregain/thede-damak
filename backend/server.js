const express = require("express");
const cors = require("cors");
const { main } = require("./models/index");
const productRoute = require("./router/product");
const storeRoute = require("./router/store");
const purchaseRoute = require("./router/purchase");
const salesRoute = require("./router/sales");

const User = require("./models/users");
const Product = require("./models/product");

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize the database
(async () => {
  try {
    await main();
    console.log("Database initialization complete");
  } catch (err) {
    console.error("Failed to initialize the database:", err);
    process.exit(1); // Exit the application if the database connection fails
  }
})();

// Middleware to parse JSON
app.use(express.json());

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local frontend for development
      "https://your-frontend.vercel.app", // Deployed frontend on Vercel
    ],
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies or authorization headers
  })
);

// Routes
app.use("/api/store", storeRoute);
app.use("/api/product", productRoute);
app.use("/api/purchase", purchaseRoute);
app.use("/api/sales", salesRoute);

// Authentication APIs
let userAuthCheck = null;

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      userAuthCheck = user;
      res.status(200).send(user);
    } else {
      userAuthCheck = null;
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/login", (req, res) => {
  if (userAuthCheck) {
    res.status(200).send(userAuthCheck);
  } else {
    res.status(401).json({ message: "No user logged in" });
  }
});

// Registration API
app.post("/api/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, imageUrl } =
      req.body;
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      imageUrl,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

// Test API to fetch a product
app.get("/testget", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: "6429979b2e5434138eda1564" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
