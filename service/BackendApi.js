import { toIso } from '../site-stat/site-stat.js';
import { restClient } from '../web/RestClient.js';


const users = [];
class BackendApi {

    constructor() {
        this.userService = new UserService();
        this.adService = new UserAdService();
        this.reviewService = new ReviewService();
        this.paymentSystemService = new PaymentSystemService();
        this.stats = new StatService();
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

    async deleteById(id) {
        return await restClient.delete(`/services/${id}`);
    }

    async getDealsByServiceId(id) {
        return await restClient.get(`/deals/${id}`);
    }

    async updateDeal(updateDeal = {}, dealId) {
        return await restClient.put(`/deals/${dealId}`, updateDeal);
    }
    
    async deleteDealById(dealId) {
        return await restClient.delete(`/deals/${dealId}`)
    }
}

class ReviewService {

    async getAllByServiceId(id) {
        return await restClient.get(`/reviews/${id}`)
    }

    async deleteById(id) {
        return await restClient.delete(`/reviews/${id}`)
    }
}

class PaymentSystemService {

    async getAll() {
        return await restClient.get("/paymentSystems");
    }

}

class StatService {


    async getByDate(fromParam, toParam) {
        const params = {
            from: fromParam,
            to: toParam
        }
        console.log(params);
        return await restClient.get("/stats", params);
    }

    async getReport(reportEndpoint, param) {
        const params = {
            from: param.dateFrom,
            to: param.dateTo
        }
        return await restClient.getPdf(`/report/${reportEndpoint}`, params);
    }
}



export const apiInstance = new BackendApi();

