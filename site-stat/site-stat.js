import { apiInstance as api} from "../service/BackendApi.js";


let activitiesTime = [];
let dealsArr = [];
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
    allUsersRegistration = document.getElementById("all-users-stat");
    allServicePlaced = document.getElementById("all-services-placed");

    dateFromFilter.addEventListener('change', () => {
        updateStat();
    })

    dateToFilter.addEventListener('change', () => {
        updateStat();
    })

    document.getElementById("deal-report-open").addEventListener('click', async () => {
        const dateFrom = dateFromFilter.value ? toIso(dateFromFilter.value) : null;
        const dateTo = dateToFilter.value ? toIso(dateToFilter.value) : null;
        const pdf = await api.stats.getReport("deals", {dateFrom, dateTo});
        const pdfUrl = URL.createObjectURL(pdf);
        window.open(pdfUrl, '_blank');             
        URL.revokeObjectURL(pdfUrl);              
    });

    const downloadLinkDealReport = document.getElementById("deal-report-download-link");
    document.getElementById("deal-report-download").addEventListener('click', async (event) => {
        const dateFrom = dateFromFilter.value ? toIso(dateFromFilter.value) : null;
        const dateTo = dateToFilter.value ? toIso(dateToFilter.value) : null;

        const pdf = await api.stats.getReport("deals", {dateFrom, dateTo});

        const dateFromStr = dateFrom == null ? formatDate(new Date(2020, 0, 1)) : formatDate(new Date(dateFrom));
        const dateToStr = dateTo == null ? formatDate(new Date(Date.now())) : formatDate(new Date(dateTo));
        
        const pdfUrl = URL.createObjectURL(pdf);
        downloadLinkDealReport.href = pdfUrl;   
        downloadLinkDealReport.download = `Отчет о сделках ${dateFromStr}—${dateToStr} ${formatDate(new Date(Date.now()))}.pdf`;
        downloadLinkDealReport.click();

        URL.revokeObjectURL(pdfUrl);     
    });

    

    updateStat();
}

function formatDate(date) {
    const year = date.getFullYear(); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
  
    return `${year}.${month}.${day}`;
  }


let allDealsCount;
let allDealsValue;
let allDealsProfit;
let allUsersRegistration;
let allServicePlaced;
async function updateStat() {
    const statsByDate = await loadStats();
    activitiesTime = statsByDate.activities.flat();
    registrationTimes = statsByDate.registration.flat();
    dealsArr = statsByDate.deals.flat();
    allDealsCount.innerHTML = statsByDate.deals.flat().length
    allUsersRegistration.innerHTML = statsByDate.registration.flat().length
    allServicePlaced.innerHTML = statsByDate.services.flat().length;
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

function groupDealsByMonth(deals) {
    const monthSums = {}; 

    deals.forEach(deal => {
        const monthYear = deal.time.slice(0, 7); 
        
        if (!monthSums[monthYear]) {
            monthSums[monthYear] = 0;
        }
        
        monthSums[monthYear] += deal.sum;
    });

    const months = Object.keys(monthSums);
    const sums = months.map(month => monthSums[month]);

    return { months, sums };
}

function renderInfo() {
    charts.forEach(chart => {
        chart.destroy();
    });
    charts = []; 

    const groupActivyDates = groupDatesByMonth(activitiesTime);
    const registrationUser = groupDatesByMonth(registrationTimes);
    const dealsByMoths = groupDealsByMonth(dealsArr);

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
            labels: dealsByMoths.months,
            datasets: [{
                label: 'Оборот средств',
                data: dealsByMoths.sums,
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
            labels: registrationUser.months,
            datasets: [{
                label: 'Зарегистрированные пользователи',
                data: registrationUser.counts,
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
