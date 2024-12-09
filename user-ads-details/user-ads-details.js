const reviews = [
    { author: "Oleg", rating: 4, comment: "Отличный продукт!", date: "2024-12-01" },
    { author: "Anna", rating: 5, comment: "Очень понравилось, рекомендую!", date: "2024-12-05" },
    { author: "Ivan", rating: 3, comment: "Неплохо, но есть недочеты.", date: "2024-11-30" },
    { author: "Svetlana", rating: 5, comment: "Беру уже второй раз. Очень нравится качество!", date: "2024-12-08" },
    { author: "Alexey", rating: 2, comment: "Не оправдало ожиданий. Качество оставляет желать лучшего.", date: "2024-12-06" },
    { author: "Dmitry", rating: 4, comment: "Цена и качество соответствуют. Хороший вариант.", date: "2024-12-07" },
    { author: "Ekaterina", rating: 5, comment: "Это лучший продукт, который я когда-либо покупала!", date: "2024-12-02" },
    { author: "Vladimir", rating: 1, comment: "Совершенно не понравилось. Деньги на ветер.", date: "2024-12-03" },
    { author: "Maria", rating: 4, comment: "Удобно использовать, доставка была быстрой.", date: "2024-12-04" },
    { author: "Nikolay", rating: 3, comment: "Просто нормально. Ожидал большего за эти деньги.", date: "2024-12-01" },
    { author: "Irina", rating: 5, comment: "Прекрасный тоывафывавыдлаофвылдафвыролафвыролафвдыоладфыволафволдыжадолжфвыодлжавар! Куплю еще.", date: "2024-11-29" },
    { author: "Olga", rating: 4, comment: "Качество вполне устраивает, но хотелось бы немного дешевле.", date: "2024-11-28" },
    { author: "Maxim", rating: 3, comment: "Обычный товар, ничего особенного.", date: "2024-11-27" },
    { author: "Tatiana", rating: 5, comment: "Рада, что выбрала этот продукт. Всем рекомендую!", date: "2024-11-26" },
    { author: "Sergey", rating: 4, comment: "Хороший вариант для подарка.", date: "2024-11-25" },
    { author: "Yulia", rating: 4, comment: "Покупала для родителей, они довольны.", date: "2024-11-24" },
    { author: "Roman", rating: 2, comment: "Не оправдал ожиданий. Проблемы с качеством.", date: "2024-11-23" },
    { author: "Valentina", rating: 5, comment: "Моя мечта сбылась! Рекомендую каждому.", date: "2024-11-22" },
    { author: "Artem", rating: 3, comment: "Средний товар, доставка задержалась.", date: "2024-11-21" },
    { author: "Elena", rating: 4, comment: "Прекрасный выбор! Никаких нареканий.", date: "2024-11-20" }
];

const deals = [
    {
        dealId: "001",
        status: "COMPLETE",
        buyerId: "B001",
        buyerName: "Ivan Petrov",
        buyedQuantity: 1,
        paymentSystemId: "PS001",
        paymentSystemName: "PayPal",
        startDate: "2024-12-01",
        closeDate: "2024-12-05"
    },
    {
        dealId: "002",
        status: "CANCELLED",
        buyerId: "B002",
        buyerName: "Anna Ivanova",
        buyedQuantity: 3,
        paymentSystemId: "PS002",
        paymentSystemName: "Visa",
        startDate: "2024-12-03",
        closeDate: null
    },
    {
        dealId: "003",
        status: "IN_PROGRESS",
        buyerId: "B003",
        buyerName: "Sergey Sidorov",
        buyedQuantity: 2,
        paymentSystemId: "PS003",
        paymentSystemName: "MasterCard",
        startDate: "2024-12-02",
        closeDate: null
    },
    {
        dealId: "002",
        status: "CANCELLED",
        buyerId: "B002",
        buyerName: "Anna Ivanova",
        buyedQuantity: 3,
        paymentSystemId: "PS002",
        paymentSystemName: "Visa",
        startDate: "2024-12-03",
        closeDate: null
    },
    {
        dealId: "002",
        status: "CANCELLED",
        buyerId: "B002",
        buyerName: "Anna Ivanova",
        buyedQuantity: 3,
        paymentSystemId: "PS002",
        paymentSystemName: "Visa",
        startDate: "2024-12-03",
        closeDate: null
    },
    {
        dealId: "002",
        status: "CANCELLED",
        buyerId: "B002",
        buyerName: "Anna Ivanova",
        buyedQuantity: 3,
        paymentSystemId: "PS002",
        paymentSystemName: "Visa",
        startDate: "2024-12-03",
        closeDate: null
    },
    {
        dealId: "002",
        status: "CANCELLED",
        buyerId: "B002",
        buyerName: "Anna Ivanova",
        buyedQuantity: 3,
        paymentSystemId: "PS002",
        paymentSystemName: "Visa",
        startDate: "2024-12-03",
        closeDate: null
    },
    {
        dealId: "002",
        status: "CANCELLED",
        buyerId: "B002",
        buyerName: "Anna Ivanova",
        buyedQuantity: 3,
        paymentSystemId: "PS002",
        paymentSystemName: "Visa",
        startDate: "2024-12-03",
        closeDate: null
    },
    {
        dealId: "002",
        status: "CANCELLED",
        buyerId: "B002",
        buyerName: "Anna Ivanova",
        buyedQuantity: 3,
        paymentSystemId: "PS002",
        paymentSystemName: "Visa",
        startDate: "2024-12-03",
        closeDate: null
    },
    {
        dealId: "002",
        status: "CANCELLED",
        buyerId: "B002",
        buyerName: "Anna Ivanova",
        buyedQuantity: 3,
        paymentSystemId: "PS002",
        paymentSystemName: "Visa",
        startDate: "2024-12-03",
        closeDate: null
    }

];

const statusTranslations = {
    COMPLETE: "Завершена",
    CANCELLED: "Отменена",
    IN_PROGRESS: "В процессе"
};

function renderDeals(deals) {
    // Основной контейнер для сделок
    const dealsContainer = document.querySelector(".deals-container");  

    // Генерируем карточки для каждой сделки
    deals.forEach(deal => {
        const dealCard = document.createElement("div");
        dealCard.classList.add("deal-card");

        // Наполняем карточку содержимым
        dealCard.innerHTML = `
            <strong>Имя покупателя: ${deal.buyerName}</strong>  
            <small>ID сделки: ${deal.dealId}</small>
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
            <div>Дата закрытия сделки: ${
                deal.closeDate ? deal.closeDate : "<span class='unfinished'>Незавершена</span>"
            }</div>
        `;

        // Добавляем карточку в контейнер
        dealsContainer.appendChild(dealCard);
    });
}

function renderReviews(reviews) {
    // Сортируем отзывы по дате, от новых к старым
    reviews.sort((a, b) => new Date(b.date) - new Date(a.date));

    const reviewsContainer = document.getElementsByClassName("reviews-container")[0];

    reviews.forEach(review => {
        const reviewCard = document.createElement("div");
        reviewCard.classList.add("review-card");

        // Наполняем карточку содержимым
        reviewCard.innerHTML = `
            <strong>Автор: ${review.author}</strong>  <span>Оценка: ${review.rating}</span>
            <div style="margin: 10px 0;">${review.comment}</div>
            <small>Дата: ${review.date}</small>
        `;

        // Добавляем карточку в контейнер
        reviewsContainer.appendChild(reviewCard);
    });

}

export function init() {
    renderReviews(reviews);
    renderDeals(deals);
}

export function open() {

}

export function loadServiceData(dealId) {
   
}