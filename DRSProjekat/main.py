import re
from flask import Flask,jsonify,request,render_template,url_for
from werkzeug.utils import redirect
from models.Customer import Customer,CustomerSchema

app = Flask(__name__)

customer = Customer('petar','dada','da','Novi Sad','Serbia','1234','drsjaja@gmail.com')
@app.route('/')
def indexPage():
    return render_template('login.html')

#Djole ovde ti je kada se loguje provera sa bazom !!!
#ja sam samo stavio jednog usera da proverim da li radi
@app.route('/logIn',methods = ['POST'])
def logIn():
    if customer.email == request.form['email'] and customer.password == request.form['password']:
        return 'True'
    else:
        return 'False' 


#napomena za sve koji rade 
#front end ne moze da renderuje jednu stranu preko druge !!! 
#rest vraca samo u success i tjt 
# posto mora da se prebaci na narednu moramo necim sto ima href submit itd 
# da putem toga promenimo stranu 
@app.route('/returnState')
def returnState():
    return render_template('state.html')


@app.route('/moveToRegister')
def moveToRegister():
    return render_template('register.html')

#ovde registurjemo nekoga
#uzimas podatke iz requset.form['naziv_polja']
@app.route('/register',methods=['POST'])
def register():
    return "True"



if __name__ == "__main__":
    app.run(debug=True,port = 8000)