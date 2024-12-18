

// Массивы для фейковых данных
let attendanceData = [];
let revenueData = [];
let userRegistrationData = [];
let charts = []; // Массив для хранения ссылок на графики

// Генерация случайной даты в формате YYYY-MM-DD
function generateRandomDate(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0]; // Возвращаем в формате YYYY-MM-DD
}

// Генерация фейковых данных для графиков
function generateFakeData(numRecords, startDate, endDate) {
    const data = [];
    for (let i = 0; i < numRecords; i++) {
        const randomDate = generateRandomDate(startDate, endDate);
        data.push(randomDate);
    }
    return data;
}

// Функция для получения уникальных месяцев
function getMonthLabels(data) {
    const months = new Set();
    data.forEach(date => {
        const month = date.slice(0, 7); // Вырезаем месяц (YYYY-MM)
        months.add(month);
    });
    return Array.from(months).sort(); // Сортируем месяцы
}

// Функция для инициализации данных
export function init() {
    const numRecords = 100;
    const startDate = '2023-01-01';
    const endDate = '2024-12-31';

    // Генерация фейковых данных
    attendanceData = generateFakeData(numRecords, startDate, endDate);
    revenueData = Array.from({ length: numRecords }, () => ({
        date: generateRandomDate(startDate, endDate),
        revenue: Math.floor(Math.random() * 10000)
    }));
    userRegistrationData = generateFakeData(numRecords, startDate, endDate);
}

// Функция для создания графиков
export function open() {
    // Удаление старых графиков, если они существуют
    charts.forEach(chart => {
        chart.destroy();
    });
    charts = []; // Очищаем массив ссылок на графики

    // Получаем уникальные месяцы для графиков
    const attendanceLabels = getMonthLabels(attendanceData);
    const attendanceCounts = attendanceLabels.map(month => {
        return attendanceData.filter(date => date.slice(0, 7) === month).length;
    });

    const revenueLabels = getMonthLabels(revenueData.map(item => item.date));
    const revenueCounts = revenueLabels.map(month => {
        return revenueData.filter(item => item.date.slice(0, 7) === month).reduce((sum, item) => sum + item.revenue, 0);
    });

    const userRegistrationLabels = getMonthLabels(userRegistrationData);
    const userRegistrationCounts = userRegistrationLabels.map(month => {
        return userRegistrationData.filter(date => date.slice(0, 7) === month).length;
    });

    // Строим график посещаемости
    const ctx1 = document.getElementById('stat-chart-1').getContext('2d');
    const chart1 = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: attendanceLabels,
            datasets: [{
                label: 'Посещаемость',
                data: attendanceCounts,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true
            }]
        }
    });
    charts.push(chart1); // Добавляем график в массив

    // Строим график доходов
    const ctx2 = document.getElementById('stat-chart-2').getContext('2d');
    const chart2 = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: revenueLabels,
            datasets: [{
                label: 'Заработанные деньги',
                data: revenueCounts,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                fill: true
            }]
        }
    });
    charts.push(chart2); // Добавляем график в массив

    // Строим график регистрации пользователей
    const ctx3 = document.getElementById('stat-chart-3').getContext('2d');
    const chart3 = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: userRegistrationLabels,
            datasets: [{
                label: 'Зарегистрированные пользователи',
                data: userRegistrationCounts,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true
            }]
        }
    });
    charts.push(chart3); // Добавляем график в массив
}
