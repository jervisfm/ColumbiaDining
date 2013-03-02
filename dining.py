__author__ = 'Jervis Muindi'

import json
from flask import Flask
import pymongo

app = Flask(__name__)

def read_entire_file(file_path):
    f = open(file_path)
    line = f.readline()
    result = ''
    while line:
        result += line
        line = f.readline()
    return result


def test():
    file_path = ('dining.json')
    json_text = read_entire_file(file_path)
    j = json.loads(json_text)
    print j


@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    #app.run()
    test()