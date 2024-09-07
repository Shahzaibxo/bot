const express = require('express');

function keepAlive(app) {
  const server = express();
  
  server.all('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.write('<link href="https://fonts.googleapis.com/css?family=Roboto Condensed" rel="stylesheet"> <style> body {font-family: "Roboto Condensed";font-size: 22px;} <p>Hosting Active</p>');
    res.end();
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server is online on port ${port}`);
  });

  // Use the app for handling actual bot requests
  server.use((req, res) => {
    app(req, res);
  });
}

module.exports = keepAlive;
