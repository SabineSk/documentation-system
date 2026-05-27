require('dotenv').config();

const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const createUserIfNotExists = require("./seeds/users");
const authRoutes = require("./routes/auth");
const meRoutes = require("./routes/me");
const userRoutes = require("./routes/users");
const getAllUsers = require ('./routes/users')
console.log(process.env.MONGO_URI);


const app = express()
const port = 3000

app.use(cookieParser())
app.use(cors());
// Middleware to parse JSON request bodies (important for APIs)
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", meRoutes);
app.use("/api/users", userRoutes);


console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await createUserIfNotExists();
  })
  .catch((error) => {
    console.log(error);
  });


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





