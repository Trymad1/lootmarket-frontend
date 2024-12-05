import { User } from '../model/User.js';

function populateUserDetails(user) {
    document.getElementById('user-name').textContent = user.name;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-createdAt').textContent = user.createdAt;
    document.getElementById('user-updatedAt').textContent = user.updatedAt;
}

export function loadUser(user) {
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
