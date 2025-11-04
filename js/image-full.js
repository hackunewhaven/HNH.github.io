const images = document.querySelectorAll('.gallery-card img');

images.forEach(img => {
    img.addEventListener('click', () => {
    // If already fullscreen, exit
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        // Create fullscreen overlay
        const overlay = document.createElement('div');
        overlay.classList.add('fullscreen');
        const fullscreenImg = img.cloneNode();
        overlay.appendChild(fullscreenImg);
        document.body.appendChild(overlay);

        // Remove fullscreen on click
        overlay.addEventListener('click', () => overlay.remove());
    }
    });
});