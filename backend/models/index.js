const mongoose = require("mongoose");

async function main() {
  const DB_URI =
    process.env.MONGO_URI ||
    `mongodb+srv://vercel-admin-user:RtSWyalbVeBFiY7R@de-damak.sue7t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

module.exports = { main };
