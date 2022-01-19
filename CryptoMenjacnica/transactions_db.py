import mysql.connector
import yaml

from datetime import datetime

db = yaml.safe_load(open("CryptoMenjacnica/yamls/db.yaml"))

class TransactionTable:
    def __init__(self):
        transactions_db = mysql.connector.connect(
            host=db["mysql_host"],
            user=db["mysql_user"],
            password=db["mysql_password"],
            database=db["mysql_db"]
        )


        transactions_cursor = transactions_db.cursor()
        transactions_cursor.execute('CREATE TABLE IF NOT EXISTS Transactions (TransactionID int NOT NULL AUTO_INCREMENT PRIMARY KEY, '
        'SenderEmail varchar(32), RecieverEmail varchar(32), Ammount decimal(65, 5), CurrencyID varchar(32), CurrentCurrencyValue decimal(65,5), '
        'TimeStamp varchar(32))')
        transactions_cursor.close()
        transactions_db.close()


    def add_transaction(self, SenderEmail, RecieverEmail, Ammount, CurrencyID, CurrentCurrencyValue, transaction_cursor, conn):
        sql = 'INSERT INTO Transactions(SenderEmail, RecieverEmail, Ammount, CurrencyID, CurrentCurrencyValue, TimeStamp) ' \
        'VALUES (%s, %s, %s, %s, %s, %s)'
        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        val = (SenderEmail, RecieverEmail, Ammount, CurrencyID, 
                CurrentCurrencyValue, dt_string)
        transaction_cursor.execute(sql, val)
        conn.commit()


    def get_my_transactions(self, transaction_cursor, email):
        sql = 'SELECT * FROM Transactions ' \
                'WHERE SenderEmail = %s ' \
                'OR RecieverEmail = %s'
        val = (email, email)
        transaction_cursor.execute(sql, val)
        data = transaction_cursor.fetchall()

        return data


    def get_my_transactions_as_sender(self, transaction_cursor, email):
        sql = 'SELECT * FROM Transactions ' \
                'WHERE SenderEmail = %s '
        val = email
        transaction_cursor.execute(sql, val)
        data = transaction_cursor.fetchall()

        return data


    def get_my_transactions_as_reciever(self, transaction_cursor, email):
        sql = 'SELECT * FROM Transactions ' \
                'WHERE RecieverEmail = %s '
        val = email
        transaction_cursor.execute(sql, val)
        data = transaction_cursor.fetchall()

        return data