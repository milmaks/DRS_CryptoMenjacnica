from os import truncate
import re
from flask import Flask, jsonify, request, render_template, url_for, redirect,session
from flask.helpers import make_response
from werkzeug.security import generate_password_hash, check_password_hash
from model.Customer import Customer, CustomerSchema
from model.CryptoCurrency import CryptoCurrency, CryptoCurrencySchema
from flaskext.mysql import MySQL
from flask_cors import CORS
from config import db, ma
from costumer_db import CostumerTable
from crypto_currency_db import CryptoCurrencyTable
import yaml
from time import sleep
from multiprocessing import Process, Lock
import requests

app = Flask(__name__)
CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

costumers_database = CostumerTable()
cryptocurrency_database = CryptoCurrencyTable()

db_yaml = yaml.safe_load(open("yamls/db.yaml"))

mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = db_yaml["mysql_user"]
app.config['MYSQL_DATABASE_PASSWORD'] = db_yaml["mysql_password"]
app.config['MYSQL_DATABASE_DB'] = db_yaml["mysql_db"]
app.config['MYSQL_DATABASE_HOST'] = db_yaml["mysql_host"]
mysql.init_app(app)


@app.route('/logIn', methods=['GET', 'POST'])
def log_in():
    if request.method == 'POST':
        conn = mysql.connect()
        cursor = conn.cursor()
        user = costumers_database.get_costumer(cursor, request.form['email'])
        user_pass = user[6]
        input_pass = request.form['password']
        if user != None and check_password_hash(user_pass, input_pass):
            
            cursor.close()
            conn.close()
            #redirect to index
            return {"data" : "ok", "redirect" : "/", "cookie" : request.form['email']}, 200
        else:
            cursor.close()
            conn.close()
            #vrati na log url_for('log_in')
            return {"data" : "bad request", "redirect" : "/logIn"}, 400

#TO DO za kasnije ako bude trebalo proveravati cookie i da li ima u bazi taj email 
#kasnije samo vracati na bad req i 400  i na neku baznu stranicu 

def check()->bool:
    conn = mysql.connect()
    cursor = conn.cursor()
    flag = False
    if costumers_database.get_costumer(cursor, request.cookies.get('username')) != None:
        flag = True
    
    cursor.close()
    conn.close()
    return flag    

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        # vrati me na registre.html
        return {"data" : "bad request", "redirect" : "/logIn"}, 400

    if request.method == 'POST':
        
        _first_name = request.form['first_name']
        _last_name = request.form['last_name']
        _password = request.form['password']
        _address = request.form['address']
        _town = request.form['town']
        _country = request.form['country']
        _phone_number = request.form['phone_number']
        _email = request.form['email']
        
        conn = mysql.connect()
        cursor = conn.cursor()

        if costumers_database.get_costumer(cursor, _email) != None:
            print("costumer exist")
            return {"data":"Bad Request", "redirect" : "/logIn", "message" : "Costumer already exists."}, 400

        hashed_password = generate_password_hash(_password, method='sha256')

        c = Customer(_first_name, _last_name, hashed_password, _address, _town, _country, _phone_number, _email)

        costumers_database.add_customer(c, cursor, conn)

        cursor.close()
        conn.close()
       
        #jsonify({'redirect': url_for('log_in')})
        return {"data":"ok", "redirect" : "/logIn"}, 200

@app.route('/verify',methods = ['GET','POST'])
def verify():
    if request.method == 'GET':
        return {"data" : "Bad Request",'redirect' : '/'}, 400
    else:
        #TO DO  nakako verifikovati karticu 
<<<<<<< Updated upstream
        if False:
            return {'data' : 'Bad request' , 'redirect' : '/','message':'Input values are incorrect'},400
        else:
            return {'data' : 'ok' , 'redirect' : '/'},200
=======
        
        _card_number = request.form['card_number']
        _card_number = _card_number.replace('+' , ' ')
        _expiry_date = request.form['expiry_date']
        _expiry_date = _expiry_date.replace('%2F','/')
        _ccv = request.form['ccv']
        _user_name = request.form['user_name']
        _amount = request.form['amount']
        conn = mysql.connect()
        cursor = conn.cursor()
        customer = costumers_database.get_costumer(cursor, request.form['username'])
        
        #print(_card_number)
        #print(_expiry_date)
        #print(_ccv)
        #print(_user_name)
        #print(_amount)
        if customer[0] !=_user_name or _expiry_date != '02/23' or _ccv != '123' or _card_number != '4242 4242 4242 4242':
            cursor.close()
            conn.close()
            return {'data' : 'Bad request' ,'Access-Control-Allow-Origin': 'true', 'redirect' : '/','message':'Input values are incorrect'},400
        else:
            costumers_database.verify_customer(customer,cursor,conn)
            cursor.close()
            conn.close()
            return {'data' : 'ok' ,'redirect' : '/buyCrypto'},200
>>>>>>> Stashed changes
        
        
    
    
    
    


@app.route('/change', methods=['POST', 'GET'])
def change():
    if request.method == 'GET':
        return {"data" : "Bad Request"}, 400

    if request.method == 'POST':
        #TO DO map data from changed user
        _first_name = request.form['first_name']
        _last_name = request.form['last_name']
        _password = request.form['password']
        _address = request.form['address']
        _town = request.form['town']
        _country = request.form['country']
        _phone_number = request.form['phone_number']
        _email = request.form['email']

        conn = mysql.connect()
        cursor = conn.cursor()

        if costumers_database.get_costumer(cursor, _email) == None:
            print("costumer is not existing")
            return {"data":"Bad Request", "redirect" : "/logIn", "message" : "Costumer is not logged in."}, 400

        hashed_password = generate_password_hash(_password, method='sha256')

        c = Customer(_first_name, _last_name, hashed_password, _address, _town, _country, _phone_number, _email)

        costumers_database.update_customer(c, cursor, conn)

        return {'data' : 'OK', "redirect" : "/"}, 200
    
api_key = "d28eb9872dd6f65ba27f87e0eb4642d4ffbf9d76"
ids = "BTC,ETH,BNB,USDT,SOL,ADA,USDC,XRP,DOT,AVAX,LUNA,DOGE,SHIB,MATIC,XCH"
url = 'https://api.nomics.com/v1/currencies/ticker?key='+api_key+'&ids='+ids+'&interval=1d'

def update(lock, data_json):
    lock.acquire()
    conn = mysql.connect()
    cursor = conn.cursor()
    
    for i in range(0, len(data_json)):
        c = CryptoCurrency(data_json[i]['id'], data_json[i]['name'], data_json[i]['price'])
        cryptocurrency_database.update_crypto_currency(c, cursor, conn)

    conn.commit()
    lock.release()

def update_currencies():  
    lock = Lock()

    response = requests.get(url)
    if response.status_code == 200:
        data_json = response.json()
        conn = mysql.connect()
        cursor = conn.cursor()
        sql = "INSERT INTO CryptoCurrencies (CurrencyID, CurrencyName, CurrencyValue) VALUES (%s,%s,%s) ON DUPLICATE KEY UPDATE CurrencyValue=%s"
        for i in range(0, len(data_json)):
            values = (data_json[i]['id'], data_json[i]['name'] ,data_json[i]['price'],data_json[i]['price'])
            cursor.execute(sql, values)
        conn.commit()
       
    while True:
        response = requests.get(url)
        if response.status_code == 200:
            update(lock, response.json())
        sleep(20)

if __name__ == "__main__":
    update_proces = Process(target=update_currencies, args=())
    update_proces.start()
    app.run(port=8000, debug=True)
