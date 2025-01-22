

import { showTab } from "../LoadContent.js";
import { apiInstance as api } from "../service/BackendApi.js";
import { securityService } from "../service/SecurityService.js";
import { stateUtil } from "../service/StateService.js";

let userServices = [];


import { loadServiceData, setCurrentService } from "../user-service-details/user-service-details.js";
import { setUpdateRequired } from "../users-view/users-view.js";

async function displayServices(filter = {}) {
    const userServiceContainer = document.getElementById('services-container');
    userServiceContainer.innerHTML = '';
    userServices.filter(ad => {
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
    }).forEach(userService => {
        const userCard = document.createElement('div');
        userCard.className = 'userService-card';
        userCard.id = `${userService.id}`
        userCard.innerHTML = `
        <div class="userService-header">
            <div>
                <p id="service-id-card">№${userService.id}</p>
                <p id="category-name-card">${userService.categoryName}</p>
                <p id="category-title-card">Описание: ${userService.title}</p>
            </div>
            <div id="name-and-close">
            ${securityService.permission.changeDeals() ? '<button class="delete-userService-button">×</button>' : ""}
                <p>${userService.authorName}</p>
            </div>
            </div>
            <div class="userService-details">Количество: ${userService.quantity == null ? "Неограниченно" : userService.quantity}</p>
                <p><b>Цена:</b> ${userService.price} руб.</p>
            </div>
        `;
        userServiceContainer.appendChild(userCard);
        userCard.addEventListener('click', () => {
            const id = userCard.id
            const currentUserService = userServices.find(arrAd => arrAd.id == id);
            setCurrentService(currentUserService);
            loadServiceData(currentUserService);
            showTab('user-ads-details');
        })

        if(!securityService.permission.changeDeals()) return;
        userCard.querySelector(".delete-userService-button").addEventListener('click', (event) => {
            userServices = userServices.filter(value => value.id != userCard.id);

            const userInput = document.getElementById('filter-user');
            const categoryInput = document.getElementById('filter-category');
            const descriptionInput = document.getElementById('filter-description');
            const idInput = document.getElementById('filter-id-card')

            const user = userInput.value;
            const category = categoryInput.value;
            const description = descriptionInput.value;
            const id = idInput.value;

            displayServices({ user, category, description, id });
            api.userServicesService.deleteById(userCard.id);
            event.stopPropagation();
        })
    });
}

async function displayServicesAsTable(filter = {}) {
    const userServicesContainer = document.getElementById('services-container');
    userServicesContainer.innerHTML = '';

    // Создаем таблицу, если ее еще нет
    const table = document.createElement('table');
    table.className = 'userService-table';
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
        <tbody id="userServices-table-body"></tbody>
    `;

    userServicesContainer.appendChild(table);

    const tableBody = document.getElementById('userServices-table-body');

    userServices.filter(ad => {
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
    }).forEach(userService => {
        const row = document.createElement('tr');
        row.id = `${userService.id}`;
        row.innerHTML = `
            <td>${userService.id}</td>
            <td>${userService.authorName}</td>
            <td>${userService.categoryName}</td>
            <td>${userService.title}</td>
            <td>${userService.quantity == null ? "Неограниченно" : userService.quantity}</td>
            <td>${userService.price} руб.</td>
            <td>
                ${securityService.permission.changeDeals() ? '<button class="delete-userService-button">×</button>' : ""}
            </td>
        `;

        tableBody.appendChild(row);

        row.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-userService-button')) {
                return; 
            }
            const id = row.id;
            const currentUserService = userServices.find(arrServices => arrServices.id == id);
            setCurrentService(currentUserService);
            loadServiceData(currentUserService);
            showTab('user-service-details');
        });

        if(securityService.permission.changeDeals()) {
            row.querySelector('.delete-userService-button').addEventListener('click', (event) => {
                userServices = userServices.filter(value => value.id != row.id);
    
                const userInput = document.getElementById('filter-user');
                const categoryInput = document.getElementById('filter-category');
                const descriptionInput = document.getElementById('filter-description');
                const idInput = document.getElementById('filter-id-card');
    
                const user = userInput.value;
                const category = categoryInput.value;
                const description = descriptionInput.value;
                const id = idInput.value;
    
                displayServicesAsTable({ user, category, description, id });
                api.userServicesService.deleteById(row.id);
                event.stopPropagation();
            });
        }
    });
}

let defaultView = displayServicesAsTable;
export async function init() {
    userServices = await api.userServicesService.getAllAds();
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

        if(defaultView == displayServicesAsTable) return;
        defaultView = displayServicesAsTable;
        defaultView({ user, category, description, id });
    })

    document.getElementById('card-view-deal-button').addEventListener('click', () => {
        const user = userInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;
        const id = idInput.value;

        if(defaultView == displayServices) return;
        defaultView = displayServices;
        defaultView({ user, category, description, id });
    })
}

export async function open() {
    if(stateUtil.userAdState.isUpdateRequired) {
        userServices = await api.userServicesService.getAllAds();
        defaultView({});
        stateUtil.userAdState.setUpdateRequired(false);
    }
}
