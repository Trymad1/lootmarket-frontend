import { apiInstance as api } from '../service/BackendApi.js';
import { showTab } from '../LoadContent.js';
import { getRole } from '../service/LocaleRole.js';

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleString(); 
}

function renderPaymentSystems(paymentSystems) {
    const container = document.getElementById('payment-systems-container');
    container.innerHTML = ''; 

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

    if (dealsChartElement.chart) {
        dealsChartElement.chart.destroy();
    }

    const ctx = dealsChartElement.getContext('2d');

    const groupByMonth = (dates) => {
        return dates.reduce((acc, date) => {
            const month = date.slice(0, 7); 
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});
    };

    const groupedAuthorData = groupByMonth(dealsAsAuthorStats);
    const groupedBuyerData = groupByMonth(dealsAsBuyerStats);

    const labels = [...new Set([
        ...Object.keys(groupedAuthorData),
        ...Object.keys(groupedBuyerData),
    ])].sort();

    const authorData = labels.map(month => groupedAuthorData[month] || 0);
    const buyerData = labels.map(month => groupedBuyerData[month] || 0);

    dealsChartElement.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(label => new Date(label + '-01').toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })),
            datasets: [
                {
                    label: 'Услуг продано',
                    data: authorData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.3,
                    fill: false,
                },
                {
                    label: 'Услуг куплено',
                    data: buyerData,
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

let currentUser;

export async function loadUser(user) {
    
    currentUser = user;
    const userStats = await api.userService.getUserStats(user.id);
    console.log(userStats);

    document.getElementById('user-id').textContent = user.id;
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.mail;
    document.getElementById('user-created-at').textContent = formatDateTime(user.registrationDate);
    document.getElementById('user-updated-at').textContent = formatDateTime(user.lastUpdate);
    
    document.getElementById('user-blocked').textContent = user.banned == true ? "Да" : "Нет";

    let userRole = getRole(user.roles[0]);
    
    document.getElementById('user-role-view').textContent = userRole;

    document.getElementById('user-services-count').textContent = userStats.servicesPosted;
    document.getElementById('user-deals-author').textContent = userStats.servicesSold;
    document.getElementById('user-deals-buyer').textContent = userStats.servicesPurchased;

    const onlineChartElement = document.getElementById('online-stats-chart');
    if (onlineChartElement.chart) {
        onlineChartElement.chart.destroy();
    }

    const onlineCtx = onlineChartElement.getContext('2d');

    const groupByMonth = (dates) => {
        return dates.reduce((acc, date) => {
            const month = date.slice(0, 7); 
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {});
    };

    const groupedActivity = groupByMonth(userStats.activityDates);

    const labels = Object.keys(groupedActivity).sort();
    const data = labels.map(month => groupedActivity[month]); 

    const onlineChart = new Chart(onlineCtx, {
        type: 'line',
        data: {
            labels: labels.map(label => new Date(label + '-01').toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' })), 
            datasets: [{
                label: 'Активность по месяцам',
                data: data, 
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

    onlineChartElement.chart = onlineChart;
    const dealsChartElement = document.getElementById('deals-chart');
    if (dealsChartElement.chart) {
        dealsChartElement.chart.destroy();
    }

    buildDealsChart('deals-chart', userStats.serviceSaleDates, userStats.servicePurchaseDates);

    renderPaymentSystems(userStats.paymentSystems);
}


import { isUserProfileOpen, setProfileOpen } from '../users-table/users-table.js';
import { setUserData } from '../edit-user/edit-user.js';
import { securityService } from '../service/SecurityService.js';

export function init() {
    const backArrow = document.getElementsByClassName('back-arrow')[0];
    if(securityService.permission.role() == "ROLE_USER") {
        backArrow.style.display = "none";
    } else {
        backArrow.addEventListener('click', () => {
            setProfileOpen(false)
            showTab('users-table')
        })
    }

    if(securityService.permission.changeUser()) {
        document.getElementById('user-view-edit-button').addEventListener('click', () => {
            setUserData(currentUser)
            showTab('edit-user')
        })
    } else {
        document.getElementById('user-view-edit-button').style.display = "none";
    }
}

let updateRequired;

export function setUpdateRequired(boolean) {
    updateRequired = boolean;
}
export function open() {
    if(updateRequired) {
        loadUser(currentUser)
        updateRequired = false;
    }
}
