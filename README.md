# appdev2-midterm-project

## Submitted by: 
**Justine Jynne Patrice A. Marco**

BSIS-3 Student at La Verdad Christian College - Apalit

## Project Summary

In partial fulfillment for Application Development 2, this is a simple **RESTful API** that mimics the functionality of `jsonplaceholder.typicode.com/todos`. This project is built using **Node.js**, the native `fs` module for data storage, and `events` module for logging.

This simple API allows you to:
- Create, Read, Update, and Delete (CRUD) todos
- Log every API request to a file names `logs.txt`, which includes timestamps

The **Project Structure** of this simple API is as follows:
- `server.js` is the main HTTP Server including the CRUD routes
- `todos.json` is a data file simulating a database
- `logs.txt` is a file where every API request is logged

## How to Run
1. Clone this repository to your local machine
`https://github.com/justinemarco/appdev2-midterm-project.git`
2. Make sure you have Node.js installed
3. Start the Server by typing "node server.js" in your terminal
4. Access the API at "http://localhost:3001/todos"
5. Use a tool like Postman or Thunder Client to test the API endpoints

## Video Demonstration
`https://drive.google.com/file/d/1YrKKrVEWKp_0cmKWlIGTvy-KLRf8mTnx/view?usp=sharing`