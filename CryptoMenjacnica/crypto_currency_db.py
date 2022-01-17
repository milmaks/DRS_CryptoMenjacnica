import mysql.connector
import yaml

db = yaml.safe_load(open("CryptoMenjacnica/yamls/db.yaml"))


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
        crypto_currency_cursor.execute('CREATE TABLE IF NOT EXISTS CryptoCurrencies (CurrencyID varchar(32) NOT NULL PRIMARY KEY, CurrencyName varchar(32), '
                           'CurrencyValue decimal(65,5), CurrencyImage varchar(256))')
        crypto_currency_cursor.close()
        crypto_currency_db.close()

    def add_crypto_currency(self, crypto_currency, crypto_currency_cursor, conn):
        sql = 'INSERT INTO CryptoCurrencies (CurrencyID, CurrencyName, CurrencyValue, CurrencyImage) ' \
              'VALUES (%s, %s, %s, %s)'
        val = (crypto_currency.currency_id, crypto_currency.currency_name, crypto_currency.currency_value)
        crypto_currency_cursor.execute(sql, val)
        conn.commit()

    def get_all_crypto_currencies(self, crypto_currency_cursor):
        crypto_currency_cursor.execute('SELECT * FROM CryptoCurrencies')
        data = crypto_currency_cursor.fetchall()
        return data

    def get_all_crypto_currencies_noimg(self, crypto_currency_cursor):
        crypto_currency_cursor.execute('SELECT CurrencyID,CurrencyName,CurrencyValue FROM CryptoCurrencies')
        data = crypto_currency_cursor.fetchall()
        return data

    def update_crypto_currency(self, crypto_currency, crypto_currency_cursor, conn):
        sql = 'UPDATE CryptoCurrencies SET CurrencyValue = %s WHERE CurrencyID = %s'
        val = (crypto_currency.currency_value, crypto_currency.currency_id)
        crypto_currency_cursor.execute(sql, val)
        conn.commit()

    def check_crypto_currencies(self, crypto_currency_cursor):
        crypto_currency_cursor.execute('SELECT * FROM CryptoCurrencies')
        data = crypto_currency_cursor.fetchall()

        for currencie in data:
            print(currencie, '\n')
            if currencie[2] != None or currencie[2] != 0:
               return True

        return False