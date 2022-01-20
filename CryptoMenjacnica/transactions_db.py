import mysql.connector
import yaml
import threading

from datetime import datetime

from transaction_state_enum import TransactionState

db = yaml.safe_load(open("CryptoMenjacnica/yamls/db.yaml"))

class TransactionTable:
    def __init__(self):
        self.lock = threading.Lock()
        transactions_db = mysql.connector.connect(
            host=db["mysql_host"],
            user=db["mysql_user"],
            password=db["mysql_password"],
            database=db["mysql_db"]
        )


        transactions_cursor = transactions_db.cursor()
        transactions_cursor.execute('CREATE TABLE IF NOT EXISTS Transactions (TransactionID int NOT NULL AUTO_INCREMENT PRIMARY KEY, '
        'HashVal varchar(256), SenderEmail varchar(32), RecieverEmail varchar(32), Ammount decimal(65, 5), CurrencyID varchar(32), CurrentCurrencyValue decimal(65,5), Gas decimal(65, 5), Total decimal(65, 5), '
        'TimeStamp varchar(32), TransactionState varchar(32))')
        transactions_cursor.close()
        transactions_db.close()


    def add_transaction(self, HashVal, SenderEmail, RecieverEmail, Ammount, CurrencyID, CurrentCurrencyValue, Gas, TransactionState, transaction_cursor, conn):
        total = float(Ammount) + float(Gas)
        sql = 'INSERT INTO Transactions(HashVal, SenderEmail, RecieverEmail, Ammount, CurrencyID, CurrentCurrencyValue, Gas, Total, TimeStamp, TransactionState) ' \
        'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        toParse = str(TransactionState)
        state = toParse[17:]
        val = (HashVal, SenderEmail, RecieverEmail, Ammount, CurrencyID, 
                CurrentCurrencyValue, Gas, total, dt_string, state)
        
        transaction_cursor.execute(sql, val)
        conn.commit()

    def finish_transaction(self, HashVal, TransactionState, transaction_cursor, conn):
        sql = 'UPDATE Transactions SET TransactionState = %s WHERE HashVal = %s'
        toParse = str(TransactionState)
        state = toParse[17:]
        val = (state, HashVal)
        self.lock.acquire()
        transaction_cursor.execute(sql, val)
        conn.commit()
        self.lock.release()

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