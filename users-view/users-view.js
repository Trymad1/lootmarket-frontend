import { apiInstance as api } from '../service/BackendApi.js';
import { showTab } from '../LoadContent.js';

function populateUserDetails(user) {
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-createdAt').textContent = user.createdAt;
    document.getElementById('user-updatedAt').textContent = user.updatedAt;
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
            <span class="payment-system-label">${system}</span>
        `;
        container.appendChild(div);
    });
}

// Функция для построения комбинированного графика сделок
function buildDealsChart(elementId, dealsAsAuthorStats, dealsAsBuyerStats) {
    const dealsChartElement = document.getElementById(elementId);
    
    // Уничтожение старого графика сделок, если он существует
    if (dealsChartElement.chart) {
        dealsChartElement.chart.destroy();
    }

    const ctx = dealsChartElement.getContext('2d');

    // Месяцы как метки на оси X
    const labels = [...new Set([ 
        ...Object.keys(dealsAsAuthorStats), 
        ...Object.keys(dealsAsBuyerStats)
    ])].sort(); // Собираем все уникальные месяцы и сортируем

    // Создаем массивы данных для сделок как автор и покупатель
    const authorData = labels.map(month => dealsAsAuthorStats[month] || 0);
    const buyerData = labels.map(month => dealsAsBuyerStats[month] || 0);

    // Создание нового графика
    const dealsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, // Месяцы
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
                    }
                }
            }
        }
    });

    // Сохраняем график для возможного уничтожения в будущем
    dealsChartElement.chart = dealsChart;
}


export function loadUser(id) {
    const user = api.getUserById(id);

    // Обновляем информацию о пользователе
    document.getElementById('user-id').textContent = user.id;
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-created-at').textContent = formatDateTime(user.createdAt);
    document.getElementById('user-updated-at').textContent = formatDateTime(user.updatedAt);
    document.getElementById('user-blocked').textContent = user.blocked

    // Обновление статистики
    document.getElementById('user-services-count').textContent = user.servicesCount;
    document.getElementById('user-deals-author').textContent = user.dealsAsAuthor;
    document.getElementById('user-deals-buyer').textContent = user.dealsAsBuyer;

    // Уничтожение старого графика онлайн-активности, если он существует
    const onlineChartElement = document.getElementById('online-stats-chart');
    if (onlineChartElement.chart) {
        onlineChartElement.chart.destroy();
    }

    // Построение графика онлайн-активности
    const onlineCtx = onlineChartElement.getContext('2d');
    const onlineChart = new Chart(onlineCtx, {
        type: 'line',
        data: {
            labels: user.onlineStat.map(date => new Date(date).toLocaleDateString()), // Метки по датам
            datasets: [{
                label: 'График активности',
                data: user.onlineStat.map(date => new Date(date).getHours()), // Часы активности
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
                        text: 'Дата'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Посещения'
                    }
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
    buildDealsChart('deals-chart', user.dealsAsAuthorStats, user.dealsAsBuyerStats);

    // Обновление платежных систем
    renderPaymentSystems(user.paymentSystems);
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
