import { User } from '../model/User.js'


const users = [];

function generateUsers(count) {
    for (let i = 1; i <= count; i++) {
        users.push(new User(i)); // Создаем нового пользователя с уникальным ID
    }
}

generateUsers(40);


export class BackendApi {

    constructor() {

    }

    getUserById(id) {
       return users.find(user);
    }

    getAll() {
        return users.slice();
    }

}