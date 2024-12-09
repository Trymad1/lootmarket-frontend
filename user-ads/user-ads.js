// Генерация тестовых данных
// const ads = Array.from({ length: 30 }, (_, index) => {
//     const shortDescriptionLength = Math.floor(Math.random() * 150) + 1; // Длина текста от 1 до 50 символов
//     const shortDescription = 'Краткое описание '.repeat(Math.ceil(shortDescriptionLength / 17)).slice(0, shortDescriptionLength);

//     return {
//         id: index + 1,
//         authorId: Math.floor(Math.random() * 10) + 1,
//         categoryId: Math.floor(Math.random() * 5) + 1,
//         authorName: `Автор: Oleg${Math.floor(Math.random() * 10) + 1}`,
//         categoryName: `Категория ${Math.floor(Math.random() * 5) + 1}`,
//         shortDescription, 
//         detailedDescription: `Подробное описание объявления ${index + 1}`,
//         quantity: Math.floor(Math.random() * 100) + 1,
//         price: Math.floor(Math.random() * 5000) + 100,
//     };
// });

import { apiInstance as api } from "../service/BackendApi.js";

const ads = await api.adService.getAllAds();
const adsContainer = document.getElementById('ads-container');

// Функция для отображения объявлений
function displayAds(filter = {}) {
    adsContainer.innerHTML = '';
    ads.filter(ad => {
        const matchesUser = filter.user
            ? ad.authorName.toLowerCase().includes(filter.user.toLowerCase())
            : true;
        const matchesCategory = filter.category
            ? ad.categoryName.toLowerCase().includes(filter.category.toLowerCase())
            : true;
        const matchesDescription = filter.description
            ? ad.title.toLowerCase().includes(filter.description.toLowerCase())
            : true;
        const matchesId = filter.id
            ? ad.id == filter.id
            : true;

        return matchesUser && matchesCategory && matchesDescription && matchesId;
    }).forEach(ad => {
        const adCard = document.createElement('div');
        adCard.className = 'ad-card';
        adCard.innerHTML = `
            <div class="ad-header">
                <div>
                <p id="ad-id-card">№${ad.id}</p>
                <p id="category-name-card">${ad.categoryName}</p>
                <p id="category-title-card">Описание: ${ad.title}</p>
                </div>
                <p>${ad.authorName}</p>
            </div>
            <div class="ad-details">
                <p><b>Количество:</b> ${ad.quantity == null ? "Неограниченно" : ad.quantity}</p>
                <p><b>Цена:</b> ${ad.price} руб.</p>
            </div>
        `;
        adsContainer.appendChild(adCard);
    });
}

export function init() {
    displayAds();

    const userInput = document.getElementById('filter-user');
    const categoryInput = document.getElementById('filter-category');
    const descriptionInput = document.getElementById('filter-description');
    const idInput = document.getElementById('filter-id-card')

    document.getElementById('filter-user').addEventListener('input', () => {
        const user = userInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;
        const id = idInput.value;

        displayAds({ user, category, description, id });
    })

    document.getElementById('filter-category').addEventListener('input', () => {
        const user = userInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;
        const id = idInput.value;

        displayAds({ user, category, description, id });
    })

    document.getElementById('filter-description').addEventListener('input', () => {
        const user = userInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;
        const id = idInput.value;

        displayAds({ user, category, description, id });
    })

    document.getElementById('filter-id-card').addEventListener('input', () => {
        const user = userInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;
        const id = idInput.value;

        displayAds({ user, category, description, id });
    })

}

export function open() {

}