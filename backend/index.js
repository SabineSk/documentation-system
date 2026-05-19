require('dotenv').config();
const bcrypt = require('bcrypt');
const createUserIfNotExists = require("./seeds/users");

const User = require("./models/user.model");
const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');

console.log(process.env.MONGO_URI);

const app = express()
const port = 3000

app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
//the login route waits for User.findOne(...) and returns a response only once, inside the try/catch
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ message: "Invalid password" });
    }
    //TODO: Labot,jo šobrīd atriež Login successful arī ja user not found
    if (user && passwordMatch) {
      // Šeit varētu ģenerēt un atgriezt JWT tokenu, ja nepieciešams
      
      console.log(username, password);
      console.log(req.body.username);

      return res.json({ message: "Login successful, username and password correct", username: user.username, role: user.role });
  }
    
  } catch (error) {
    console.error(error);
    return res.json({ message: "Error occurred while logging in" });
  }
});

app.get('/api/documents', (req, res) => {
  res.json([
    { id: 1, title: 'Document title', description: 'Short description...' },
    { id: 2, title: 'Another document', description: 'Short description...' }
  ]);
});

console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log(error);
  });

createUserIfNotExists();


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
