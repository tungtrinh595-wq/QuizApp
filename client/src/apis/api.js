import axios from 'axios'

const baseURL = import.meta.env.VITE_APP_BASE_URL

const api = axios.create({
	baseURL,
	validateStatus: (status) => status >= 200 && status < 300,
})

export default api
