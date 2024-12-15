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
export async function init() {
    nameField = document.getElementById('edit-user-name');
    mailField = document.getElementById('edit-user-mail')
    
    userRoleField = document.getElementById('user-role')
    
    isBlockedCheckBox = document.getElementById('user-edit-blocked')

    document.getElementById('close-button-edit').addEventListener('click', () => {
        showTab('users-view')
    })

    document.getElementById('accept-change-user').addEventListener("click", () => {
        const oldMail = currentUser.mail;
        currentUser.name = nameField.value;
        currentUser.mail = mailField.value;

        currentUser.roles[0] = userRoleField.value;

        currentUser.banned = isBlockedCheckBox.checked;

        setUpdateRequired(true);
        updateUser(currentUser);
        updateUserRowByMail(oldMail, currentUser)
        showTab('users-view')
    })
    
}

export function open() {
    
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
    } else {
        userRoleField.selectedIndex = 2;
    }
}


