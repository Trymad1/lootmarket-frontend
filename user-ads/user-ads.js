// Генерация тестовых данных
const ads = Array.from({ length: 30 }, (_, index) => {
    const shortDescriptionLength = Math.floor(Math.random() * 150) + 1; // Длина текста от 1 до 50 символов
    const shortDescription = 'Краткое описание '.repeat(Math.ceil(shortDescriptionLength / 17)).slice(0, shortDescriptionLength);

    return {
        id: index + 1,
        authorId: Math.floor(Math.random() * 10) + 1,
        categoryId: Math.floor(Math.random() * 5) + 1,
        authorName: `Автор ${Math.floor(Math.random() * 10) + 1}`,
        categoryName: `Категория ${Math.floor(Math.random() * 5) + 1}`,
        shortDescription, // Краткое описание разного размера
        detailedDescription: `Подробное описание объявления ${index + 1}`,
        quantity: Math.floor(Math.random() * 100) + 1,
        price: Math.floor(Math.random() * 5000) + 100,
        reviewsCount: Math.floor(Math.random() * 50),
        averageRating: (Math.random() * 5).toFixed(1),
    };
});

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
            ? ad.shortDescription.toLowerCase().includes(filter.description.toLowerCase())
            : true;

        return matchesUser && matchesCategory && matchesDescription;
    }).forEach(ad => {
        const adCard = document.createElement('div');
        adCard.className = 'ad-card';
        adCard.innerHTML = `
            <div class="ad-header">
                ${ad.categoryName}: ${ad.authorName}
            </div>
            <div class="ad-details">
                <p><b>Количество отзывов:</b> ${ad.reviewsCount}</p>
                <p><b>Средняя оценка:</b> ${ad.averageRating}</p>
                <p><b>Описание:</b> ${ad.shortDescription}</p>
                <p><b>Количество:</b> ${ad.quantity}</p>
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

    document.getElementById('filter-user').addEventListener('input', () => {
        const user = userInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;

        displayAds({ user, category, description });
    })

    document.getElementById('filter-category').addEventListener('input', () => {
        const user = userInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;

        displayAds({ user, category, description });
    })

    document.getElementById('filter-description').addEventListener('input', () => {
        const user = userInput.value;
        const category = categoryInput.value;
        const description = descriptionInput.value;

        displayAds({ user, category, description });
    })

}

export function open() {

}