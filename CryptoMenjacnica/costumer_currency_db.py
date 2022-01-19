import mysql.connector
import yaml
from crypto_currency_enum import CurrencyType

db = yaml.safe_load(open("CryptoMenjacnica/yamls/db.yaml"))


class CostumerCryptoCurrencyTable:
    def __init__(self):
        costumer_crypto_currency_db = mysql.connector.connect(
            host=db["mysql_host"],
            user=db["mysql_user"],
            password=db["mysql_password"],
            database=db["mysql_db"]
        )

        costumer_crypto_currency_cursor = costumer_crypto_currency_db.cursor()
        costumer_crypto_currency_cursor.execute('CREATE TABLE IF NOT EXISTS CostumerCryptoCurrencies (CostumerID varchar(32) NOT NULL PRIMARY KEY, BTC varchar(32), ETH varchar(32), '
                                                                            'BNB varchar(32), USDT varchar(32), SOL varchar(32), ADA varchar(32), USDC varchar(32), XRP varchar(32),' 
                                                                            'DOT varchar(32), AVAX varchar(32), LUNA varchar(32), DOGE varchar(32), SHIB varchar(32), MATIC varchar(32), '
                                                                            'XCH varchar(32))')
        costumer_crypto_currency_cursor.close()
        costumer_crypto_currency_cursor.close()


    #kada se verifikuje korisnik treba da se doda u bazu
    def add_costumer_to_table(self, email, costumer_crypto_currency_cursor, conn):
            sql = 'INSERT INTO CostumerCryptoCurrencies (CostumerID, BTC, ETH, BNB, USDT, SOL, ADA, USDC, XRP, DOT, AVAX, LUNA, DOGE, SHIB, MATIC, XCH) ' \
                'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'
            val = (email, "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL", "NULL")
            costumer_crypto_currency_cursor.execute(sql, val)
            conn.commit()

    def add_cryptocurency_to_table(self, email, cryptotype, crytpo_amount, costumer_crypto_currency_cursor, conn):
        sql = 'SELECT * FROM CostumerCryptoCurrencies WHERE CostumerID = %s'
        val = (email)
        costumer_crypto_currency_cursor.execute(sql, val)
        data = costumer_crypto_currency_cursor.fetchall()

        crypto_d = {"BTC" : data[0][1], "ETH" : data[0][2], "BNB" : data[0][3], "USDT" : data[0][4], "SOL" : data[0][5], "ADA" : data[0][6], "USDC" : data[0][7], "XRP" : data[0][8], "DOT" : data[0][9], "AVAX" : data[0][10], "LUNA" : data[0][11], "DOGE" : data[0][12], "SHIB" : data[0][13], "MATIC" : data[0][14], "XCH" : data[0][15] }

        sql = ""
        val = ()

        if cryptotype.name == 'BTC':
            sql = 'UPDATE CostumerCryptoCurrencies SET BTC = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'ETH':
            sql = 'UPDATE CostumerCryptoCurrencies SET ETH = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'BNB':
            sql = 'UPDATE CostumerCryptoCurrencies SET BNB = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'USDT':
            sql = 'UPDATE CostumerCryptoCurrencies SET USDT = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'SOL':
            sql = 'UPDATE CostumerCryptoCurrencies SET SOL = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'ADA':
            sql = 'UPDATE CostumerCryptoCurrencies SET ADA = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'USDC':
            sql = 'UPDATE CostumerCryptoCurrencies SET USDC = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'XRP':
            sql = 'UPDATE CostumerCryptoCurrencies SET XRP = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'DOT':
            sql = 'UPDATE CostumerCryptoCurrencies SET DOT = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'AVAX':
            sql = 'UPDATE CostumerCryptoCurrencies SET AVAX = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'LUNA':
            sql = 'UPDATE CostumerCryptoCurrencies SET LUNA = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'DOGE':
            sql = 'UPDATE CostumerCryptoCurrencies SET DOGE = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'SHIB':
            sql = 'UPDATE CostumerCryptoCurrencies SET SHIB = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'MATIC':
            sql = 'UPDATE CostumerCryptoCurrencies SET MATIC = %s WHERE CostumerID = %s'
        elif cryptotype.name == 'XCH':
            sql = 'UPDATE CostumerCryptoCurrencies SET XCH = %s WHERE CostumerID = %s'


        if crypto_d[cryptotype.name] != 'NULL':
            intAmount = float(crypto_d[cryptotype.name]) + float(crytpo_amount)
            crypto_d[cryptotype.name] = str(intAmount)
            val = (crypto_d[cryptotype.name], email)
        else:
            val = (crytpo_amount, email)

        costumer_crypto_currency_cursor.execute(sql, val)
        conn.commit()


    def trade_crypto(self, email, crypto_one, crypto_two, amount_one, amount_two, costumer_crypto_currency_cursor, conn):
        sql = 'SELECT * FROM CostumerCryptoCurrencies WHERE CostumerID = %s'
        val = (email)
        costumer_crypto_currency_cursor.execute(sql, val)
        data = costumer_crypto_currency_cursor.fetchall()

        crypto_d = {"BTC" : data[0][1], "ETH" : data[0][2], "BNB" : data[0][3], "USDT" : data[0][4], "SOL" : data[0][5], "ADA" : data[0][6], "USDC" : data[0][7], "XRP" : data[0][8], "DOT" : data[0][9], "AVAX" : data[0][10], "LUNA" : data[0][11], "DOGE" : data[0][12], "SHIB" : data[0][13], "MATIC" : data[0][14], "XCH" : data[0][15] }

        if crypto_d[crypto_one.name] == 'NULL' or crypto_d[crypto_one.name] < amount_one:
            return False

        sql = ["", ""]
        val = ["", ""]

        for i in range(2):
            if i == 0:
                cryptotype = crypto_one
            else:
                cryptotype = crypto_two

            if cryptotype.name == 'BTC':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET BTC = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'ETH':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET ETH = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'BNB':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET BNB = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'USDT':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET USDT = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'SOL':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET SOL = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'ADA':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET ADA = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'USDC':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET USDC = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'XRP':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET XRP = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'DOT':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET DOT = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'AVAX':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET AVAX = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'LUNA':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET LUNA = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'DOGE':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET DOGE = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'SHIB':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET SHIB = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'MATIC':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET MATIC = %s WHERE CostumerID = %s'
            elif cryptotype.name == 'XCH':
                sql[i] = 'UPDATE CostumerCryptoCurrencies SET XCH = %s WHERE CostumerID = %s'
        
        #ovde zamena oduzimanje i dodavanje valuta
        intAmount = float(crypto_d[crypto_one.name]) - float(amount_one)
        crypto_d[crypto_one.name] = str(intAmount)
        val[0] = (crypto_d[crypto_one.name], email)

        if crypto_d[crypto_two.name] != 'NULL':
            intAmount = float(crypto_d[crypto_two.name]) + float(amount_two)
            crypto_d[crypto_two.name] = str(intAmount)
            val[1] = (crypto_d[crypto_two.name], email)
        else:
            crypto_d[crypto_two.name] = str(amount_two)
            val[1] = (amount_two, email)

        costumer_crypto_currency_cursor.execute(sql[0], val[0])
        costumer_crypto_currency_cursor.execute(sql[1], val[1])
        conn.commit()

    def retrive_all_currency_of_costumer(self, email, costumer_crypto_currency_cursor, conn):
        sql = 'SELECT * FROM CostumerCryptoCurrencies WHERE CostumerID = %s'
        val = (email)
        costumer_crypto_currency_cursor.execute(sql, val)
        data = costumer_crypto_currency_cursor.fetchall()

        crypto_d = {"BTC" : data[0][1], "ETH" : data[0][2], "BNB" : data[0][3], "USDT" : data[0][4], "SOL" : data[0][5], "ADA" : data[0][6], "USDC" : data[0][7], "XRP" : data[0][8], "DOT" : data[0][9], "AVAX" : data[0][10], "LUNA" : data[0][11], "DOGE" : data[0][12], "SHIB" : data[0][13], "MATIC" : data[0][14], "XCH" : data[0][15] }
        
        return crypto_d


    def send_crypto(self, email, cryptoID, amount, costumer_crypto_currency_cursor, conn):
        sql = 'SELECT * FROM CostumerCryptoCurrencies WHERE CostumerID = %s'
        val = (email)
        costumer_crypto_currency_cursor.execute(sql, val)
        data = costumer_crypto_currency_cursor.fetchall()
        crypto_d = {"BTC" : data[0][1], "ETH" : data[0][2], "BNB" : data[0][3], "USDT" : data[0][4], "SOL" : data[0][5], "ADA" : data[0][6], "USDC" : data[0][7], "XRP" : data[0][8], "DOT" : data[0][9], "AVAX" : data[0][10], "LUNA" : data[0][11], "DOGE" : data[0][12], "SHIB" : data[0][13], "MATIC" : data[0][14], "XCH" : data[0][15] }
        curAmount = float(crypto_d[cryptoID])
        toReduce = float(amount)
        gas = 0.05 * toReduce
        if curAmount >= toReduce + gas:
            curAmount = curAmount - toReduce - gas
        
        if curAmount == 0:
            curAmount = 'NULL'

        sql = ""
        val = (curAmount, email)

        if cryptoID == 'BTC':
            sql = 'UPDATE CostumerCryptoCurrencies SET BTC = %s WHERE CostumerID = %s'
        elif cryptoID == 'ETH':
            sql = 'UPDATE CostumerCryptoCurrencies SET ETH = %s WHERE CostumerID = %s'
        elif cryptoID == 'BNB':
            sql = 'UPDATE CostumerCryptoCurrencies SET BNB = %s WHERE CostumerID = %s'
        elif cryptoID == 'USDT':
            sql = 'UPDATE CostumerCryptoCurrencies SET USDT = %s WHERE CostumerID = %s'
        elif cryptoID == 'SOL':
            sql = 'UPDATE CostumerCryptoCurrencies SET SOL = %s WHERE CostumerID = %s'
        elif cryptoID == 'ADA':
            sql = 'UPDATE CostumerCryptoCurrencies SET ADA = %s WHERE CostumerID = %s'
        elif cryptoID == 'USDC':
            sql = 'UPDATE CostumerCryptoCurrencies SET USDC = %s WHERE CostumerID = %s'
        elif cryptoID == 'XRP':
            sql = 'UPDATE CostumerCryptoCurrencies SET XRP = %s WHERE CostumerID = %s'
        elif cryptoID == 'DOT':
            sql = 'UPDATE CostumerCryptoCurrencies SET DOT = %s WHERE CostumerID = %s'
        elif cryptoID == 'AVAX':
            sql = 'UPDATE CostumerCryptoCurrencies SET AVAX = %s WHERE CostumerID = %s'
        elif cryptoID == 'LUNA':
            sql = 'UPDATE CostumerCryptoCurrencies SET LUNA = %s WHERE CostumerID = %s'
        elif cryptoID == 'DOGE':
            sql = 'UPDATE CostumerCryptoCurrencies SET DOGE = %s WHERE CostumerID = %s'
        elif cryptoID == 'SHIB':
            sql = 'UPDATE CostumerCryptoCurrencies SET SHIB = %s WHERE CostumerID = %s'
        elif cryptoID == 'MATIC':
            sql = 'UPDATE CostumerCryptoCurrencies SET MATIC = %s WHERE CostumerID = %s'
        elif cryptoID == 'XCH':
            sql = 'UPDATE CostumerCryptoCurrencies SET XCH = %s WHERE CostumerID = %s'
        
        costumer_crypto_currency_cursor.execute(sql, val)
        conn.commit()
        

    def recieve_crypto(self, email, cryptoID, amount, costumer_crypto_currency_cursor, conn):
        sql = 'SELECT * FROM CostumerCryptoCurrencies WHERE CostumerID = %s'
        val = (email)
        costumer_crypto_currency_cursor.execute(sql, val)
        data = costumer_crypto_currency_cursor.fetchall()

        crypto_d = {"BTC" : data[0][1], "ETH" : data[0][2], "BNB" : data[0][3], "USDT" : data[0][4], "SOL" : data[0][5], "ADA" : data[0][6], "USDC" : data[0][7], "XRP" : data[0][8], "DOT" : data[0][9], "AVAX" : data[0][10], "LUNA" : data[0][11], "DOGE" : data[0][12], "SHIB" : data[0][13], "MATIC" : data[0][14], "XCH" : data[0][15] }
        curAmount = 0
        if crypto_d[cryptoID] == 'NULL':
            crypto_d[cryptoID] = amount
            curAmount = float(amount)
        else:
            curAmount = float(crypto_d[cryptoID])
            toAdd = float(amount)
            curAmount += toAdd

        sql = ""
        val = (curAmount, email)

        if cryptoID == 'BTC':
            sql = 'UPDATE CostumerCryptoCurrencies SET BTC = %s WHERE CostumerID = %s'
        elif cryptoID == 'ETH':
            sql = 'UPDATE CostumerCryptoCurrencies SET ETH = %s WHERE CostumerID = %s'
        elif cryptoID == 'BNB':
            sql = 'UPDATE CostumerCryptoCurrencies SET BNB = %s WHERE CostumerID = %s'
        elif cryptoID == 'USDT':
            sql = 'UPDATE CostumerCryptoCurrencies SET USDT = %s WHERE CostumerID = %s'
        elif cryptoID == 'SOL':
            sql = 'UPDATE CostumerCryptoCurrencies SET SOL = %s WHERE CostumerID = %s'
        elif cryptoID == 'ADA':
            sql = 'UPDATE CostumerCryptoCurrencies SET ADA = %s WHERE CostumerID = %s'
        elif cryptoID == 'USDC':
            sql = 'UPDATE CostumerCryptoCurrencies SET USDC = %s WHERE CostumerID = %s'
        elif cryptoID == 'XRP':
            sql = 'UPDATE CostumerCryptoCurrencies SET XRP = %s WHERE CostumerID = %s'
        elif cryptoID == 'DOT':
            sql = 'UPDATE CostumerCryptoCurrencies SET DOT = %s WHERE CostumerID = %s'
        elif cryptoID == 'AVAX':
            sql = 'UPDATE CostumerCryptoCurrencies SET AVAX = %s WHERE CostumerID = %s'
        elif cryptoID == 'LUNA':
            sql = 'UPDATE CostumerCryptoCurrencies SET LUNA = %s WHERE CostumerID = %s'
        elif cryptoID == 'DOGE':
            sql = 'UPDATE CostumerCryptoCurrencies SET DOGE = %s WHERE CostumerID = %s'
        elif cryptoID == 'SHIB':
            sql = 'UPDATE CostumerCryptoCurrencies SET SHIB = %s WHERE CostumerID = %s'
        elif cryptoID == 'MATIC':
            sql = 'UPDATE CostumerCryptoCurrencies SET MATIC = %s WHERE CostumerID = %s'
        elif cryptoID == 'XCH':
            sql = 'UPDATE CostumerCryptoCurrencies SET XCH = %s WHERE CostumerID = %s'
        
        costumer_crypto_currency_cursor.execute(sql, val)
        conn.commit()