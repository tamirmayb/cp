package main

import (
	"encoding/json"
	"fmt"
	"github.com/julienschmidt/httprouter"
	"log"
	database "myDatabase"
	"net/http"
	"os"
)

// CRUD Route Handlers
func createApplicationHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	setCors(w)
	decoder := json.NewDecoder(r.Body)
	var newApp database.Application
	if err := decoder.Decode(&newApp); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	database.DB.Create(&newApp)
	res, err := json.Marshal(newApp)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write(res)
}

func listApplicationsHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	log.Println("in listApplicationsHandler ")
	setCors(w)
	var applications []database.Application
	database.DB.Find(&applications)
	res, err := json.Marshal(applications)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write(res)
}

func indexHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	setCors(w)
	fmt.Fprintf(w, "Welcome to Tamir's CP Cloud RESTful api")
}

// used for COR preflight checks
func corsHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	setCors(w)
}

// util
func getFrontendUrl() string {
	if os.Getenv("APP_ENV") == "production" {
		return "http://localhost:3000" // change this to production domain
	} else {
		return "http://localhost:3000"
	}
}

func setCors(w http.ResponseWriter) {
	frontendUrl := getFrontendUrl()
	w.Header().Set("Access-Control-Allow-Origin", frontendUrl)
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func main() {
	defer database.DB.Close()

	// add router and routes
	router := httprouter.New()
	router.GET("/", indexHandler)
	router.POST("/add", createApplicationHandler)
	router.GET("/list", listApplicationsHandler)
	router.OPTIONS("/*any", corsHandler)

	// add database
	_, err := database.Init()
	if err != nil {
		log.Println("connection to DB failed, aborting...")
		log.Fatal(err)
	}

	log.Println("connected to DB")

	// print env
	env := os.Getenv("APP_ENV")
	if env == "production" {
		log.Println("Running api server in production mode")
	} else {
		log.Println("Running api server in dev mode")
	}

	http.ListenAndServe(":8080", router)
}
