"use strict"

const HOST = "https://blog-app-api-iota.vercel.app"

const swaggerAutogen = require('swagger-autogen')()
const packageJson = require('./package.json')

const document = {
	info: {
		version: packageJson.version,
		title: packageJson.title,
		description: packageJson.description,
		termsOfService: "https://furkandogu.vercel.app/",
		contact: { name: packageJson.author, email: "furkandogu2018@gmail.com" },
		license: { name: packageJson.license, },
	},
	host: `${HOST}`,
	basePath: '/',
	schemes: ['https'],
	consumes: ["application/json"],
	produces: ["application/json"],
	securityDefinitions: {
		Token: {
			type: 'apiKey',
			in: 'header',
			name: 'Authorization',
			description: 'Simple Token Authentication * Example: <b>Token ...tokenKey...</b>'
		},
	},
	security: [{ Token: [] }],
}

const routes = ['./index.js']
const outputFile = './src/configs/swagger.json'

swaggerAutogen(outputFile, routes, document)