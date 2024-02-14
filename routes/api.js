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

router.get('/location', async (req, res) => {
  try {
    const locationId = Math.floor(Math.random() * 126) + 1;
    const locationResponse = await fetch(`https://rickandmortyapi.com/api/location/${locationId}`);
    const location = await locationResponse.json();

    // Fetch residents' details if they exist
    if (location.residents.length > 0) {
      const residentsPromises = location.residents.map(url => fetch(url).then(res => res.json()));
      const residents = await Promise.all(residentsPromises);
      // Map the full resident data to just the names, if needed
      location.residentNames = residents.map(resident => resident.name);
    } else {
      // Handle case with no residents
      location.residentNames = ['No known residents'];
    }

    res.json(location);
  } catch (error) {
    console.error('Error fetching location:', error);
    res.status(500).send('An error occurred while fetching a random location.');
  }
});

router.get('/episode', async (req, res) => {
  try {
    const episodeId = Math.floor(Math.random() * 51) + 1; // Adjust if more episodes are added
    const episodeResponse = await fetch(`https://rickandmortyapi.com/api/episode/${episodeId}`);
    const episode = await episodeResponse.json();

    const charactersPromise = episode.characters.map(async (characterUrl) => {
      const characterResponse = await fetch(characterUrl);
      return characterResponse.json();
    });

    const characters = await Promise.all(charactersPromise);
    const characterNames = characters.map(character => character.name);

    const episodeWithCharacters = { ...episode, characterNames };

    res.json(episodeWithCharacters);
  } catch (error) {
    console.error('Error fetching episode:', error);
    res.status(500).send('An error occurred while fetching a random episode.');
  }
});

module.exports = router;
