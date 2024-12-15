import { securityService } from "../service/SecurityService.js";
import { loadTabContent } from "../LoadContent.js";

const loginForm = document.getElementById('login-form');

 loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    loginUser();
});

async function loginUser() {
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
    
       
        const errorContainer = document.getElementById('login-error');
        const errorList = errorContainer.querySelector('ul');
    
        
        const response = await securityService.login(email, password);

        if(response === true) {
            errorContainer.style.display = 'none';
            document.getElementById("login-page-content").style.display = "none";
            document.getElementById("sidebar").style.display = "flex";
            loadTabContent();
        } else {
            errorContainer.style.display = "flex";
        }
} 
