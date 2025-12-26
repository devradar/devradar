package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5"

	"github.com/devradar/devradar/internal/db"
)

func main() {
	// 1. Get Config
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}

	// 2. Connect to Database (using pgx)
	ctx := context.Background()
	conn, err := pgx.Connect(ctx, dbURL)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close(ctx)

	// 3. Initialize Queries (The sqlc magic)
	// This 'queries' struct holds all the methods we defined in query.sql
	queries := db.New(conn)

	// 4. Setup Router
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Simple CORS (Allow frontend to talk to backend)
	r.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			next.ServeHTTP(w, r)
		})
	})

	// 5. Define Routes

	// GET /users - List all users
	r.Get("/api/users", func(w http.ResponseWriter, r *http.Request) {
		users, err := queries.ListUsers(r.Context())
		if err != nil {
			http.Error(w, "Failed to fetch users: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(users)
	})

	// POST /users - Create a new user
	r.Post("/api/users", func(w http.ResponseWriter, r *http.Request) {
		// Define a struct to parse the incoming JSON
		type CreateUserRequest struct {
			Name  string `json:"name"`
			Email string `json:"email"`
		}

		var req CreateUserRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Use the generated CreateUserParams struct
		params := db.CreateUserParams{
			Name:  req.Name,
			Email: req.Email,
		}

		// Call the DB
		user, err := queries.CreateUser(r.Context(), params)
		if err != nil {
			http.Error(w, "Failed to create user: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(user)
	})

	// 6. Start Server
	port := ":8080"
	log.Printf("🚀 Server starting on http://localhost%s", port)
	if err := http.ListenAndServe(port, r); err != nil {
		log.Fatal(err)
	}
}
