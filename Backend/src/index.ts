import  express from "express";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({status: "ok", message: "Social media app is live"})
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});