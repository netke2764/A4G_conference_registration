import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ----- MongoDB Connect -----
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ----- Mongoose Schema -----
const RegistrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  registration_type: String,
  company: String,
  phone: String,
  created_at: { type: Date, default: Date.now },
});

const Registration = mongoose.model("Registration", RegistrationSchema);

// ----- API Routes -----
app.post("/api/register", async (req, res) => {
  try {
    const data = await Registration.create(req.body);
    res.json({ success: true, data });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

// ----- Start Server -----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
