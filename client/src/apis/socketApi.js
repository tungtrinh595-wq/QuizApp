import axios from 'axios'

const baseURL = import.meta.env.VITE_SOCKET_URL

const socketApi = axios.create({
	baseURL,
	validateStatus: (status) => status >= 200 && status < 300,
})

export default socketApi
