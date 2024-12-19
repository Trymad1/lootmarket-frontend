class RestClient {

    constructor(apiDomen) {
        this.domen = "http://backend:8080/api"
        this.token;
    }

    async get(endpoint, queryParams) {
        const response = await axios.get(`${this.domen}${endpoint}`, {
            headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
            params: queryParams ? queryParams : {}
        })

        return response.data
    }

    async put(endpoint, body) {
        const response = await axios.put(`${this.domen}${endpoint}`, body , {
            headers: this.token ? { 
                'Authorization': `Bearer ${this.token}` ,
                'Content-Type': 'application/json'
            } : {},
        })

        return response.data
    }

    async delete(endpoint) {
        const response = await axios.delete(`${this.domen}${endpoint}`, {
            headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {}
        })

        return true;
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
export { restClient };