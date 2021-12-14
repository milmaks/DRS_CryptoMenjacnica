import mysql.connector
import yaml

db = yaml.safe_load(open("yamls/db.yaml"))


# to do: treba promeniti tabelu da odgovar acuvanju valuta
class CryptoCurrencyTable:
    def __init__(self):
        crypto_currency_db = mysql.connector.connect(
            host=db["mysql_host"],
            user=db["mysql_user"],
            password=db["mysql_password"],
            database=db["mysql_db"]
        )

        crypto_currency_cursor = crypto_currency_db.cursor()
        # crypto_currency_cursor.execute('CREATE TABLE IF NOT EXISTS Costumers (FirstName varchar(32), LastName varchar(32), '
        #                   'Address varchar(32), City varchar(32), Country varchar(32), PhoneNumber varchar(32), '
        #                    'Password varchar(32), Email varchar(32))')
        crypto_currency_cursor.close()
        crypto_currency_db.close()

    # to do: treba promeniti tabelu da odgovar acuvanju valuta
    def add_crypto_currency(self, crypto_currency, crypto_currency_cursor, conn):
        # sql = 'INSERT INTO Costumers (FirstName, LastName, Address, City, Country, PhoneNumber, Password, Email) ' \
        #      'VALUES (%s, %s, %s, %s, %s, %s, %s, %s)'
        # val = (customer.first_name, customer.last_name, customer.address, customer.town, customer.country,
        #      customer.phoneNumber, customer.password, customer.email)
        # crypto_currency_cursor.execute(sql, val)
        conn.commit()

    def check_costumer(self, crypto_currency_cursor, email, password):
        crypto_currency_cursor.execute('SELECT * FROM Users')
        data = crypto_currency_cursor.fetchall()

        for costumer in data:
            print(costumer, '\n')
            if costumer[7] == email and costumer[6] == password:
               return True

        return False