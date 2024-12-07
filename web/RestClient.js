class RestClient {

    constructor(apiDomen) {
        this.domen = "http://localhost:8080/api"
        this.token;
    }

    async init(login, password) {
        const token = await this.fetchToken(login, password);
        this.setAuth(token);
    }

    async get(endpoint) {
        const response = await axios.get(`${this.domen}${endpoint}`, {
            headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {} // Добавляем токен в заголовки, если он есть
        })

        return response.data

    }

    setAuth(token) {
        this.token = token;
    }

    async fetchToken(login, password) {
        const loginBody = {
            mail: login,
            password: password
        };

        const responseToken = await axios.post(`${this.domen}/auth/login`, loginBody);
        return responseToken.data.token
    }
}


const restClient = new RestClient();
await restClient.init('Oleg@gmail.com', 'password');
export { restClient };