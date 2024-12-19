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

import { showTab } from "../LoadContent.js";
import { apiInstance as api } from "../service/BackendApi.js";
import { stateUtil } from "../service/StateService.js";

let ads = [];


import { loadServiceData, setCurrentService } from "../user-ads-details/user-ads-details.js";
import { setUpdateRequired } from "../users-view/users-view.js";
// Функция для отображения объявлений
function displayAds(filter = {}) {
    const adsContainer = document.getElementById('ads-container');
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
        adCard.id = `${ad.id}`
        adCard.innerHTML = `
        <div class="ad-header">
            <div>
                <p id="ad-id-card">№${ad.id}</p>
                <p id="category-name-card">${ad.categoryName}</p>
                <p id="category-title-card">Описание: ${ad.title}</p>
            </div>
            <div id="name-and-close">
                <button class="delete-add-button">×</button>
                <p>${ad.authorName}</p>
            </div>
            </div>
            <div class="ad-details">Количество: ${ad.quantity == null ? "Неограниченно" : ad.quantity}</p>
                <p><b>Цена:</b> ${ad.price} руб.</p>
            </div>
        `;
        adsContainer.appendChild(adCard);
        adCard.addEventListener('click', () => {
            const id = adCard.id
            const currentAd = ads.find(arrAd => arrAd.id == id);
            setCurrentService(currentAd);
            loadServiceData(currentAd);
            showTab('user-ads-details');
        })

        adCard.querySelector(".delete-add-button").addEventListener('click', (event) => {
            ads = ads.filter(value => value.id != adCard.id);

            const userInput = document.getElementById('filter-user');
            const categoryInput = document.getElementById('filter-category');
            const descriptionInput = document.getElementById('filter-description');
            const idInput = document.getElementById('filter-id-card')

            const user = userInput.value;
            const category = categoryInput.value;
            const description = descriptionInput.value;
            const id = idInput.value;

            displayAds({ user, category, description, id });
            api.adService.deleteById(adCard.id);
            event.stopPropagation();
        })
    });
}

export async function init() {
    ads = await api.adService.getAllAds();
    displayAds({});
    stateUtil.userAdState.setUpdateRequired(false);

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
export async function open() {
    if(stateUtil.userAdState.isUpdateRequired) {
        ads = await api.adService.getAllAds();
        displayAds({});
        stateUtil.userAdState.setUpdateRequired(false);
    }
}
