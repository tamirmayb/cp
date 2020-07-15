package main

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"crypto/md5"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"github.com/julienschmidt/httprouter"
	"io"
	"log"
	//database "./vendor/myDatabase"
	database "myDatabase"
	"net/http"
	"os"
	"time"
)

type ApplicationDecrypted struct {
	ID   string
	Name string
	Key  string
	Date string
}

func getEncryptedId() []byte {
	b := make([]byte, 16)
	_, err := rand.Read(b)
	if err != nil {
		log.Fatal(err)
	}

	//generate uuid, check if can be created with api
	uuid := fmt.Sprintf("%x-%x-%x-%x-%x", b[0:4], b[4:6], b[6:8], b[8:10], b[10:])
	return encrypt([]byte(uuid), "password")
}

func getDecryptedId(id []byte) string {
	return bytes.NewBuffer(decrypt(id, "password")).String()
}

// CRUD Route Handlers
func createApplicationHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	setCors(w)
	decoder := json.NewDecoder(r.Body)
	var newApp database.Application
	newApp.ID = getEncryptedId()
	newApp.Date = time.Now().UnixNano() / 1000000
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
	setCors(w)
	var applications []database.Application
	database.DB.Order("name").Find(&applications)
	res, err := json.Marshal(formatApps(applications))
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.Write(res)
}

func formatApps(applications []database.Application) []ApplicationDecrypted {
	var results []ApplicationDecrypted
	for _, app := range applications {
		log.Print(app.Date)
		formattedDate := time.Unix(app.Date/1000, 0).Format("2006-01-02 15:04:05")
		results = append(results, ApplicationDecrypted{getDecryptedId(app.ID), app.Name, app.Key, formattedDate})
	}
	return results
}

func indexHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	setCors(w)
	fmt.Fprintf(w, "Welcome to CP Cloud RESTful api")
}

// used for COR preflight checks
func corsHandler(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	setCors(w)
}

// util
func getFrontendUrl() string {
	return "http://localhost:3000"

}

func setCors(w http.ResponseWriter) {
	frontendUrl := getFrontendUrl()
	w.Header().Set("Access-Control-Allow-Origin", frontendUrl)
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS, POST, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func createHash(key string) string {
	hasher := md5.New()
	hasher.Write([]byte(key))
	return hex.EncodeToString(hasher.Sum(nil))
}

func encrypt(data []byte, passphrase string) []byte {
	block, _ := aes.NewCipher([]byte(createHash(passphrase)))
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		panic(err.Error())
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		panic(err.Error())
	}
	ciphertext := gcm.Seal(nonce, nonce, data, nil)
	return ciphertext
}

func decrypt(data []byte, passphrase string) []byte {
	key := []byte(createHash(passphrase))
	block, err := aes.NewCipher(key)
	if err != nil {
		panic(err.Error())
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		panic(err.Error())
	}
	nonceSize := gcm.NonceSize()
	nonce, ciphertext := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		panic(err.Error())
	}
	return plaintext
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

	currTime := time.Now().UnixNano() / 1000000
	testPost := database.Application{ID: getEncryptedId(), Name: "AAA", Key: "key ket", Date: currTime}
	database.DB.Create(&testPost)

	http.ListenAndServe(":8080", router)
}
