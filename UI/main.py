from logging import debug
from flask import Flask,  render_template,request,url_for,jsonify
from pymysql import NULL
from werkzeug.utils import redirect

app = Flask(__name__)

@app.route('/')
def main_data():
    return render_template('index.html')


@app.route('/logIn', methods=['GET', 'POST'])
def log_in():
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
    
    
    
if __name__ == "__main__":
    app.run(port=8001, debug=True)