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
    

    allDealsCount = document.getElementById("all-deals-count");
    allDealsValue = document.getElementById("all-deals-value");
    allDealsProfit = document.getElementById("all-deals-profit");

    dateFromFilter.addEventListener('change', () => {
        updateStat();
    })

    dateToFilter.addEventListener('change', () => {
        updateStat();
    })

    updateStat();

}


let allDealsCount;
let allDealsValue;
let allDealsProfit;
async function updateStat() {
    const statsByDate = await loadStats();
    activitiesTime = statsByDate.activities.flat();
    allDealsCount.innerHTML = statsByDate.deals.flat().length
    console.log(statsByDate.deals)

    let sumProfit = 0;
    allDealsValue.innerHTML = BigInt(statsByDate.deals.reduce( (sum, item) =>  {
        sum += item.sum;
        sumProfit += (item.sum * 0.15);
        return sum;
    }, 0)).toLocaleString('ru-RU');

    allDealsProfit.innerHTML = Math.floor(sumProfit).toLocaleString('ru-RU');;
    renderInfo();
}
async function loadStats() {
    const dateFrom = dateFromFilter.value ? toIso(dateFromFilter.value) : null;
    const dateTo = dateToFilter.value ? toIso(dateToFilter.value) : null;

    return await api.stats.getByDate(dateFrom, dateTo)
}

function groupDatesByMonth(dates) {
    const monthCounts = {}; 

    dates.forEach(date => {
        const monthYear = date.slice(0, 7); 
        if (!monthCounts[monthYear]) {
            monthCounts[monthYear] = 0;
        }
        monthCounts[monthYear] += 1; 
    });

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
                label: 'Посещаемость сайта',
                data: groupActivyDates.counts,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true
            }]
        }
    });
    charts.push(chart1); 

    const ctx2 = document.getElementById('stat-chart-2').getContext('2d');
    const chart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Оборот средств',
                data: [],
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true
            }]
        }
    });
    charts.push(chart2);

    const ctx3 = document.getElementById('stat-chart-3').getContext('2d');
    const chart3 = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Зарегистрированные пользователи',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true
            }]
        }
    });
    charts.push(chart3); 

}
export async function open() {

}
