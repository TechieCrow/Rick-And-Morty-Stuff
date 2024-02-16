const express = require('express');
const router = express.Router();

let fetch;

(async () => {
    if (!fetch) {
        fetch = (await import('node-fetch')).default;
    }
})();

router.get('/episode', async (req, res) => {
    try {
        const episodeId = Math.floor(Math.random() * 51) + 1;
        const episodeResponse = await fetch(`https://rickandmortyapi.com/api/episode/${episodeId}`);
        const episode = await episodeResponse.json();

        if (episode.characters.length > 0) {
            const charactersPromise = episode.characters.map(characterUrl => fetch(characterUrl).then(res => res.json()));
            const characters = await Promise.all(charactersPromise);
            episode.characterNames = characters.map(character => character.name);
        } else {
            episode.characterNames = ['No known characters'];
        }

        res.json(episode);
    } catch (error) {
        console.error('Error fetching episode:', error);
        res.status(500).send('An error occurred while fetching a random episode.');
    }
});

module.exports = router;
