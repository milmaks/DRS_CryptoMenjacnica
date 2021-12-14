import mysql.connector
import yaml
from flask import jsonify

db = yaml.safe_load(open("yamls/db.yaml"))


class CostumerTable:
    def __init__(self):
        costumer_db = mysql.connector.connect(
            host=db["mysql_host"],
            user=db["mysql_user"],
            password=db["mysql_password"],
            database=db["mysql_db"]
        )

        # to do : videti sta jos dodati u tabelu; transakcije, novac, idt...
        costumer_cursor = costumer_db.cursor()
        costumer_cursor.execute('CREATE TABLE IF NOT EXISTS Costumers (FirstName varchar(32), LastName varchar(32), '
                            'Address varchar(32), City varchar(32), Country varchar(32), PhoneNumber varchar(32), '
                            'Password varchar(32), Email varchar(32))')
        costumer_cursor.close()
        costumer_db.close()

    def add_customer(self, customer, costumer_cursor, conn):
        sql = 'INSERT INTO Costumers (FirstName, LastName, Address, City, Country, PhoneNumber, Password, Email) ' \
              'VALUES (%s, %s, %s, %s, %s, %s, %s, %s)'
        val = (customer.first_name, customer.last_name, customer.address, customer.town, customer.country,
               customer.phoneNumber, customer.password, customer.email)
        costumer_cursor.execute(sql, val)
        conn.commit()

    def check_costumer(self, costumer_cursor, email, password):
        costumer_cursor.execute('SELECT * FROM Costumers')
        data = costumer_cursor.fetchall()

        for costumer in data:
            print(costumer, '\n')
            if costumer[7] == email and costumer[6] == password:
               return True

        return False
