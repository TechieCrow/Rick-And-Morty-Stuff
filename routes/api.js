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

    // Check if the character has a known location or not
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
