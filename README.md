# Custom URL Shortener API

## Overview
The Custom URL Shortener API is a scalable Node.js-based application designed to simplify the sharing of long, complex URLs by converting them into short, manageable links. It offers advanced analytics, user authentication via Google Sign-In, and rate-limiting features. Additionally, it allows users to group links under specific topics (e.g., acquisition, activation, retention) and view detailed analytics for individual and overall URLs.

---

## Features
- **Custom URL Shortening**: Generate short URLs for long links.
- **User Authentication**: Google Sign-In for secure user authentication.
- **Link Grouping**: Organize URLs under topics such as acquisition, activation, and retention.
- **Advanced Analytics**: Gain insights into link usage at individual and overall levels.
- **Rate Limiting**: Control API usage to prevent abuse.

---

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Caching**: Redis
- **Authentication**: Google OAuth 2.0
- **Documentation**: Swagger

---

## Installation

### Prerequisites
- Node.js (>= 20.x)
- Redis Server
- MongoDB Instance

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/IamPiyushChauhan/Custom-URL-Shortener-API.git
   cd Custom-URL-Shortener-API
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the `.env` file:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   SESSION_SECRET=SECRET_HERE
   CLIENT_ID=gfjhyuthmnbmnb
   CLIENT_SECRET=8099ikolkj
   MONGO_DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/UrlShortener?retryWrites=true&w=majority
   CALLBACK_URL=http://localhost:3000/auth/google/callback
   BASE_URL=http://localhost:3000
   ```

4. Start the Redis server.

5. Run the application:
   ```bash
   npm start
   ```

---

## Folder Structure
```
├── /controllers         # Route handlers and logic
├── /middleware          # Custom middleware functions
├── /node_modules        # Dependencies
├── /service             # Business logic and services
├── /utils               # Utility functions
├── /routes              # API routes
├── /views               # Frontend templates (if any)
├── index.js             # Entry point of the application
├── model                # Database schemas and models
├── redis-client.js      # Redis client setup
├── passport.js          # Google OAuth configuration
├── swagger.js           # Swagger documentation setup
├── package.json         # Project metadata and dependencies
├── package-lock.json    # Lockfile for dependencies
├── .env                 # Environment variables
```

---

## API Documentation
API documentation is provided via Swagger. Once the application is running, visit:
```
http://localhost:3000/api-docs
```

---

## Usage

### Authentication
- Use Google Sign-In to authenticate users.
- Configure the `CLIENT_ID` and `CLIENT_SECRET` in your `.env` file for OAuth.

### Rate Limiting
The application uses rate limiting to prevent abuse. Users can make a specified number of requests within a given time frame.

### Link Analytics
View detailed analytics for individual and grouped URLs, such as:
- Number of clicks
- Referrer information



## Contact
For any questions or suggestions, please contact:
- **Name**: Piyush Chauhan
- **Email**: piyushchauhan.work@gmail.com

