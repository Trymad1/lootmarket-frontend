import { apiInstance as api } from "./BackendApi.js";

class SecurityService {


    currentUser = {};

    constructor() {

    }
    
    async login(login, password) {
        const response = await api.login(login, password);
        if(response === false) return false;
        const payload = this.parseJwt(api.getCurrentToken())
        console.log(payload.sub);
        console.log(payload.roles);

         return response;
    

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