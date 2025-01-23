// const Redis = require('ioredis')
// const redis = new Redis()
// module.exports = redis


require('dotenv') // Load environment variables from .env file
const Redis = require('ioredis')

// Use the REDIS_URL from the environment variable
const redis = new Redis(process.env.REDIS_URL)

module.exports = redis
