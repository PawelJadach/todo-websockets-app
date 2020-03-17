const express = require('express');

const app = express();
const port = process.env.PORT || 8000;


const server = app.listen(port, () => console.log(`Server start on port ${port}`));

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});