

import { showTab } from "../LoadContent.js";
import { apiInstance as api } from "../service/BackendApi.js";
import { securityService } from "../service/SecurityService.js";
import { stateUtil } from "../service/StateService.js";

let ads = [];


import { loadServiceData, setCurrentService } from "../user-ads-details/user-ads-details.js";
import { setUpdateRequired } from "../users-view/users-view.js";

async function displayAds(filter = {}) {
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
            ${securityService.permission.changeDeals() ? '<button class="delete-add-button">×</button>' : ""}
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

        if(!securityService.permission.changeDeals()) return;
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

async function displayAdsAsTable(filter = {}) {
    const adsContainer = document.getElementById('ads-container');
    adsContainer.innerHTML = '';

    // Создаем таблицу, если ее еще нет
    const table = document.createElement('table');
    table.className = 'ads-table';
    table.innerHTML = `
        <thead>
            <tr>
                <th>№</th>
                <th>Пользователь</th>
                <th>Категория</th>
                <th>Описание</th>
                <th>Количество</th>
                <th>Цена</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody id="ads-table-body"></tbody>
    `;

    adsContainer.appendChild(table);

    const tableBody = document.getElementById('ads-table-body');

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
        const row = document.createElement('tr');
        row.id = `${ad.id}`;
        row.innerHTML = `
            <td>${ad.id}</td>
            <td>${ad.authorName}</td>
            <td>${ad.categoryName}</td>
            <td>${ad.title}</td>
            <td>${ad.quantity == null ? "Неограниченно" : ad.quantity}</td>
            <td>${ad.price} руб.</td>
            <td>
                ${securityService.permission.changeDeals() ? '<button class="delete-add-button">×</button>' : ""}
            </td>
        `;

        tableBody.appendChild(row);

        row.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-add-button')) {
                return; // Избегаем открытия, если нажата кнопка удаления
            }
            const id = row.id;
            const currentAd = ads.find(arrAd => arrAd.id == id);
            setCurrentService(currentAd);
            loadServiceData(currentAd);
            showTab('user-ads-details');
        });

        if(securityService.permission.changeDeals()) {
            row.querySelector('.delete-add-button').addEventListener('click', (event) => {
                ads = ads.filter(value => value.id != row.id);
    
                const userInput = document.getElementById('filter-user');
                const categoryInput = document.getElementById('filter-category');
                const descriptionInput = document.getElementById('filter-description');
                const idInput = document.getElementById('filter-id-card');
    
                const user = userInput.value;
                const category = categoryInput.value;
                const description = descriptionInput.value;
                const id = idInput.value;
    
                displayAdsAsTable({ user, category, description, id });
                api.adService.deleteById(row.id);
                event.stopPropagation();
            });
        }
    });
}

let defaultView = displayAdsAsTable;
export async function init() {
    ads = await api.adService.getAllAds();
    defaultView({});
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

        defaultView({ user, category, description, id });
    })

    document.getElementById('filter-category').addEventListener('input', () => {
        const user = userInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;
        const id = idInput.value;

        defaultView({ user, category, description, id });
    })

    document.getElementById('filter-description').addEventListener('input', () => {
        const user = userInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;
        const id = idInput.value;

        defaultView({ user, category, description, id });
    })

    document.getElementById('filter-id-card').addEventListener('input', () => {
        const user = userInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;
        const id = idInput.value;

        defaultView({ user, category, description, id });
    })
    
    document.getElementById('table-view-deal-button').addEventListener('click', () => {
        const user = userInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;
        const id = idInput.value;

        if(defaultView == displayAdsAsTable) return;
        defaultView = displayAdsAsTable;
        defaultView({ user, category, description, id });
    })

    document.getElementById('card-view-deal-button').addEventListener('click', () => {
        const user = userInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;
        const id = idInput.value;

        if(defaultView == displayAds) return;
        defaultView = displayAds;
        defaultView({ user, category, description, id });
    })

}
export async function open() {
    if(stateUtil.userAdState.isUpdateRequired) {
        ads = await api.adService.getAllAds();
        defaultView({});
        stateUtil.userAdState.setUpdateRequired(false);
    }
}
