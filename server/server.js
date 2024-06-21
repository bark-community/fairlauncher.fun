const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const cors = require('cors');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // Enable CORS
  server.use(cors());

  // Body parser for handling JSON requests
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // Custom API route example
  server.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    // Handle form submission, e.g., save to database, send email, etc.
    res.json({ success: true, message: 'Form submitted successfully' });
  });

  // Fallback to Next.js request handler for all other routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}).catch((ex) => {
  console.error(ex.stack);
  process.exit(1);
});
