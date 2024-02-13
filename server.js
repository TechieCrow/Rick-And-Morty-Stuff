const express = require('express');
const apiRoutes = require('./routes/api');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});