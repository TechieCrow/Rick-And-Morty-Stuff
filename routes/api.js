// routes/api.js
const express = require('express');
const { getCharacter } = require('rickmortyapi');
const router = express.Router();

router.get('/character', async (req, res) => {
    try {
        const characterId = Math.floor(Math.random() * 826) + 1;
        const response = await getCharacter(characterId);
        const character = response.data; // Adjust based on the actual structure

        res.json(character); // Send character data as JSON
    } catch (error) {
        console.error('Error fetching character:', error);
        res.status(500).send('An error occurred while fetching a random character.');
    }
});

module.exports = router;
