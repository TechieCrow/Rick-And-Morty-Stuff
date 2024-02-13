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