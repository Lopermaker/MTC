# Real Authentication Backend Implementation Plan

## Summary
Restore the frontend integration with the real backend API, and enhance the Node.js/Express server (`server.js`) with robust validation, JWT middleware, and route protection to provide a true, secure authentication system that validates real accounts.

## Current State Analysis
- The frontend (`src/components/Login.tsx`) currently mocks authentication using `setTimeout`, allowing any arbitrary email/password to "log in" without actual server validation.
- The backend (`server.js`) exists with basic SQLite and JWT capabilities, but lacks strict input validation, formal middleware for route protection, and is currently disconnected from the frontend.

## Proposed Changes

### 1. Enhance Backend Validation (`server.js`)
- **Validator Function**: Create validation logic to ensure data integrity during sign-up. 
- Enforce valid email formatting (using regex).
- Enforce password strength (e.g., minimum 6 characters).

### 2. Implement JWT Middleware & Route Protection (`server.js`)
- **Middleware**: Create an `authenticateToken` Express middleware function that verifies the JWT from the `Authorization` header.
- **Route Protection**: Apply this middleware to the `/api/me` route and any future routes that require the user to be logged in (e.g., saving game stats).

### 3. Connect Frontend to Backend (`src/components/Login.tsx`)
- **Real API Calls**: Replace the `setTimeout` mock with actual `fetch` requests to `/api/register` and `/api/login`.
- **Error Handling**: Capture real backend errors (e.g., "Invalid email", "Incorrect password", "Account already exists") and display them securely in the UI.

### 4. Secure Logout & Session Management (`src/store.ts`)
- **Secure Logout**: Ensure the `logout` function securely clears the JWT token and user data from local storage and application state.
- **Session Restoration**: Utilize the token to verify the user session with the backend upon app initialization (via the protected `/api/me` route).

## Assumptions & Decisions
- **Deployment**: To make this system work across different devices over the internet, this backend (`server.js`) must be deployed to a Node.js hosting provider (like Render, Railway, or Heroku), as Netlify only hosts static frontend files.
- **Stateless Auth**: Secure logout will be handled client-side by destroying the JWT token, which is the standard industry approach for stateless JWT architecture.

## Verification Steps
1. Attempt to register with an invalid email or short password and verify the backend rejects it.
2. Register a valid account and ensure it successfully writes to the SQLite database.
3. Attempt to log in with an incorrect password and verify rejection.
4. Log in successfully, receive a JWT, and verify the protected `/api/me` route returns the user's data.
5. Click logout and verify the token is cleared and the session ends.