const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // ✅ Ensure this path is correct

const app = express();

app.use(cors());
app.use(express.json()); // ✅ Required to parse JSON body

connectDB(); // ✅ Ensure DB connection is established

// ✅ Register routes
app.use("/api", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
