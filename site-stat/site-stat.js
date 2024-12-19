import { apiInstance as api} from "../service/BackendApi.js";


let activitiesTime = [];
let profitData = [];
let registrationTimes = [];
let charts = []; 

export function toIso(date) {
    return new Date(date).toISOString().split('.')[0];
}


let dateFromFilter;
let dateToFilter;
export async function init() {
    dateFromFilter = document.getElementById("stats-date-from");
    dateToFilter = document.getElementById("stats-date-to");
    
    dateFromFilter.addEventListener('change', () => {
        updateStat();
    })

    dateToFilter.addEventListener('change', () => {
        updateStat();
    })

    const numRecords = 100;
    const startDate = '2023-01-01';
    const endDate = '2024-12-31';

    updateStat();

}

async function updateStat() {
    await loadStats();
    await open();
    renderInfo();
}
async function loadStats() {
    const dateFrom = dateFromFilter.value ? toIso(dateFromFilter.value) : null;
    const dateTo = dateToFilter.value ? toIso(dateToFilter.value) : null;

    const statsByDate = await api.stats.getByDate(dateFrom, dateTo)
    activitiesTime = statsByDate.activities.flat();
    
}

function groupDatesByMonth(dates) {
    const monthCounts = {}; // О    бъект для хранения количества записей для каждого месяца

    dates.forEach(date => {
        const monthYear = date.slice(0, 7); // Получаем строку вида 'YYYY-MM' для группировки
        if (!monthCounts[monthYear]) {
            monthCounts[monthYear] = 0;
        }
        monthCounts[monthYear] += 1; // Увеличиваем счетчик для месяца
    });

    // Преобразуем объект в массив для использования в графике
    const months = Object.keys(monthCounts);
    const counts = months.map(month => monthCounts[month]);

    return { months, counts };
}

function renderInfo() {
    charts.forEach(chart => {
        chart.destroy();
    });
    charts = []; 

    console.log(activitiesTime)
    const groupActivyDates = groupDatesByMonth(activitiesTime);


    const ctx1 = document.getElementById('stat-chart-1').getContext('2d');
    const chart1 = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: groupActivyDates.months,
            datasets: [{
                label: 'Посещаемость',
                data: groupActivyDates.counts,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true
            }]
        }
    });
    charts.push(chart1); // Добавляем график в массив

    // // Строим график доходов
    // const ctx2 = document.getElementById('stat-chart-2').getContext('2d');
    // const chart2 = new Chart(ctx2, {
    //     type: 'bar',
    //     data: {
    //         labels: revenueLabels,
    //         datasets: [{
    //             label: 'Заработанные деньги',
    //             data: revenueCounts,
    //             borderColor: 'rgba(153, 102, 255, 1)',
    //             backgroundColor: 'rgba(153, 102, 255, 0.2)',
    //             fill: true
    //         }]
    //     }
    // });
    // charts.push(chart2); // Добавляем график в массив

    // // Строим график регистрации пользователей
    // const ctx3 = document.getElementById('stat-chart-3').getContext('2d');
    // const chart3 = new Chart(ctx3, {
    //     type: 'line',
    //     data: {
    //         labels: userRegistrationLabels,
    //         datasets: [{
    //             label: 'Зарегистрированные пользователи',
    //             data: userRegistrationCounts,
    //             borderColor: 'rgba(255, 99, 132, 1)',
    //             backgroundColor: 'rgba(255, 99, 132, 0.2)',
    //             fill: true
    //         }]
    //     }
    // });
    // charts.push(chart3); // Добавляем график в массив

}
export async function open() {

}
