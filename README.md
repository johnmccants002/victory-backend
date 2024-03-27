# Victory App Backend

This is the backend for the Victory app, which is built using Express and Node.js. It provides APIs for managing user authentication, profiles, victories, AI victories, and follows.

## Getting Started

To get started with the Victory app backend, follow these steps:

1. Clone this repository.
2. Install dependencies by running `npm install`.
3. Set up environment variables by creating a `.env` file in the root directory and adding the following variables:

4. Start the server by running `npm start`.

## Dependencies

The following dependencies are used in this backend:

- [Express](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js.
- [OpenAI](https://www.npmjs.com/package/openai): Node.js client for the OpenAI API.
- [Multer](https://www.npmjs.com/package/multer): Node.js middleware for handling `multipart/form-data`, used for file uploads.
- [dotenv](https://www.npmjs.com/package/dotenv): Zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- [Supabase](https://www.npmjs.com/package/@supabase/supabase-js): JavaScript client for Supabase, an open-source alternative to Firebase.

## Usage

- The server runs on port 3000 by default.
- Endpoints are prefixed with `/api`.
- Refer to the API documentation for details on each endpoint.

## API Documentation

### Authentication

- `/api/login`: POST request to authenticate user login.
- `/api/register`: POST request to register a new user.
- `/api/current-user`: GET request to fetch details of the current authenticated user.

### Profiles

- `/api/profiles`: POST request to create or update profile information.
- `/api/profiles`: GET request to fetch a specific profile by ID.

### Victories

- `/api/victories`: GET request to fetch all victories for the logged-in user.

### AI Victories

- `/api/ai-victories/processToDoList`: POST request to process a to-do list into victories.
- `/api/ai-victories/generateMiniVictories`: POST request to generate mini victories related to a specific victory.

### Follow

- `/api/follow/follow/:followedId`: POST request to follow a user.
- `/api/follow/unfollow/:followedId`: DELETE request to unfollow a user.
