import { User } from '../model/User.js'
import { restClient } from '../web/RestClient.js';


const users = [];

function generateUsers(count) {
    for (let i = 1; i <= count; i++) {
        users.push(new User(i)); // Создаем нового пользователя с уникальным ID
    }
}

generateUsers(40);
class BackendApi {

    constructor() {
        this.userService = new UserService();
    }

    getUserById(id) {
       return users.find(user => user.id === id);
    }

    getAll() {
        return users.slice();
    }

}

class UserService {

    async getUsers() {
        return await restClient.get("/users");
    }

    async getUserById(id) {
        return await restClient.get("/users/" + id)
    }

    async getUserStats(id) {
        console.log(`/users/${id}/stats`);
        return await restClient.get(`/users/${id}/stats`)
    }



}
export const apiInstance = new BackendApi();

