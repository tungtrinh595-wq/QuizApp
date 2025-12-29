import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet, { contentSecurityPolicy } from 'helmet'

import { clientUrl, isProduction, dbConnection, HTTP_STATUS } from './constants/index.js'
import { limiter } from './middleware/rateLimiter.js'
import { seedDb } from './utils/seed.js'
import agenda from '../jobs/agenda.js'
import routes from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

// Middleware
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

app.get('/health', (req, res) => res.status(HTTP_STATUS.OK).send('OK'))

app.use(
	cors({
		origin: clientUrl,
		credentials: true,
		allowedHeaders: ['Content-Type', 'Authorization'],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	})
)

app.options(/.*/, cors())

app.set('trust proxy', 1)
app.use(helmet())
app.use(
	contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'"],
			objectSrc: ["'none'"],
			upgradeInsecureRequests: [],
		},
	})
)

app.use(limiter)

// DB Connection
mongoose.set('strictQuery', true)
mongoose
	.connect(dbConnection)
	.then(async () => {
		console.log('MongoDB Connected...')
		await seedDb()
		await agenda.start()
		await agenda.every('1 day', 'cleanupOldJobs')
	})
	.catch((err) => {
		console.error('MongoDB connection error:', err)
		process.exit(1)
	})

// Routes
app.use('/', routes)

// error handle
app.use(errorHandler)

process.on('SIGINT', async () => {
	console.log('Shutting down...')
	await mongoose.disconnect()
	process.exit(0)
})

// Server
if (isProduction) {
	try {
		const port = process.env.PORT || 443
		// const httpsOptions = {
		// 	key: readFileSync(process.env.SSL_KEY_PATH || resolve(process.cwd(), 'security/cert.key')),
		// 	cert: readFileSync(process.env.SSL_CERT_PATH || resolve(process.cwd(), 'security/cert.pem')),
		// };
		// https.createServer(httpsOptions, app).listen(port, () => {
		// 	console.log(`HTTPS server running at port ${port}`);
		// });
		app.listen(port, () => console.log(`Server started on port ${port}`))
	} catch (err) {
		console.log('Server error:', err.message)
	}
} else {
	const port = process.env.PORT || 5000
	app.listen(port, () => console.log(`Server started on port ${port}`))
}
