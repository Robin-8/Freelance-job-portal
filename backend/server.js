const express =require('express')
const connectDb = require('./config/db')
const cors =require('cors')
const clientRoute =require('./routes/clientRoute')
require("dotenv").config();


const app = express()
app.use(cors()) 
app.use(express.json())
express.urlencoded({ extended: false })

app.use('/client',clientRoute)

const PORT = process.env.PORT || 3000

 
connectDb()

app.listen(PORT, () => {
  console.log(`✅ App running on http://localhost:${PORT}`);
});
