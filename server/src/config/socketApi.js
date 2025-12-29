import axios from 'axios'

const socketApi = axios.create({
	baseURL: process.env.SOCKET_SERVER_URL,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
	},
})

socketApi.interceptors.response.use(
	(res) => res,
	(err) => {
		if (err.code === 'ECONNREFUSED') {
			console.error('❌ Không kết nối được socket server')
		} else {
			console.error('❌ Lỗi Axios')
		}
		return Promise.reject(err)
	}
)

export const safeSocketPost = async (url, data) => {
	try {
		const res = await socketApi.post(url, data)
		return res.data
	} catch (err) {
		console.error(`[Socket Error] ${err.code || 'UNKNOWN'}: ${err.message}`)
	}
}

export default socketApi
