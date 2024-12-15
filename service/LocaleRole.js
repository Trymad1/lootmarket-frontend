export function getRole(role) {
    let userRole;
    if(role == "ROLE_ADMIN") {
        userRole = "Админ";
    } else if(role == "ROLE_USER") {
        userRole = "Пользователь";
    } else {
        userRole = "Модератор";
    }

    return userRole;
}