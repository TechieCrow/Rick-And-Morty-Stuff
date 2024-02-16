const express = require('express');
const router = express.Router();

let fetch;

(async () => {
    if (!fetch) {
        fetch = (await import('node-fetch')).default;
    }
})();

router.get('/character', async (req, res) => {
    try {
        const characterId = Math.floor(Math.random() * 826) + 1;
        const characterResponse = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
        const character = await characterResponse.json();

        if (character.location.url) {
            const locationResponse = await fetch(character.location.url);
            const location = await locationResponse.json();
            character.locationName = location.name;
        } else {
            character.locationName = 'Unknown Location';
        }

        if (character.episode.length > 0) {
            const episodesPromise = character.episode.map(episodeUrl => fetch(episodeUrl).then(res => res.json()));
            const episodes = await Promise.all(episodesPromise);
            character.episodes = episodes.map(episode => episode.name);
        } else {
            character.episodes = ['No known episodes'];
        }

        res.json(character);
    } catch (error) {
        console.error('Error fetching character:', error);
        res.status(500).send('An error occurred while fetching a random character.');
    }
});

module.exports = router;
