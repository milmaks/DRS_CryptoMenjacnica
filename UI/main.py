from logging import debug
from flask import Flask,  render_template,request,url_for





app = Flask(__name__)


#to do render templates
@app.route('/')
def index_page():
    return render_template('index.html')

@app.route('/logIn', methods=['GET', 'POST'])
def log_in():
    if request.method == 'GET':
        #vrati me na login
        return render_template('login.html')
    if request.method == 'POST':
        #TO DO proveriti pa baciti na log ili na index
        return url_for()


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        # vrati me na registre.html
        return {"data":"bad request"},400

    if request.method == 'POST':
        #TO DO baciti na index!
        #jsonify({'redirect': url_for('log_in')})
        return {"data":"ok"},200

@app.route('/change', methods=['PUT'])
def change():
    #TO DO baciti na index
    if request.method == 'GET':
        return {"data" : "bad Request"},200

    if request.method == 'POST':
        #TO DO map data from changed user
        return {'data' : 'OK'},200
    else:
        return {'data' : 'OK'},200


if __name__ == "__main__":
    app.run(port=8001,debug= True)
