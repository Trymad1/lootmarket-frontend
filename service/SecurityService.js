import { apiInstance as api } from "./BackendApi.js";
import { clear } from "../LoadContent.js";
import { getRole } from "./LocaleRole.js";

class SecurityService {


    currentUser = {};

    constructor() {

    }
    
    async login(login, password) {
        const response = await api.login(login, password);
        if(response === false) return false;
        const payload = this.#parseJwt(api.getCurrentToken())
        this.currentUser = await api.userService.getUserById(payload.id);
        document.getElementById("user-name-panel").innerHTML = this.currentUser.name;
        document.getElementById("user-email-panel").innerHTML = this.currentUser.mail;
        document.getElementById("user-role-panel").innerHTML = getRole(this.currentUser.roles[0]);
        console.log(this.currentUser);
        return response;
    

    }

    async logout() {
        await clear();
        document.getElementById('login-page-content').style.display = "flex";
    }

    #parseJwt(token) {

        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT token');
        }
    
        const payload = atob(parts[1]);
    
        const parsedPayload = JSON.parse(payload);
    
        return parsedPayload;
    }
    
    getCurrentUser() {
        return this.currentUser;
    }

}

export const securityService = new SecurityService();