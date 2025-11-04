const cardDiv = document.querySelector(".info-card-div");
const leftArrow = document.querySelector(".arrow1");
const rightArrow = document.querySelector(".arrow2");

const cardWidth = 430; // width + margin (matches .info-card min-width + spacing)

rightArrow.addEventListener("click", () => {
    cardDiv.scrollBy({ left: cardWidth, behavior: "smooth" });
});

leftArrow.addEventListener("click", () => {
    cardDiv.scrollBy({ left: -cardWidth, behavior: "smooth" });
});

const gallery = document.querySelector(".gallery-section");
const leftArrow2 = document.querySelector(".arrow3");
const rightArrow2 = document.querySelector(".arrow4");

const cardWidth2 = gallery.querySelector(".gallery-card").offsetWidth + 20; // + gap

rightArrow2.addEventListener("click", () => {
    gallery.scrollBy({ left: cardWidth2, behavior: "smooth" });
});

leftArrow2.addEventListener("click", () => {
    gallery.scrollBy({ left: -cardWidth2, behavior: "smooth" });
});
document.querySelectorAll('.faq-header').forEach(header => {
header.addEventListener('click', () => {
    const faq = header.parentElement;
    faq.classList.toggle('active');
});
});