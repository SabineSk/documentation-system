//Backend fails
//palaiž Express serveri
//pieslēdz middleware
//pieslēdz routes
//pieslēdz MongoDB
//sāk klausīties portu


require('dotenv').config();
const bcrypt = require('bcrypt');
const createUserIfNotExists = require("./seeds/users");

const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');

console.log(process.env.MONGO_URI);

const app = express()
const port = 3000

app.use(cors());
app.use(express.json());

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  //atrast lietotāju datubāzē pēc username
  //ja lietotājs nav atrasts, atgriezt kļūdu
  //ja lietotājs ir atrasts, salīdzināt paroli ar datubāzē saglabāto hash paroli
  //ja parole nesakrīt, atgriezt kļūdu
  //ja parole sakrīt, atgriezt veiksmīgu atbildi ar lietotāja informāciju (piemēram, username un role)
  console.log(username, password);

  console.log(req.body.username);

  res.json({ message: "Login successful", username });
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
