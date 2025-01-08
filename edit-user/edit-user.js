import { showTab } from "../LoadContent.js";

let nameField;
let mailField;

let userRoleField; 

let isBlockedCheckBox; 

let currentUser;

import { apiInstance as api } from "../service/BackendApi.js";

async function updateUser(user) {
    const body = {
        name: user.name,
        mail: user.mail,
        banned: user.banned,
        role: user.roles[0]
    }

    return await api.userService.changeUser(user.id, body);

}

import { setUpdateRequired } from "../users-view/users-view.js";
import { updateUserRowByMail } from "../users-table/users-table.js";
import { stateUtil } from "../service/StateService.js";
import { securityService } from "../service/SecurityService.js";

export async function init() {
    nameField = document.getElementById('edit-user-name');
    mailField = document.getElementById('edit-user-mail')
    
    userRoleField = document.getElementById('user-role-checkbox')
    
    isBlockedCheckBox = document.getElementById('user-edit-blocked')

    document.getElementById('close-button-edit').addEventListener('click', () => {
        showTab('users-view')
    })

    document.getElementById('accept-change-user').addEventListener("click", () => {
        if(!validateForm()) return;
        const oldMail = currentUser.mail;
        currentUser.name = nameField.value;
        currentUser.mail = mailField.value;

        currentUser.roles[0] = userRoleField.value;

        currentUser.banned = isBlockedCheckBox.checked;

        setUpdateRequired(true);
        updateUser(currentUser);
        stateUtil.userAdState.setUpdateRequired(true);
        stateUtil.dealsState.setUpdateRequired(true);
        updateUserRowByMail(oldMail, currentUser)
        showTab('users-view')
    })
    
}

function validateForm() {

    const userNameInput = document.getElementById('edit-user-name');
    const userNameErrorLabel = document.getElementById('edit-user-name-error');
    const userMailInput = document.getElementById('edit-user-mail');
    const userMailErrorLabel = document.getElementById('edit-user-mail-error');
    

    userNameErrorLabel.innerHTML = '';
    userMailErrorLabel.innerHTML = '';

    let isValid = true;

    const userName = userNameInput.value.trim().replace(/\s+/g, ' '); 
    const nameRegex = /^[A-Za-zА-Яа-яЁё\s]+$/; 

    if (!nameRegex.test(userName)) {
        userNameErrorLabel.innerHTML = 'Имя может содержать только буквы и пробелы.';
        isValid = false;
    } else {
        userNameInput.value = userName; 
    }


    const userEmail = userMailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    if (!emailRegex.test(userEmail)) {
        userMailErrorLabel.innerHTML = 'Некорректный email.';
        isValid = false;
    }

    return isValid; 
}

export function open() {
    const banFieldDiv = document.getElementById("user-edit-banned-section");
    const roleFiledDiv = document.getElementById("user-edit-role-section");
    banFieldDiv.style.display = "flex";
    roleFiledDiv.style.display = "flex";
    if(!securityService.permission.banUser(currentUser)) {
        banFieldDiv.style.display = "none";
    }

    if(!securityService.permission.changeUserRole(currentUser)) {
        roleFiledDiv.style.display = "none";
    }
}

export function setUserData(user) {
    currentUser = user;
    nameField.value = user.name;
    mailField.value = user.mail;

    console.log(isBlockedCheckBox)
    isBlockedCheckBox.checked = user.banned;

    console.log(user.roles[0])
    if(user.roles[0] == "ROLE_ADMIN") {
        userRoleField.selectedIndex = 0;
    } else if(user.roles[0] == "ROLE_USER") {
        userRoleField.selectedIndex = 1;
    } else if(user.roles[0] == "ROLE_FINANCY") {
        userRoleField.selectedIndex = 3;
    } else {
        userRoleField.selectedIndex = 2;
    }
}


