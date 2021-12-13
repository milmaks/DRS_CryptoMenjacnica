from flask import Flask
from flaskext.mysql import MySQL
import yaml

app = Flask(__name__)

db = yaml.safe_load(open("db.yaml"))
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = db["mysql_user"]
app.config['MYSQL_DATABASE_PASSWORD'] = db["mysql_password"]
app.config['MYSQL_DATABASE_DB'] = db["mysql_db"]
app.config['MYSQL_DATABASE_HOST'] = db["mysql_host"]
mysql.init_app(app)

@app.route("/")
def main():
    return "<h1>Welcome</h1>"

if __name__ == "__main__":
    app.run(port=5050)