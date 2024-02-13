// server.js
const express = require('express');
const apiRoutes = require('./routes/api');

const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files
app.use('/api', apiRoutes); // Use API routes for data fetching

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
