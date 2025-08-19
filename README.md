# Flashify

## 🎯 Project Overview

Flashify is a modern, full-stack flashcard application designed to help users master any topic through efficient spaced repetition learning. The application provides a seamless experience for creating, managing, and studying flashcard decks with secure user authentication and cross-device synchronization.

## 🏗️ Architecture Overview

### Frontend (Next.js + React)

-   **Framework**: Next.js 14 with App Router
-   **Styling**: Tailwind CSS with custom design system
-   **UI Components**: Custom component library with Radix UI primitives
-   **State Management**: React Context API for authentication

### Backend (Flask + Python)

-   **Framework**: Flask with Blueprint architecture
-   **Database**: Supabase PostgreSQL with Row Level Security (RLS)
-   **Authentication**: JWT tokens via Supabase Auth
-   **API Design**: RESTful endpoints with CORS support

## 🔧 Technical Implementation

### Frontend Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard with deck management
│   ├── decks/[deckId]/    # Individual deck management
│   ├── study/[deckId]/    # Study mode with flip cards
│   ├── login/             # Authentication pages
│   └── signup/
├── components/            # Reusable React components
│   ├── ui/               # UI component library
│   ├── HeroSection.jsx   # Landing page with 3D animations
│   └── ProtectedRoute.jsx # Route protection wrapper
├── context/
│   └── AuthContext.jsx   # Global authentication state
└── services/
    └── api.js            # API service layer
```

### Backend Structure

```
├── flashifyenv/
├── routes/               # API route handlers
│   ├── auth_routes.py   # Authentication endpoints
│   ├── deck_routes.py   # Deck CRUD operations
│   └── card_routes.py   # Card CRUD operations
├── utils/
│   └── supabase_client.py # Database connection
└── app.py                # Flask application entry point
```

## 🚀 Key Features

### 1. User Authentication & Security

-   **Secure Registration/Login**: Email-based authentication with JWT tokens
-   **Protected Routes**: Client-side route protection with automatic redirects
-   **Row Level Security**: Database-level security ensuring users only access their data
-   **Token Management**: Automatic token persistence and refresh handling

### 2. Deck Management

-   **Create Decks**: Intuitive deck creation with real-time updates
-   **Organize Content**: Grid-based deck display with responsive design
-   **Quick Actions**: One-click access to study mode and deck editing
-   **Delete Protection**: Secure deck deletion with proper cleanup

### 3. Card Management

-   **CRUD Operations**: Full create, read, update, delete functionality
-   **Rich Content**: Support for text-based questions and answers
-   **Real-time Updates**: Instant UI updates without page refreshes
-   **Modal Interface**: Clean, focused editing experience

### 4. Study Mode

-   **Interactive Flip Cards**: 3D CSS animations for card flipping
-   **Progress Tracking**: Real-time correct/incorrect counters
-   **Keyboard Shortcuts**: Space bar to flip, arrow keys to navigate
-   **Session Management**: Customizable study sessions with results summary

### 5. User Experience

-   **Dark Theme**: Modern darkUI
-   **Responsive Design**: Mobile-first approach with Tailwind CSS
-   **Loading States**: Smooth loading indicators
-   **Error Handling**: Comprehensive error messages

## 🔄 Data Flow

### Authentication Flow

1. User submits credentials → Frontend validation
2. API call to Flask backend → Supabase Auth verification
3. JWT token returned → Stored in localStorage
4. Token included in all subsequent API requests
5. Backend validates token for each protected route

### Study Session Flow

1. User selects deck → Fetch cards from API
2. Cards loaded into study component → Initialize session state
3. User interactions (flip, next, scoring) → Update local state
4. Session completion → Display results summary
5. Return to dashboard → Persist any learning analytics

### Data Synchronization

1. All CRUD operations immediately update local state
2. API calls made in background for persistence
3. Error handling reverts local state if API fails
4. Optimistic updates for better user experience

## 🛡️ Security Implementation

### Frontend Security

-   **Route Protection**: ProtectedRoute wrapper component
-   **Token Validation**: Automatic token expiry handling
-   **Input Sanitization**: Form validation
-   **HTTPS Enforcement**: Secure communication protocols

### Backend Security

-   **JWT Verification**: Token validation on every protected endpoint
-   **Row Level Security**: Database-level access control
-   **CORS Configuration**: Controlled cross-origin requests
-   **Input Validation**: Server-side validation for all inputs

### Database Security

-   **RLS Policies**: Users can only access their own data
-   **UUID Primary Keys**: Non-sequential, secure identifiers
-   **Encrypted Storage**: All sensitive data encrypted
