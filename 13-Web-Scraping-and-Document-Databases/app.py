# import necessary libraries
from flask import Flask, render_template, jsonify, redirect
from flask_pymongo import PyMongo
import pymongo
import scrape_mars

# create instance of Flask app
app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
# app.config("MONGO_URI") = "mongodb://localhost:27017/myDatabase" 
# mongo = PyMongo(app)

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["mydatabase"]


# Connect to a database. Will create one if not already available.
#collection = mongo.db.mars
collection = mydb["mars"]

# create route that renders index.html template and finds documents from mongo
@app.route("/")
def home():

    data = collection.find_one()

    # return template and data
    return render_template("index.html", data=data)


# Route that will trigger scrape functions
@app.route("/scrape")
def scrape():

    # Run scraped functions
    update_data = scrape_mars.scrape()

    # Store results into a dictionary

    # Insert forecast into database
    collection.insert_one(update_data)

    # Redirect back to home page
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)