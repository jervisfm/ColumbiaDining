__author__ = 'Jervis Muindi'

from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
import re
import datetime



app = Flask(__name__)
app.debug = True
app.secret_key = 'development key'


def error(msg):
    dict = {'status_code' : 400, 'error' : msg}
    return json.dumps(dict)


def db_connect():
    return MongoClient('localhost', 27017)


# Returns *all* menus on for a given date
# Date is of the format <MM><DD> where MM=month
# and DD=day. Year is assumed to be 2013
@app.route("/menu/<date>", methods=['GET'])
def get_menus_on_day(date):
    year = '2013'
    month = date[0:2]
    day = date[2:4]
    full_date = "%s-%s-%s" % (year, month, day)
    menus = get_menu_collection()
    regex = re.compile(full_date,re.IGNORECASE)
    data = menus.find({'day': regex}, {'_id': 0})

    # Produce JSON
    dict = {'status_code' : 200}
    my_list = []
    for item in data:
        my_list.append(item)
    dict['data'] = my_list
    return json.dumps(dict)

"""
Searches the menus and returns the days which have the
given meal <food> is any food query to look for
"""
@app.route("/menu/search/<food>", methods=['GET'])
def search(food):
    menus = get_menu_collection()
    regex = re.compile(food,re.IGNORECASE)
    data = menus.find({'menu': regex}, {'_id': 0})

    # Produce JSON
    dict = {'status_code' : 200}
    my_list = []
    for item in data:
        my_list.append(item)
    dict['data'] = my_list
    return json.dumps(dict)


"""
Get Menu on given day and for given meal
<date> is of format <MM><DD> with MM=month, <DD>=day

morning == {lunch | brunch}
Meal is one of {dinner | lunch | brunch | morning}
"""
@app.route("/menu/<date>/<meal>", methods=['GET'])
def get_menu_for_meal(date, meal):
    year = '2013'
    month = date[0:2]
    day = date[2:4]
    menus = get_menu_collection()
    full_date = "%s-%s-%s" % (year, month, day)
    date_regex = re.compile(full_date,re.IGNORECASE)


    meal = str(meal).strip().lower()
    meal_key = ''
    if meal == 'brunch':
        meal_key = 'BN'
    elif meal == 'lunch':
        meal_key= 'LU'
    elif meal == 'dinner':
        meal_key = 'DN'
    elif meal == 'morning':
        meal_key = '(LU|BN)'
    else:
        return error("invalid meal type. Must be one of {brunch, lunch, dinner}")

    meal_regex = re.compile(meal_key,re.IGNORECASE)
    

    data = menus.find({'day': date_regex, 'meal_type':meal_regex}, {'_id': 0})


    # Produce JSON
    dict = {'status_code' : 200}
    my_list = []
    for item in data:
        my_list.append(item)
    dict['size'] = data.count()
    dict['data'] = my_list
    return json.dumps(dict)



# Retrieves the loaded data
def show_data():
    conn = db_connect()
    menus = conn.dining.menus
    data = menus.find()
    for item in data:
        print item

def get_menu_collection():
    conn = db_connect()
    return conn.dining.menus

def test_search():
    conn = db_connect()
    menus = conn.dining.menus
    regx = re.compile("bacon",re.IGNORECASE)

    #data = menus.find({'day': regx})

    meal = 'Scrambled Egg'
    data = menus.find({'day':'2013-03-02 00:00:00', 'menu' : regx}, {'_id': 0})

    for item in data:
        print item

    if data.count() == 0:
        print 'empty'

    #dict = {'status_code' : 200}
    #my_list = []
    #for item in data:
    #    my_list.append(item)
    #dict['data'] = my_list
    #print json.dumps(dict)


def test():
    file_path = ('dining.json')
    #show_data()
    test_search()


@app.route("/", methods=['GET'])
def home():
    now = datetime.datetime.now()
    now =  now.strftime("%Y-%m-%d")
    return render_template('index.html', now = now)

if __name__ == "__main__":
    app.run()
    #test()
