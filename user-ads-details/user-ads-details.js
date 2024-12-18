import { apiInstance as api } from "../service/BackendApi.js";

let reviews = [];
let deals = [];
let paymentSystems;


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
    while (dealsContainer.firstChild) {
        dealsContainer.removeChild(dealsContainer.firstChild);
    }
    
    const filteredDeals = filterDeals();
    filteredDeals.forEach(deal => {
        const dealCard = document.createElement("div");
        dealCard.classList.add("deal-card");

        // Наполняем карточку содержимым
        dealCard.innerHTML = `
            <strong>Имя покупателя: ${deal.buyerName}</strong>  
            <small>ID сделки: ${deal.id}</small>
            <div>Количество: ${deal.buyedQuantity ? deal.buyedQuantity : 1}</div>
            <div>
                Статус сделки: 
                <select class="status-dropdown">
                    ${Object.keys(statusTranslations)
                .map(status => `
                            <option value="${status}" ${status === deal.dealStatus ? "selected" : ""}>
                                ${statusTranslations[status]}
                            </option>
                        `)
                .join("")}
                </select>
            </div>
            <div>Имя платежной системы: ${deal.paymentSystemName}</div>
            <div>Дата начала сделки: ${formatDateTime(deal.dealStart)}</div>
            <div>Дата закрытия сделки: ${deal.dealEnd ? formatDateTime(deal.dealEnd) : "<span class='unfinished'>Незавершена</span>"
            }</div>
        `;

        // Добавляем карточку в контейнер
        updateStats();
        dealsContainer.appendChild(dealCard);
    });
}

function renderReviews() {
    // Сортируем отзывы по дате, от новых к старым
    const filteredReviews = filterReviews();
    filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    const reviewsContainer = document.getElementsByClassName("reviews-container")[0];
    while (reviewsContainer.firstChild) {
        reviewsContainer.removeChild(reviewsContainer.firstChild);
    }

    filteredReviews.forEach(review => {
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
        updateStats();
        reviewsContainer.appendChild(reviewCard);
    });
}

let minGradeFilter;
let maxGradeFilter;
let dateFromFilter;
let dateToFilter;
let userNameReviewFilter;

let dealIdFilter;
let buyerNameFilter;
let dateFromStartFilter;
let dateToStartFilter;
let dateFromEndFilter;
let dateToEndFilter;
let dealStatusFilter;
let paymentSystemFilter;

function filterReviews() {
    const filteredReviews = reviews.filter(review => {
        return review.grade >= minGradeFilter.value &&
            review.grade <= maxGradeFilter.value &&
            (dateFromFilter.value ? review.date >= dateFromFilter.value : true) &&
            (dateToFilter.value ? review.date <= dateToFilter.value : true) &&
            (userNameReviewFilter.value ? review.author.toLowerCase().includes(userNameReviewFilter.value.toLowerCase()) : true)
    });

    return filteredReviews;
}

function filterDeals() {
    const filteredDeals = deals.filter(deal => {
        return dealIdFilter.value ? dealIdFilter.value == deal.id : true &&
        (buyerNameFilter.value ? deal.buyerName.toLowerCase().includes(buyerNameFilter.value.toLowerCase()) : true) &&
        (dateFromStartFilter.value ? deal.dealStart >= dateFromStartFilter.value : true) &&
        (dateToStartFilter.value ? deal.dealStart <= dateToStartFilter.value : true) &&
        (dateFromEndFilter.value ? deal.dealEnd >= dateFromEndFilter.value : true) &&
        (dateToEndFilter.value ? deal.dealEnd <= dateToEndFilter.value : true) &&
        (paymentSystemFilter.value == "any" ? true : deal.paymentSystemName == paymentSystemFilter.value) &&
        (dealStatusFilter.value == "any" ? true : deal.dealStatus == dealStatusFilter.value);
    })

    return filteredDeals;
}

let currentService;

let totalDealsLabel;
let totalCompleteDealsLabel;
let totalCancelledDealsLabel;
let totalInProgressDealsLabel;
let avgRatingLabel;
let totalReviewsLabel;

function addPaymentSystems() {
    const psListElement = document.getElementById("payment-system-ad-filter");
    paymentSystems.forEach(ps => {
        const newOption = document.createElement("option");
        newOption.value = ps.name;
        newOption.innerHTML = ps.name;
        psListElement.appendChild(newOption);
    })
}

