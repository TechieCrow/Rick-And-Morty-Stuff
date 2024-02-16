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