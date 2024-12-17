import { apiInstance as api } from "../service/BackendApi.js";

let reviews = [];
let deals = [];

const statusTranslations = {
    COMPLETE: "Завершена",
    CANCELLED: "Отменена",
    IN_PROGRESS: "В процессе"
};

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleString(); 
}

function renderDeals() {
    // Основной контейнер для сделок
    const dealsContainer = document.querySelector(".deals-container");
    while(dealsContainer.firstChild) {
        dealsContainer.removeChild(dealsContainer.firstChild);
    }
    // Генерируем карточки для каждой сделки
    deals.forEach(deal => {
        const dealCard = document.createElement("div");
        dealCard.classList.add("deal-card");

        // Наполняем карточку содержимым
        dealCard.innerHTML = `
            <strong>Имя покупателя: ${deal.buyerName}</strong>  
            <small>ID сделки: ${deal.id}</small>
            <div>Количество: ${deal.buyedQuantity}</div>
            <div>
                Статус сделки: 
                <select class="status-dropdown">
                    ${Object.keys(statusTranslations)
                .map(status => `
                            <option value="${status}" ${status === deal.status ? "selected" : ""}>
                                ${statusTranslations[status]}
                            </option>
                        `)
                .join("")}
                </select>
            </div>
            <div>Имя платежной системы: ${deal.paymentSystemName}</div>
            <div>Дата начала сделки: ${deal.startDate}</div>
            <div>Дата закрытия сделки: ${deal.closeDate ? deal.closeDate : "<span class='unfinished'>Незавершена</span>"
            }</div>
        `;

        // Добавляем карточку в контейнер
        dealsContainer.appendChild(dealCard);
    });
}

function renderReviews() {
    // Сортируем отзывы по дате, от новых к старым
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    const reviewsContainer = document.getElementsByClassName("reviews-container")[0];
    while(reviewsContainer.firstChild) {
        reviewsContainer.removeChild(reviewsContainer.firstChild);
    }

    reviews.forEach(review => {
        const reviewCard = document.createElement("div");
        reviewCard.classList.add("review-card");
        reviewCard.id = review.id;

        // Наполняем карточку содержимым
        reviewCard.innerHTML = `
            <div id="review-header">
                <div>
                    <strong>Автор: ${review.author}</strong>  <span>Оценка: ${review.grade}</span> 
                </div>
                <button class="delete-add-button">×</button>
            </div>
            <div style="margin: 10px 0;">${review.comment}</div>
            <small>Дата: ${formatDateTime(review.date)}</small>
        `;

        
        reviewCard.querySelector(".delete-add-button").addEventListener('click', () => {
            console.log(reviews)
            reviews = reviews.filter(value => value.id != reviewCard.id);
            console.log(reviews)
            renderReviews(reviews);
            api.reviewService.deleteById(reviewCard.id);

        })

        reviewsContainer.appendChild(reviewCard);
    });

}

let currentService;

export function init() {
    // renderReviews(reviews);
    renderDeals(deals);
}

export async function open() {
}

export function setCurrentService(service) {
    currentService = service;
}

export async function loadServiceData(dealId) {
    reviews = await api.reviewService.getAllByServiceId(currentService.id);
    deals = await api.adService.getDealsByServiceId(currentService.id)
    renderReviews();
    renderDeals();
}