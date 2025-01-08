import { apiInstance as api } from "./BackendApi.js";
import { clear } from "../LoadContent.js";
import { getRole } from "./LocaleRole.js";

class SecurityService {


    currentUser = {};
    permission;

    constructor() {
        this.permission = new Permission();
    }
    
    async login(login, password) {
        const response = await api.login(login, password);
        if(response === false) return false;
        const payload = this.#parseJwt(api.getCurrentToken())
        this.currentUser = await api.userService.getUserById(payload.id);
        document.getElementById("user-name-panel").innerHTML = this.currentUser.name;
        document.getElementById("user-email-panel").innerHTML = this.currentUser.mail;
        document.getElementById("user-role-panel").innerHTML = getRole(this.currentUser.roles[0]);
        this.permission.setUser(this.currentUser);
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

class Permission {
    
    currentUser;

    constructor(user) {
        this.currentUser = user;
    }

    setUser(user) {
        this.currentUser = user;
    }

    role() {
        // return this.currentUser.roles[0];
        return "ROLE_ADMIN";
    }

    changeUser() {
        return this.role() == "ROLE_ADMIN" || this.role() == "ROLE_MODERATOR";
    }

    banUser(targetUser) {
        let predicate = targetUser.id != this.currentUser.id && targetUser.roles[0] != "ROLE_ADMIN";
        if(this.role() == "ROLE_MODERATOR") {
            predicate = predicate && targetUser.roles[0] != "ROLE_MODERATOR"
        }

        return predicate;
    }

    viewAllUsers() {
        return this.role() != "ROLE_USER";
    }

    viewStats() {
        return this.role() != "ROLE_USER";
    }

    viewDeals() {
        return this.role() != "ROLE_USER";
    }

    changeDeals() {
        return this.role() == "ROLE_MODERATOR" || this.role() == "ROLE_ADMIN";
    }   

    loginAccess() {
        return !this.currentUser.banned;
    }

    changeUserRole(targetUser) {
        return this.role() == "ROLE_ADMIN" && 
        this.currentUser.id != targetUser.id && 
        targetUser.roles[0] != "ROLE_ADMIN";
    }

}

export const securityService = new SecurityService();