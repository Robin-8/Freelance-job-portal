require("dotenv").config();
const express = require("express");
const connectDb = require("./config/db");
const cors = require("cors");

const clientRoute = require("./routes/clientRoute");
const adminRoute = require("./routes/adminRoute");
const freeLanceRoute = require("./routes/freeLanceRoute");

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json()); 
app.use(express.urlencoded({ extended: false })); 

app.use("/client", clientRoute);
app.use("/admin", adminRoute);
app.use("/freelancer", freeLanceRoute);

const PORT = process.env.PORT || 3000;


connectDb();

app.listen(PORT, () => {
  console.log(`✅ App running on http://localhost:${PORT}`);
});
