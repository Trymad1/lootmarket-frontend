export class User {
    constructor(id) {
        this.id = id;
        this.name = `User${id}`;
        this.email = `user${id}@example.com`;
        this.createdAt = new Date().toISOString(); // Текущая дата и время в ISO формате
        this.updatedAt = new Date().toISOString(); // Аналогично для последнего обновления
    }
}
