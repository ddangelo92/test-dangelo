# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a secure password sharing application with a monorepo structure containing:
- **Backend**: NestJS API (port 3000)
- **Frontend**: React + Vite SPA (port 5173)

The application allows users to securely share passwords via one-time links. Passwords are encrypted using AES-256-GCM and stored in-memory only.

## Development Commands

### Backend (from `backend/` directory)
```bash
npm start           # Start server with ts-node
npm run start:dev   # Start with watch mode
npm run build       # Compile TypeScript to JavaScript
```

### Frontend (from `frontend/` directory)
```bash
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run preview     # Preview production build
```

### Running the Full Application
Requires two terminals:
1. Terminal 1: `cd backend && npm start`
2. Terminal 2: `cd frontend && npm run dev`

## Architecture

### Security Model - Critical Understanding

The security architecture has three layers that work together:

1. **CryptoService** (`backend/src/crypto.service.ts`):
   - Encrypts passwords using AES-256-GCM with randomly generated keys
   - Each password gets unique: salt (64 bytes), IV (16 bytes), encryption key, and auth tag
   - The encryption key itself is derived from a random password using scrypt
   - Returns base64-encoded bundle: `salt + iv + tag + encrypted_data + random_password`
   - **Important**: The random password used for key derivation is stored WITH the encrypted data (last 64 bytes of the bundle)

2. **PasswordService** (`backend/src/password.service.ts`):
   - Manages in-memory storage using TypeScript `Map<string, PasswordEntry>`
   - `storePassword()`: Encrypts plaintext immediately, stores ONLY encrypted version
   - `retrievePassword()`: Deletes entry BEFORE decryption (ensures one-time use)
   - Never logs or stores plaintext passwords

3. **PasswordController** (`backend/src/password.controller.ts`):
   - POST `/api/password/store`: Accepts plaintext, returns unique ID (nanoid)
   - GET `/api/password/retrieve/:id`: Returns plaintext once, then 404 forever
   - GET `/api/password/health`: Debug endpoint showing storage size

### Frontend Flow

- **HomePage** (`frontend/src/pages/HomePage.tsx`): Password submission form, generates shareable link
- **ViewPasswordPage** (`frontend/src/pages/ViewPasswordPage.tsx`): Retrieves and displays password once
- **App.tsx**: React Router setup with two routes: `/` and `/view/:id`

### Key Security Constraints

When modifying this codebase:
- **NEVER** log plaintext passwords (no console.log, no debug statements)
- **NEVER** store plaintext in variables longer than necessary
- **NEVER** persist plaintext to disk
- Passwords must be encrypted immediately upon receipt in the backend
- The `storage.delete(id)` call in `retrievePassword()` MUST happen before decryption
- CORS is configured for `http://localhost:5173` only

### Storage Format

The encrypted password bundle structure (base64-encoded):
```
[salt: 64 bytes][iv: 16 bytes][tag: 16 bytes][encrypted_data: variable][password: 64 bytes]
```

This structure must be maintained if modifying `CryptoService`.

## API Contract

All endpoints are prefixed with `/api/password`.

**Store Password:**
- Endpoint: `POST /api/password/store`
- Body: `{ "password": "string" }`
- Returns: `{ "id": "string", "success": true }`

**Retrieve Password:**
- Endpoint: `GET /api/password/retrieve/:id`
- Returns: `{ "password": "string", "success": true }` (first call only)
- Returns: 404 on second call or invalid ID

## Technology Stack

- **Backend**: NestJS, Node.js crypto module, nanoid for ID generation
- **Frontend**: React 18, TypeScript, Vite, React Router
- **No database**: Intentionally uses in-memory Map for simplicity

## Configuration

- Backend port: `3000` (hardcoded in `backend/src/main.ts`)
- Frontend port: `5173` (Vite default)
- CORS origin: `http://localhost:5173` (must match if changing ports)
- Frontend API URL: `http://localhost:3000` (in both page components)
