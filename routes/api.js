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

        const locationResponse = await fetch(character.location.url);
        const location = await locationResponse.json();
        character.locationName = location.name;

        const episodesPromise = character.episode.map(async (episodeUrl) => {
            const episodeResponse = await fetch(episodeUrl);
            return episodeResponse.json();
        });
        const episodes = await Promise.all(episodesPromise);

        const episodeNames = episodes.map(episode => episode.name);

        const characterWithEpisodes = { ...character, episodes: episodeNames };

        res.json(characterWithEpisodes);
    } catch (error) {
        console.error('Error fetching character:', error);
        res.status(500).send('An error occurred while fetching a random character.');
    }
});

module.exports = router;
