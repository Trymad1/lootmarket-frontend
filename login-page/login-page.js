import { securityService } from "../service/SecurityService.js";
import { loadTabContent } from "../LoadContent.js";

const loginForm = document.getElementById('login-form');

 loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    loginUser(email, password);
});

loginUser("Oleg@gmail.com", "password")
async function loginUser(email, password) {
        
        const errorContainer = document.getElementById('login-error');
        const errorList = errorContainer.querySelector('ul');
    
        
        const response = await securityService.login(email, password);
        if(response === true) {
            if(!securityService.permission.loginAccess()) {
                errorContainer.innerHTML = "Данный пользователь заблокирован";
                errorContainer.style.display = "flex";
                return;
            }

            errorContainer.style.display = 'none';
            document.getElementById("login-page-content").style.display = "none";
            document.getElementById("sidebar").style.display = "flex";
            loadTabContent();
        } else {
            errorContainer.innerHTML = "Неверная почта или пароль";
            errorContainer.style.display = "flex";
        }
} 

