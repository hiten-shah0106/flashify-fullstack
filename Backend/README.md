# Flashcard API

A Flask-based REST API for managing flashcard decks and cards with user authentication powered by Supabase.

## Features

-   🔐 **User Authentication**: Sign up, login, logout, and user management with JWT tokens
-   📚 **Deck Management**: Create, view, and delete flashcard decks
-   🃏 **Card Management**: Create, view, update, and delete flashcards within decks
-   🔒 **Row Level Security (RLS)**: Secure data access with Supabase RLS policies
-   🌐 **CORS Support**: Cross-origin resource sharing enabled for frontend integration

## Tech Stack

-   **Backend**: Flask (Python)
-   **Database & Auth**: Supabase

## Project Structure

```
flashifyenv/
├── routes/
│   ├── auth_routes.py      # Authentication endpoints
│   ├── deck_routes.py      # Deck management endpoints
│   └── card_routes.py      # Card management endpoints
├── utils/
│   └── supabase_client.py  # Supabase client configuration
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
└── .env                    # Environment variables (create this)
```

## Setup Instructions

### 1. Prerequisites

-   Python 3.7+
-   Supabase account and project
-   pip (Python package manager)

### 2. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd flashifyenv

# Create virtual environment
python -m venv flashifyenv
flashifyenv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run the Application

```bash
python app.py
```

The API will be available at `http://localhost:5000` or `127.0.0.1:5000`

## API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint       | Description             | Body                                                    |
| ------ | -------------- | ----------------------- | ------------------------------------------------------- |
| POST   | `/auth/signup` | Create new user account | `{"email": "user@example.com", "password": "password"}` |
| POST   | `/auth/login`  | User login              | `{"email": "user@example.com", "password": "password"}` |
| POST   | `/auth/logout` | User logout             | None                                                    |

### Deck Routes (`/decks`)

| Method | Endpoint           | Description          | Body                    | Auth Required |
| ------ | ------------------ | -------------------- | ----------------------- | ------------- |
| GET    | `/decks/`          | Get all user's decks | None                    | ✅            |
| POST   | `/decks/`          | Create new deck      | `{"name": "Deck Name"}` | ✅            |
| DELETE | `/decks/{deck_id}` | Delete deck          | None                    | ✅            |

### Card Routes (`/cards`)

| Method | Endpoint           | Description           | Body                                                   | Auth Required |
| ------ | ------------------ | --------------------- | ------------------------------------------------------ | ------------- |
| GET    | `/cards/{deck_id}` | Get all cards in deck | None                                                   | ✅            |
| POST   | `/cards/`          | Create new card       | `{"deck_id": "uuid", "question": "Q?", "answer": "A"}` | ✅            |
| PUT    | `/cards/{card_id}` | Update card           | `{"question": "Updated Q?", "answer": "Updated A"}`    | ✅            |
| DELETE | `/cards/{card_id}` | Delete card           | None                                                   | ✅            |

### Health Check

| Method | Endpoint | Description       |
| ------ | -------- | ----------------- |
| GET    | `/`      | API health status |

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

The token is returned from the `/auth/login` and `/auth/signup` endpoints in the session object.

## Error Handling

The API returns standard HTTP status codes:

-   `200` - Success
-   `201` - Created
-   `400` - Bad Request (missing required fields)
-   `401` - Unauthorized (invalid/missing token)
-   `500` - Internal Server Error

Error responses follow this format:

```json
{
    "error": "Error message description"
}
```

## Security Features

-   JWT-based authentication
-   Row Level Security (RLS) with Supabase
-   Token validation on protected routes
-   CORS configuration for frontend integration

### Requirements

The application requires the following Python packages (see `requirements.txt`):

```
flask
flask-cors
supabase
python-dotenv
```
