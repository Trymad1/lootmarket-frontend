export function getRole(role) {
    let userRole;
    if(role == "ROLE_ADMIN") {
        userRole = "Администратор";
    } else if(role == "ROLE_USER") {
        userRole = "Пользователь";
    } else if(role == "ROLE_MODERATOR"){
        userRole = "Модератор";
    } else if(role == "ROLE_FINANCY"){
        userRole = "Бухгалтер";
    }else {
        userRole = "none";
    }

    return userRole;
}