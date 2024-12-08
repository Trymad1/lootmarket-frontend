const ads = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    authorId: `author-${Math.ceil(Math.random() * 10)}`,
    categoryId: `category-${Math.ceil(Math.random() * 5)}`,
    authorName: `Автор ${Math.ceil(Math.random() * 10)}`,
    categoryName: `Категория ${Math.ceil(Math.random() * 5)}`,
    shortDescription: `Краткое описание услуги ${i + 1}`,
    detailedDescription: `Подробное описание услуги ${i + 1}. Это описание может быть длинным.`,
    quantity: Math.ceil(Math.random() * 100),
    price: (Math.random() * 500).toFixed(2),
    reviewCount: Math.ceil(Math.random() * 200),
    averageRating: (Math.random() * 5).toFixed(1),
}));

function renderAds(filteredAds) {
    const container = document.getElementById("ads-container");
    container.innerHTML = ""; // Очищаем предыдущий рендер
    filteredAds.forEach(ad => {
        const card = document.createElement("div");
        card.className = "ad-card";
        card.innerHTML = `
            <h3>${ad.categoryName}</h3>
            <p>Автор: ${ad.authorName}</p>
            <p>Отзывов: ${ad.reviewCount}</p>
            <p>Оценка: ${ad.averageRating}</p>
            <hr>
            <p>${ad.shortDescription}</p>
            <div class="ad-meta">
                <span>Кол-во: ${ad.quantity}</span>
                <span>Цена: ${ad.price}₽</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function applyFilters() {
    const userFilter = document.getElementById("filter-user").value.toLowerCase();
    const categoryFilter = document.getElementById("filter-category").value.toLowerCase();
    const descriptionFilter = document.getElementById("filter-description").value.toLowerCase();

    const filteredAds = ads.filter(ad =>
        (!userFilter || ad.authorName.toLowerCase().includes(userFilter)) &&
        (!categoryFilter || ad.categoryName.toLowerCase().includes(categoryFilter)) &&
        (!descriptionFilter || ad.shortDescription.toLowerCase().includes(descriptionFilter))
    );

    renderAds(filteredAds);
}


// Инициализация страницы с полным списком объявлений





export function init() {
    renderAds(ads);
}

export function open() {

}

