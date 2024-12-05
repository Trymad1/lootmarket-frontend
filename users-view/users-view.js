import { User } from '../model/User.js';
import { apiInstance as api } from '../service/BackendApi.js';

function populateUserDetails(user) {
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-createdAt').textContent = user.createdAt;
    document.getElementById('user-updatedAt').textContent = user.updatedAt;
}

export function loadUser(id) {
    const user = api.getUserById(id);
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-createdAt').textContent = user.createdAt;
    document.getElementById('user-updatedAt').textContent = user.updatedAt;
}

// Установка слушателей событий
export function init() {
    
}

export function open() {
    console.log('user-view open')
}
