import Agenda from 'agenda'
import mongoose from 'mongoose'

import { dbConnection } from '../src/constants/index.js'
import ResultAnswer from '../src/models/ResultAnswer.js'

const agenda = new Agenda({
	db: {
		address: dbConnection,
		collection: 'agendaJobs',
	},
})

agenda.define('preserveQuestionSnapshot', async (job) => {
	try {
		const { question } = job.attrs.data
		if (!question) {
			console.warn(`⚠️ Question not found: ${question.id}`)
			return
		}

		const snapshotAnswers = question.answers?.map((a) => {
			const answer = a.toObject?.() || a
			return {
				id: answer._id?.toString(),
				answer: answer.answer,
				isCorrect: answer.isCorrect,
			}
		})

		const result = await ResultAnswer.updateMany(
			{ question: question.id, 'log.question': { $exists: false } },
			{
				$set: {
					log: {
						question: question.question,
						type: question.type,
						explanation: question.explanation,
						answers: snapshotAnswers,
					},
				},
			}
		)

		if (result.modifiedCount > 0) console.log(`✅ Snapshot updated ${result.modifiedCount} entries`)
	} catch (error) {
		console.error('❌ Error in preserveQuestionSnapshot:', error)
	}
})

agenda.define('cleanupOldJobs', async () => {
	await mongoose.connect(dbConnection)
	const jobs = mongoose.connection.db.collection('agendaJobs')
	const cutoff = new Date()
	const result = await jobs.deleteMany({
		lastFinishedAt: { $lte: cutoff },
		nextRunAt: null,
		failedAt: { $exists: false },
	})
	if (result.deletedCount > 0) console.log(`🧹 Deleted ${result.deletedCount} completed jobs`)
})

agenda.on('error', (err) => {
	console.error('❌ Agenda connection error:', err)
})

export default agenda
