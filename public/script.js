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

    // Function to randomly change loading messages
    function changeLoadingMessage() {
        const randomIndex = Math.floor(Math.random() * loadingMessages.length);
        loadingText.textContent = loadingMessages[randomIndex];
    }

    // Function to fetch and display the character
    function fetchCharacter() {
    // Show loading image and text
    loadingDiv.classList.remove('hidden');
    characterDiv.classList.add('hidden');
    changeLoadingMessage(); // Change the loading message

    fetch('/api/character')
        .then(response => response.json())
        .then(character => {
            // Set the HTML for the character info, but not the image yet
            characterDiv.innerHTML = `
                <h1>Random Rick and Morty Character</h1>
                <p><strong>Name:</strong> ${character.name}</p>
                <p><strong>Status:</strong> ${character.status}</p>
                <p><strong>Species:</strong> ${character.species}</p>
            `;

            // Create a new Image object
            const img = new Image();
            img.src = character.image;
            img.alt = character.name;
            img.style.width = '200px';

            // When the image is loaded, append it to the characterDiv and hide the loader
            img.onload = () => {
                characterDiv.appendChild(img);
                loadingDiv.classList.add('hidden');
                characterDiv.classList.remove('hidden');
            };
        })
        .catch(error => {
            console.error('Error fetching character:', error);
            // Hide loading image and show error message
            loadingDiv.classList.add('hidden');
            characterDiv.innerHTML = `<p>Failed to load character. Please try again.</p>`;
            characterDiv.classList.remove('hidden');
        });
}

    // Call fetchCharacter on page load
    fetchCharacter();

    // Attach an event listener to the button for the click event
    document.getElementById('refresh-button').addEventListener('click', fetchCharacter);

    const starField = document.querySelector('body');

    // Create stars in the starField
    function createStarField() {
    const starField = document.getElementById('starfield');
    // Clear out any existing stars before creating new ones
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

// Call createStarField on initial load and on resize
window.addEventListener('resize', createStarField);
createStarField();

    // Keep track of the mouse position
    let mouse = { x: 0, y: 0 };

    // Function to move the starfield based on mouse position
    function moveStarfield() {
        const moveX = (mouse.x - window.innerWidth / 2) * 0.01;
        const moveY = (mouse.y - window.innerHeight / 2) * 0.01;

        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            const initialX = parseFloat(star.style.left, 10);
            const initialY = parseFloat(star.style.top, 10);
            // Apply a transform to translate the star's position based on mouse movement
            star.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }

    // Update the mouse position and move the starfield
    document.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        moveStarfield();
    });
});