from logging import debug
from flask import Flask, render_template, request, session, url_for, jsonify
from pymysql import NULL
from werkzeug.utils import redirect
from flask_cors import CORS
import requests
import json
import os

app = Flask(__name__)
CORS(app,supports_credinentails=True)

endpoint = "https://cryptomenjacnicaengine.herokuapp.com"; #"127.0.0.1:8000"

@app.route('/')
def main_data():            
    return render_template('index.html')


@app.route('/logIn', methods=['GET', 'POST'])
def log_in():
    if 'username' in request.cookies:
        return redirect('/')
            
    if request.method == 'GET':
        return render_template('login.html')
    
    if request.method == 'POST':   
        return url_for('main_data')
        

@app.route('/register', methods=['GET', 'POST'])
def register():
    
        
    if request.method == 'GET':
        return render_template('login.html')

    if request.method == 'POST':
        return jsonify({'redirect': url_for('main_data')})


@app.route('/change', methods=['GET'])
def change():
    if request.method == 'GET':
        if 'username' in request.cookies:
            user_cookie = request.cookies.get('username')
            return render_template('changeCostumer.html', user_cookie = user_cookie)
        else:
            return redirect('/logIn')
    
@app.route('/buyCrypto', methods=['GET', 'POST'])
def buy_crypto():
    if request.method == 'GET':
        return render_template('buyCrypto.html')

@app.route('/tradeCrypto', methods=['GET', 'POST'])
def trade_crypto():
    if request.method == 'GET':
        return render_template('tradeCrypto.html')
    
@app.route('/userCard', methods=['GET'])
def userCard():
    if request.method == 'GET':
        if 'username' in request.cookies:
            user_cookie = request.cookies.get('username')
            return render_template('userCard.html')
        else:
            return redirect('/logIn')


@app.route('/cryptoState', methods=['GET'])
def crypto_state():
    url = endpoint + "/getUserCrypto"
    if 'username' in request.cookies:
        user_cookie = request.cookies.get('username')
    
    data = {"username" : user_cookie}
    response = requests.post(url, data = data)

    json_text = response.text

    cryptos = json.JSONDecoder().decode(json_text)
    crypto_lsit = cryptos['json_c']

    return render_template('cryptoState.html', crypto_list = crypto_lsit, username = user_cookie)

@app.route('/transactions', methods=['GET', 'POST'])
def transactions():
    if request.method == 'GET':
       return render_template('transactions.html')
    else:
        url = endpoint + "/getTransactions"
        if 'username' in request.cookies:
            user_cookie = request.cookies.get('username')

        data = {"username" : user_cookie}
        response = request.post(url, data = data)
        json_text = response.text

        tr_list = json.JSONDecoder().decode(json_text)
        trans_list = tr_list['json_c']

        return render_template('transactions.html', transaction_list = trans_list, username = user_cookie)


    
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8001))
    app.run(host='0.0.0.0', port=port)