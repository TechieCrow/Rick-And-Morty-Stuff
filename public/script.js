document.addEventListener('DOMContentLoaded', () => {
    const characterDiv = document.getElementById('character');
    const loadingDiv = document.getElementById('loading');
    const loadingText = document.getElementById('loading-text');

    const loadingMessages = [
        "Loading new universe...",
        "Wubba Lubba Dub Dub!",
        "Pickle Rick is getting ready...",
        "The Meeseeks are working on it...",
        "Schwifty loading in progress..."
    ];

    function changeLoadingMessage() {
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        loadingText.textContent = loadingMessages[randomIndex];
    }

    function fetchCharacter() {
    loadingDiv.classList.remove('hidden');
    characterDiv.classList.add('hidden');
    changeLoadingMessage();

    fetch('/api/character')
        .then(response => response.json())
        .then(character => {
            const img = new Image();
            img.src = character.image;
            img.alt = character.name;
            img.style.width = '200px';

            let episodesHtml = '<ul>';
            character.episodes.forEach(episode => {
                episodesHtml += `<li>${episode}</li>`;
            });
            episodesHtml += '</ul>';

            characterDiv.innerHTML = `
                <h1>Random Rick and Morty Character</h1>
                <div id="character-image-container">
                    <img id="character-image" src="${character.image}" alt="${character.name}" style="width:200px;">
                </div>
                <p><strong>Name:</strong> ${character.name}</p>
                <p><strong>Status:</strong> ${character.status}</p>
                <p><strong>Species:</strong> ${character.species}</p>
                <p><strong>Gender:</strong> ${character.gender}</p>
                <p><strong>Last known location:</strong> ${character.locationName}</p>
                <hr>
                <div id="character-episodes-container">
                    <h2>Episodes</h2>
                    ${episodesHtml}
                </div>
            `;

            img.onload = () => {
                loadingDiv.classList.add('hidden');
                characterDiv.classList.remove('hidden');
            };
        })
        .catch(error => {
            console.error('Error fetching character:', error);
            loadingDiv.classList.add('hidden');
            characterDiv.innerHTML = `<p>Failed to load character. Please try again.</p>`;
            characterDiv.classList.remove('hidden');
        });
}
    fetchCharacter();

    document.getElementById('refresh-button').addEventListener('click', fetchCharacter);

    function fetchLocation() {
  loadingDiv.classList.remove('hidden');
  characterDiv.classList.add('hidden');
  changeLoadingMessage();

  fetch('/api/location')
    .then(response => response.json())
    .then(location => {
      let residentsHtml = '<ul>';
      if (location.residentNames && location.residentNames.length > 0) {
        location.residentNames.forEach(residentName => {
          residentsHtml += `<li>${residentName}</li>`;
        });
      } else {
        residentsHtml += '<li>No known residents</li>';
      }
      residentsHtml += '</ul>';

      characterDiv.innerHTML = `
        <h1>Random Location</h1>
        <p><strong>Name:</strong> ${location.name}</p>
        <p><strong>Type:</strong> ${location.type}</p>
        <p><strong>Dimension:</strong> ${location.dimension}</p>
        <hr>
        <h2>Residents</h2>
        ${residentsHtml}
      `;
      loadingDiv.classList.add('hidden');
      characterDiv.classList.remove('hidden');
    })
    .catch(error => {
      console.error('Error fetching location:', error);
      loadingDiv.classList.add('hidden');
      characterDiv.innerHTML = `<p>Failed to load location. Please try again.</p>`;
      characterDiv.classList.remove('hidden');
    });
}

document.getElementById('location-button').addEventListener('click', fetchLocation);

function fetchEpisode() {
  loadingDiv.classList.remove('hidden');
  characterDiv.classList.add('hidden');
  changeLoadingMessage();

  fetch('/api/episode')
    .then(response => response.json())
    .then(episode => {
      characterDiv.innerHTML = `
        <h1>Random Episode</h1>
        <p><strong>Name:</strong> ${episode.name}</p>
        <p><strong>Air Date:</strong> ${episode.air_date}</p>
        <p><strong>Episode:</strong> ${episode.episode}</p>
        <hr>
        <h2>Characters</h2>
        <ul>
          ${episode.characterNames.map(name => `<li>${name}</li>`).join('')}
        </ul>
      `;
      loadingDiv.classList.add('hidden');
      characterDiv.classList.remove('hidden');
    })
        .catch(error => {
      console.error('Error fetching episode:', error);
      loadingDiv.classList.add('hidden');
      characterDiv.innerHTML = `<p>Failed to load episode. Please try again.</p>`;
      characterDiv.classList.remove('hidden');
    });
}

document.getElementById('episode-button').addEventListener('click', fetchEpisode);

    function createStarField() {
    const starField = document.getElementById('starfield');
    starField.innerHTML = '';
    for (let i = 0; i < 250; i++) {
        let star = document.createElement('div');
        star.className = 'star';
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        starField.appendChild(star);
    }
}

window.addEventListener('resize', createStarField);
createStarField();

    let mouse = { x: 0, y: 0 };

    function moveStarfield() {
        const moveX = (mouse.x - window.innerWidth / 2) * 0.01;
        const moveY = (mouse.y - window.innerHeight / 2) * 0.01;

        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            const initialX = parseFloat(star.style.left, 10);
            const initialY = parseFloat(star.style.top, 10);
            star.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }

    document.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        moveStarfield();
    });
});