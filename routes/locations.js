const express = require('express');
const router = express.Router();

let fetch;

(async () => {
    if (!fetch) {
        fetch = (await import('node-fetch')).default;
    }
})();

router.get('/location', async (req, res) => {
    try {
        const locationId = Math.floor(Math.random() * 126) + 1;
        const locationResponse = await fetch(`https://rickandmortyapi.com/api/location/${locationId}`);
        const location = await locationResponse.json();

        if (location.residents.length > 0) {
            const residentsPromises = location.residents.map(url => fetch(url).then(res => res.json()));
            const residents = await Promise.all(residentsPromises);
            location.residentNames = residents.map(resident => resident.name);
        } else {
            location.residentNames = ['No known residents'];
        }

        res.json(location);
    } catch (error) {
        console.error('Error fetching location:', error);
        res.status(500).send('An error occurred while fetching a random location.');
    }
});

module.exports = router;
