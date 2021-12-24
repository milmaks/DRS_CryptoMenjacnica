from logging import debug
from flask import Flask,  render_template,request,url_for,jsonify





app = Flask(__name__)




@app.route('/')
def main_data():
    return render_template('login.html')

@app.route('/index')
def index_page():
    return render_template('index.html')


@app.route('/logIn', methods=['GET', 'POST'])
def log_in():
    if request.method == 'GET':
        return render_template('login.html')
    
    if request.method == 'POST':   
        return url_for('index_page')
        


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return url_for('log_in')

    if request.method == 'POST':
        
        return jsonify({'redirect': url_for('main_data')})


@app.route('/change', methods=['PUT'])
def change():
    if request.method == 'GET':
        return {"data" : "bad Request"},200

    if request.method == 'PUT':
        #TO DO map data from changed user
        return {'data' : 'OK'},200
    else:
        return {'data' : 'OK'},200
    
    
    
    
    
if __name__ == "__main__":
    app.run(port=8001, debug=True)