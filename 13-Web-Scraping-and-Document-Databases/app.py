# import necessary libraries
from flask import Flask, render_template, jsonify, redirect
from flask_pymongo import PyMongo
import pymongo
import scrape_mars

# create instance of Flask app
app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["mydatabase"]
collection = mydb["mars"]

# create route that renders index.html template and finds documents from mongo
@app.route("/")
def home():
    data = collection.find_one()
    return render_template("index.html", data=data)


# Route that will trigger scrape functions
@app.route("/scrape")
def scrape():
    update_data = scrape_mars.scrape()
    collection.insert_one(update_data)
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)