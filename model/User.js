export class User {
    constructor(id) {
        this.id = id;
        this.name = `User${id}`;
        this.email = `user${id}@example.com`;

        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();

        this.servicesCount = this.randomInt(0, 30);
        this.dealsAsAuthor = this.randomInt(0, 4);
        this.dealsAsBuyer = this.randomInt(5, 30);

        this.onlineStat = this.generateOnlineStats(this.randomInt(1, 10));
        this.paymentSystems = this.generatePaymentSystems(this.randomInt(1, 4));

        this.dealsAsAuthorStats = this.generateDealStats('author');
        this.dealsAsBuyerStats = this.generateDealStats('buyer');
    }

    /**
     * Генерация случайного целого числа в заданном диапазоне [min, max]
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Генерация массива случайных дат (в формате ISO)
     * @param {number} count Количество дат
     */
    generateOnlineStats(count) {
        const dates = [];
        for (let i = 0; i < count; i++) {
            const randomTimestamp = Date.now() - this.randomInt(0, 365 * 24 * 60 * 60 * 1000); // случайное время за последний год
            dates.push(new Date(randomTimestamp).toISOString());
        }
        return dates;
    }

    /**
     * Генерация случайного набора платежных систем
     * @param {number} count Количество платежных систем
     */
    generatePaymentSystems(count) {
        const paymentSystemsPool = ['Visa', 'MasterCard', 'PayPal', 'Stripe', 'Google Pay', 'Apple Pay'];
        const selectedSystems = new Set();

        while (selectedSystems.size < count) {
            const randomIndex = this.randomInt(0, paymentSystemsPool.length - 1);
            selectedSystems.add(paymentSystemsPool[randomIndex]);
        }

        return Array.from(selectedSystems);
    }

    /**
     * Генерация статистики сделок за временные промежутки
     * @param {string} type Тип статистики ('author' или 'buyer')
     */
    generateDealStats(type) {
        const periods = ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06', '2023-07', '2023-08', '2023-09', '2023-10', '2023-11', '2023-12'];
        const stats = {};

        periods.forEach(period => {
            stats[period] = this.randomInt(
                type === 'author' ? 0 : 5, // Минимальное значение зависит от типа сделки
                type === 'author' ? 4 : 30 // Максимальное значение зависит от типа сделки
            );
        });

        return stats;
    }
}
