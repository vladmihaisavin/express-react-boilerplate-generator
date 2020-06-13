import axios from 'axios'
import Cookies from 'js-cookie'

const getOptions = () => {
    const options = {
        baseURL: '/api',
        timeout: 5000,
        headers: {
            'Accepts': 'application/json',
            'Content-Type': 'application/json',
        },
        validateStatus: (status) => {
            return status < 500
        }
    }
    const token = Cookies.get('AUTH_TOKEN')
    if (token) {
        options.headers['Authorization'] = `Bearer ${ token }`
    }
    return options
}

const httpClient = axios.create(getOptions())

export default httpClient