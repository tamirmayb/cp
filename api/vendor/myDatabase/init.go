package myDatabase

import (
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"time"
)

var DB *gorm.DB
var err error

type Application struct {
	//gorm.Model
	ID  string
	Name string
	Key string
	Date string
}

func addDatabase(dbname string) error {
	// create database with dbname, won't do anything if db already exists
	DB.Exec("CREATE DATABASE " + dbname)

	// connect to newly created DB (now has dbname param)
	connectionParams := "dbname=" + dbname + " user=docker password=docker sslmode=disable host=db"
	DB, err = gorm.Open("postgres", connectionParams)
	if err != nil {
		return err
	}

	return nil
}

func Init() (*gorm.DB, error) {
	// set up DB connection and then attempt to connect 5 times over 25 seconds
	connectionParams := "user=docker password=docker sslmode=disable host=db"
	for i := 0; i < 5; i++ {
		DB, err = gorm.Open("postgres", connectionParams) // gorm checks Ping on Open
		if err == nil {
			break
		}
		time.Sleep(5 * time.Second)
	}

	if err != nil {
		return DB, err
	}

	// create table if it does not exist
	if !DB.HasTable(&Application{}) {
		DB.CreateTable(&Application{})
	}

	testPost := Application{ID: "1", Name: "Dorper", Key: "key ket", Date: "2020-02-02"}
	DB.Create(&testPost)
	
	return DB, err
}