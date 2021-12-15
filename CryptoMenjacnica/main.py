from os import truncate
import re
from flask import Flask, jsonify, request, render_template, url_for, redirect
from model.Customer import Customer, CustomerSchema
from flaskext.mysql import MySQL
from config import db, ma
from costumer_db import CostumerTable
import yaml

app = Flask(__name__)

costumers_database = CostumerTable()

db_yaml = yaml.safe_load(open("yamls/db.yaml"))
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = db_yaml["mysql_user"]
app.config['MYSQL_DATABASE_PASSWORD'] = db_yaml["mysql_password"]
app.config['MYSQL_DATABASE_DB'] = db_yaml["mysql_db"]
app.config['MYSQL_DATABASE_HOST'] = db_yaml["mysql_host"]
mysql.init_app(app)


@app.route('/')
def index_page():
    return render_template('index.html')


@app.route('/logIn', methods=['GET', 'POST'])
def log_in():
    if request.method == 'GET':
        return render_template('login.html')

    #to do database
    conn = mysql.connect()
    cursor = conn.cursor()
    if request.method == 'POST':
        if costumers_database.check_costumer(cursor, request.form['email'], request.form['password']):
            cursor.close()
            conn.close()
            return url_for('index_page')
        else:
            cursor.close()
            conn.close()
            return url_for('log_in')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')

    if request.method == 'POST':
        _first_name = request.form['first_name']
        _last_name = request.form['last_name']
        _password = request.form['password']
        _address = request.form['address']
        _town = request.form['town']
        _country = request.form['country']
        _phone_number = request.form['phone_number']
        _email = request.form['email']
        c = Customer(_first_name, _last_name, _password, _address, _town, _country, _phone_number, _email)

        conn = mysql.connect()
        cursor = conn.cursor()

        costumers_database.add_customer(c, cursor, conn)

        cursor.close()
        conn.close()

        return jsonify({'redirect': url_for('log_in')})


if __name__ == "__main__":
    app.run(port=8000, debug=True)
