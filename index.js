const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 3000;


// middle ware 
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!p-10 my name is jayed!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