export async function init() {

    paymentSystems = await api.paymentSystemService.getAll();
    addPaymentSystems();

    totalDealsLabel = document.getElementById("total-deals");
    totalCompleteDealsLabel = document.getElementById("completed-deals");
    totalCancelledDealsLabel = document.getElementById("cancelled-deals");
    totalInProgressDealsLabel = document.getElementById("in-progress-deals");
    avgRatingLabel = document.getElementById("average-rating");
    totalReviewsLabel = document.getElementById("total-reviews");

    minGradeFilter = document.getElementById("rating-from");
    maxGradeFilter = document.getElementById("rating-to");
    dateFromFilter = document.getElementById("date-from");
    dateToFilter = document.getElementById("date-to");
    userNameReviewFilter = document.getElementById("author-name-review");

    dealIdFilter = document.getElementById("deal-id-ad-filter");
    buyerNameFilter = document.getElementById("buyer-ad-filter");
    dateFromStartFilter = document.getElementById("deal-start-ad-date-from");
    dateToStartFilter = document.getElementById("deal-start-ad-date-to")
    dateFromEndFilter = document.getElementById("deal-end-ad-date-from")
    dateToEndFilter = document.getElementById("deal-end-ad-date-to");
    dealStatusFilter = document.getElementById("deal-status-ad-filter");
    paymentSystemFilter = document.getElementById("payment-system-ad-filter");

    minGradeFilter.addEventListener('change', () => {
        renderReviews();
    })

    maxGradeFilter.addEventListener('change', () => {
        renderReviews();
    })

    dateToFilter.addEventListener('change', () => {
        renderReviews();
    })

    dateFromFilter.addEventListener('change', () => {
        renderReviews();
    })

    userNameReviewFilter.addEventListener('input', () => {
        renderReviews();
    })

    dealIdFilter.addEventListener('input', () => {
        renderDeals();
    })

    buyerNameFilter.addEventListener('input', () => {
        renderDeals();
    })

    dateFromStartFilter.addEventListener('change', () => {
        renderDeals();
    })

    dateToStartFilter.addEventListener('change', () => {
        renderDeals();
    })

    dateFromEndFilter.addEventListener('change', () => {
        renderDeals();
    })

    dateToEndFilter.addEventListener('change', () => {
        renderDeals();
    })

    paymentSystemFilter.addEventListener('change', () => {
        renderDeals();
    })

    dealStatusFilter.addEventListener('change', () => {
        renderDeals();
    })

    document.getElementById("review-filter-clear").addEventListener('click', () => {
        minGradeFilter.value = "1";
        maxGradeFilter.value = "5";
        dateFromFilter.value = null;
        dateToFilter.value = null;
        userNameReviewFilter.value = "";
        renderReviews();
    })

    document.getElementById("deals-filter-clear").addEventListener('click', () => {
        dealIdFilter.value = "";
        buyerNameFilter.value = "";
        dealStatusFilter.value = "any";
        paymentSystemFilter.value = "any";
        dateFromStartFilter.value = null;
        dateToStartFilter.value = null;
        dateFromEndFilter.value = null;
        dateToEndFilter.value = null;
        renderDeals();
    })

}

export async function open() {
}

export function setCurrentService(service) {
    currentService = service;
}

function updateStats() {
    totalDealsLabel.innerHTML = deals.length;
    totalReviewsLabel.innerHTML = reviews.length;
    avgRatingLabel.innerHTML =
        (reviews.reduce((sum, item) => sum + item.grade, 0) / reviews.length).toFixed(2);
    let totalComplete = 0;
    let totalCancelled = 0;
    let totalInProgress = 0;
    deals.forEach(deal => {
        const status = deal.dealStatus;
        if (status == "CANCELLED") totalCancelled++;
        else if (status == "COMPLETE") totalComplete++;
        else totalInProgress++;
    })

    totalCancelledDealsLabel.innerHTML = totalCancelled;
    totalInProgressDealsLabel.innerHTML = totalInProgress;
    totalCompleteDealsLabel.innerHTML = totalComplete;
}

export async function loadServiceData(dealId) {
    reviews = await api.reviewService.getAllByServiceId(currentService.id);
    deals = await api.adService.getDealsByServiceId(currentService.id)
    renderReviews();
    renderDeals();
}