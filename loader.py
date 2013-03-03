__author__ = 'Jervis Muindi'

import json
import sys
from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)

def read_entire_file(file_path):
    f = open(file_path)
    line = f.readline()
    result = ''
    while line:
        result += line
        line = f.readline()
    return result

def db_connect():
    return MongoClient('localhost', 27017)

def get_json_data(file_path):
    json_text = read_entire_file(file_path)
    j = json.loads(json_text)
    return j['data']

# Loads data to the local mongo db database
def load_data():
    # Connect to MongoDB and Create Dining Database
    conn = db_connect()
    db = conn.dining
    menus = db.menus

    file_path = 'dining.json'
    data = get_json_data(file_path)
    ids = menus.insert(data)

    print ids
    print menus.find()

# Retrieves the loaded data
def show_data():
    conn = db_connect()
    menus = conn.dining.menus
    data = menus.find()
    for item in data:
        print item

def test():
    file_path = ('dining.json')
    #load_data()
    show_data()

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == 'show_data':
            print 'Showing Loaded Data'
            show_data()
            exit(0)
    print 'Loading Data...'
    load_data()
    print 'Data loading complete. run `loader.py show_data` to see the data'
