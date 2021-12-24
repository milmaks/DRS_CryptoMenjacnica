from marshmallow import Schema, fields, post_load

class CryptoCurrencySchema(Schema):
    currency_id = fields.Str()
    currency_name = fields.Str()
    currency_value = fields.Float

    @post_load
    def postLoadMethod(self, data, **kwargs):
        return CryptoCurrency(**data)


class CryptoCurrency():
    currency_id = None
    currency_name = None
    currency_value = None

    def __init__(self, currency_id, currency_name, currency_value):
        self.currency_id = currency_id
        self.currency_name = currency_name
        self.currency_value = currency_value