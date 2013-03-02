__author__ = 'Jervis Muindi'

from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)


def db_connect():
    return MongoClient('localhost', 27017)

def test():
    file_path = ('dining.json')
    #load_data()


@app.route("/")
def hello():
    return "Hello World2"

if __name__ == "__main__":
    app.run()
    #test()
