import { apiInstance as api } from "./BackendApi.js";
import { clear } from "../LoadContent.js";

class SecurityService {


    currentUser = {};

    constructor() {

    }
    
    async login(login, password) {
        const response = await api.login(login, password);
        if(response === false) return false;
        const payload = this.parseJwt(api.getCurrentToken())
        document.getElementById("user-name-panel").innerHTML = payload.name;
        document.getElementById("user-email-panel").innerHTML = payload.sub;

        return response;
    

    }

    async logout() {
        await clear();
        document.getElementById('login-page-content').style.display = "flex";
    }

    parseJwt(token) {

        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT token');
        }
    
        const payload = atob(parts[1]);
    
        const parsedPayload = JSON.parse(payload);
    
        return parsedPayload;
    }

}

export const securityService = new SecurityService();