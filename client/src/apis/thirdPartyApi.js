import axios from 'axios'

const thirdPartyApi = axios.create({
	baseURL: 'https://api.external-service.com',
})

export default thirdPartyApi
