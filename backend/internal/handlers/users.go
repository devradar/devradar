package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/devradar/devradar/internal/db"
	"github.com/go-chi/chi/v5"
)

type UserHandler struct {
	Queries *db.Queries
}

type CreateUserRequest struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

func (h *UserHandler) RegisterRoutes(r chi.Router) {
	r.Get("/", h.ListUsers)
	r.Post("/", h.CreateUser)
}

func (h *UserHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.Queries.ListUsers(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(users)
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {

	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	params := db.CreateUserParams{
		Name:  req.Name,
		Email: req.Email,
	}

	user, err := h.Queries.CreateUser(r.Context(), params)
	if err != nil {
		http.Error(w, "Failed to create user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
