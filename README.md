# Secure Password Share

A web application for securely sharing passwords via one-time links. Built with React + Vite frontend and NestJS backend.

## Features

- **Secure Encryption**: Passwords are encrypted using AES-256-GCM encryption
- **One-Time Links**: Each link can only be used once - password is deleted after retrieval
- **No Plain Text Storage**: Passwords are never stored in plain text or logged
- **In-Memory Storage**: Uses TypeScript Map for temporary storage (no database required)
- **Short Links**: Generates short, unique IDs using nanoid

## Security Features

- AES-256-GCM encryption with authentication tags
- Random salt and IV generation for each password
- Scrypt key derivation
- Immediate deletion after retrieval
- No logging of plain text passwords
- CORS-protected API

## Project Structure

```
teamblue-test/
├── backend/          # NestJS backend
│   ├── src/
│   │   ├── crypto.service.ts      # Encryption/decryption logic
│   │   ├── password.service.ts    # Password storage and retrieval
│   │   ├── password.controller.ts # API endpoints
│   │   ├── app.module.ts          # Application module
│   │   └── main.ts                # Entry point
│   └── package.json
└── frontend/         # React + Vite frontend
    ├── src/
    │   ├── pages/
    │   │   ├── HomePage.tsx       # Password submission form
    │   │   └── ViewPasswordPage.tsx # Password viewing page
    │   ├── App.tsx                # Main app component with routing
    │   └── main.tsx               # Entry point
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation & Running

Quick start from ROOT:

```bash
npm run install:all
npm run start:backend
npm run start:frontend
```

1. **Start the Backend** (Terminal 1):
```bash
cd backend
npm install
npm start
```
Backend will run on http://localhost:3000

2. **Start the Frontend** (Terminal 2):
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on http://localhost:5173

3. **Open the Application**:
Navigate to http://localhost:5173 in your browser

## Usage

1. Enter a password in the input field on the home page
2. Click "Generate Secure Link"
3. Copy the generated link
4. Share the link with the intended recipient
5. When the link is opened, the password is displayed and immediately deleted from memory
6. The link will not work a second time

## API Endpoints

### POST `/api/password/store`
Stores an encrypted password and returns a unique ID.

**Request Body:**
```json
{
  "password": "your-password-here"
}
```

**Response:**
```json
{
  "id": "abc123xyz",
  "success": true
}
```

### GET `/api/password/retrieve/:id`
Retrieves and deletes a password by ID.

**Response:**
```json
{
  "password": "your-password-here",
  "success": true
}
```

**Error (404):**
```json
{
  "statusCode": 404,
  "message": "Password not found or already retrieved"
}
```

### GET `/api/password/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "storedPasswords": 5
}
```

## Technologies Used

### Backend
- **NestJS** - Progressive Node.js framework
- **Node.js Crypto** - Built-in cryptographic functionality
- **nanoid** - Unique ID generation
- **TypeScript** - Type-safe JavaScript

### Frontend
- **React** - UI library
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **TypeScript** - Type-safe JavaScript

## Security Considerations

- Passwords are encrypted immediately upon receipt
- Plain text passwords never touch disk storage
- Encryption keys are randomly generated per password
- Authentication tags prevent tampering
- One-time use ensures minimal exposure window
- CORS restricts API access to the frontend origin

## Development Scripts

### Backend
- `npm start` - Start the server
- `npm run start:dev` - Start with watch mode
- `npm run build` - Build for production

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Future Enhancements

- Add expiration time for links
- Database integration for persistence
- Rate limiting
- Link password protection
- Multiple file type support
- Email integration for sharing links

## License

ISC
