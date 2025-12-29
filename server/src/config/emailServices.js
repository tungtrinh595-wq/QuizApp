import nodemailer from 'nodemailer'
import { mailtrapHost, mailtrapUsername, mailtrapPassword } from '../constants/index.js'

const transporter = nodemailer.createTransport({
	host: mailtrapHost,
	port: 587,
	auth: {
		user: mailtrapUsername,
		pass: mailtrapPassword,
	},
})

export const sendMail = async ({ to, subject, html }) => {
	await transporter.sendMail({
		from: '"Quiz App" <no-reply@quizapp.dev>',
		to,
		subject,
		html,
	})
}
