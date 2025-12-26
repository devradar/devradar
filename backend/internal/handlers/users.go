package handlers

import (
	"encoding/json"
	"net/http"
	"log"

	"github.com/devradar/devradar/internal/db"
	"github.com/go-chi/chi/v5"
)

type UserHandler struct {
	Queries *db.Queries
}

func (h *UserHandler) RegisterRoutes(r chi.Router) {
	r.Get("/", h.ListUsers)
	r.Post("/", h.CreateUser)
}

func (h *UserHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.Queries.ListUsers(r.Context())
	log.Println("weee")
	if err != nil {
		Error(w, http.StatusInternalServerError, "Could not fetch users")
		log.Fatal(err)
		return
	}
	JSON(w, http.StatusOK, users)
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {

	type CreateUserRequest struct {
		Name  string `json:"name"`
		Email string `json:"email"`
	}
	var req CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		Error(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	params := db.CreateUserParams{
		Name:  req.Name,
		Email: req.Email,
	}

	user, err := h.Queries.CreateUser(r.Context(), params)
	if err != nil {
		Error(w, http.StatusUnprocessableEntity, "Invalid user data")
		return
	}

	JSON(w, http.StatusCreated, user)
}
