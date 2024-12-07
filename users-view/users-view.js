import { apiInstance as api } from '../service/BackendApi.js';
import { showTab } from '../LoadContent.js';

function populateUserDetails(user) {
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.mail;
    document.getElementById('user-createdAt').textContent = user.registrationDate;
    document.getElementById('user-updatedAt').textContent = user.lastUpdate;
}

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleString(); // Локальное форматирование даты и времени
}

// Функция для рендеринга платежных систем
function renderPaymentSystems(paymentSystems) {
    const container = document.getElementById('payment-systems-container');
    container.innerHTML = ''; // Очистка перед рендерингом

    paymentSystems.forEach(system => {
        const div = document.createElement('div');
        div.className = 'payment-system';
        div.innerHTML = `
            <span class="payment-system-icon"></span>
            <span class="payment-system-label">${system.name}</span>
        `;
        container.appendChild(div);
    });
}

function buildDealsChart(elementId, dealsAsAuthorStats, dealsAsBuyerStats) {
    const dealsChartElement = document.getElementById(elementId);

    // Уничтожение старого графика сделок, если он существует
    if (dealsChartElement.chart) {
        dealsChartElement.chart.destroy();
    }

    const ctx = dealsChartElement.getContext('2d');

    // Функция для группировки данных по месяцам
    const groupByMonth = (dates) => {
        return dates.reduce((acc, date) => {
            const month = date.slice(0, 7); // Извлекаем "YYYY-MM" из LocalDateTime
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});
    };

    // Группируем данные по месяцам
    const groupedAuthorData = groupByMonth(dealsAsAuthorStats);
    const groupedBuyerData = groupByMonth(dealsAsBuyerStats);

    // Собираем все уникальные месяцы из двух наборов данных и сортируем их
    const labels = [...new Set([
        ...Object.keys(groupedAuthorData),
        ...Object.keys(groupedBuyerData),
    ])].sort();

    // Создаем массивы данных для графика
    const authorData = labels.map(month => groupedAuthorData[month] || 0);
    const buyerData = labels.map(month => groupedBuyerData[month] || 0);

    // Создание нового графика
    dealsChartElement.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(label => new Date(label + '-01').toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })), // Формат "MMM YYYY"
            datasets: [
                {
                    label: 'Услуг продано',
                    data: authorData, // Данные для сделок как автор
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.3,
                    fill: false,
                },
                {
                    label: 'Услуг куплено',
                    data: buyerData, // Данные для сделок как покупатель
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.3,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Месяц'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Сделки'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}


const groupByMonth = (dates) => {
    return dates.reduce((acc, date) => {
        const month = date.slice(0, 7); // Пример: "2024-12"
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});
};


export async function loadUser(user) {
    const userStats = await api.userService.getUserStats(user.id);
    console.log(userStats);

    // Обновляем информацию о пользователе
    document.getElementById('user-id').textContent = user.id;
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.mail;
    document.getElementById('user-created-at').textContent = formatDateTime(user.registrationDate);
    document.getElementById('user-updated-at').textContent = formatDateTime(user.lastUpdate);
    
    let isBanned = user.banned === true ? "Да" : "Нет";
    document.getElementById('user-blocked').textContent = isBanned

    // Обновление статистики
    document.getElementById('user-services-count').textContent = userStats.servicesPosted;
    document.getElementById('user-deals-author').textContent = userStats.servicesSold;
    document.getElementById('user-deals-buyer').textContent = userStats.servicesPurchased;

    // Уничтожение старого графика онлайн-активности, если он существует
    const onlineChartElement = document.getElementById('online-stats-chart');
    if (onlineChartElement.chart) {
        onlineChartElement.chart.destroy();
    }

    // Построение графика онлайн-активности
    const onlineCtx = onlineChartElement.getContext('2d');

    // Функция для группировки по месяцам
    const groupByMonth = (dates) => {
        return dates.reduce((acc, date) => {
            const month = date.slice(0, 7); // Извлекаем "YYYY-MM" из LocalDateTime
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});
    };

    // Группируем данные активности по месяцам
    const groupedActivity = groupByMonth(userStats.activityDates);

    // Создаем массивы меток и значений
    const labels = Object.keys(groupedActivity).sort(); // Упорядочиваем месяцы
    const data = labels.map(month => groupedActivity[month]); // Данные активности за каждый месяц

    // Создаем новый график
    const onlineChart = new Chart(onlineCtx, {
        type: 'line',
        data: {
            labels: labels.map(label => new Date(label + '-01').toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })), // Формат "MMM YYYY"
            datasets: [{
                label: 'Активность по месяцам',
                data: data, // Суммарная активность за месяц
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.3,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Месяц'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Количество посещений'
                    },
                    beginAtZero: true
                }
            }
        }
    });

    // Сохраняем график для возможного уничтожения в будущем
    onlineChartElement.chart = onlineChart;
    // Уничтожение старого графика сделок, если он существует
    const dealsChartElement = document.getElementById('deals-chart');
    if (dealsChartElement.chart) {
        dealsChartElement.chart.destroy();
    }

    // Построение комбинированного графика сделок как автор и покупатель
    buildDealsChart('deals-chart', userStats.serviceSaleDates, userStats.servicePurchaseDates);

    // Обновление платежных систем
    renderPaymentSystems(userStats.paymentSystems);
}


import { isUserProfileOpen, setProfileOpen } from '../users-table/users-table.js';
// Установка слушателей событий
export function init() {
    const arrow = document.getElementsByClassName('back-arrow')[0].addEventListener('click', () => {
        setProfileOpen(false)
        showTab('users-table')
    })

    document.getElementById('user-view-edit-button').addEventListener('click', () => {
        showTab('edit-user')
    })
}

export function open() {
    console.log('user-view open');
}
