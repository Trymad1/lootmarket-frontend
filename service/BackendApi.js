import { restClient } from '../web/RestClient.js';


const users = [];
class BackendApi {

    constructor() {
        this.userService = new UserService();
        this.adService = new UserAdService();
    }

    async login(login, password) {
        try {
            const token = await restClient.fetchToken(login, password);
            restClient.setAuth(token);

            return true;
        } catch (error) {
            return false;
        }
    }

    getCurrentToken() {
        return restClient.token;
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

    async changeUser(id, body) {
        return await restClient.put(`/users/${id}`, body);
    }

}

class UserAdService {

    async getAllAds() {
        return await restClient.get("/services");
    }

}
export const apiInstance = new BackendApi();

