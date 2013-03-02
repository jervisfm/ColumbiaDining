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

def get_json_data(file_path):
    json_text = read_entire_file(file_path)
    j = json.loads(json_text)
    return j['data']

def test():
    file_path = ('dining.json')
    data = get_json_data(file_path)
    for item in data:
        print item
    print len(data)



@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    #app.run()
    test()