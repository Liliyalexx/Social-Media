const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to the Visionary App!');
  });
  
app.listen(3000, () => {
  console.log(`Listening on port ${PORT}`);
});
