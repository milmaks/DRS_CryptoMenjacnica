from marshmallow import Schema, fields, post_load


class CustomerSchema(Schema):
    first_name = fields.Str()
    last_name = fields.Str()
    password = fields.Str()
    address = fields.Str()
    town = fields.Str()
    country = fields.Str()
    phone_number = fields.Str()
    email = fields.Str()
    
    #mapiramo customera 
    @post_load
    def postLoadMethod(self, data, **kwargs):
        return Customer(**data)


class Customer():
    first_name = None
    last_name = None
    password = None
    address = None
    town = None
    country = None
    phoneNumber = None
    email = None
    
    #konsutrktor sa poljima
    def __init__(self, fist_name, last_name, password, address, town, country, phone_number, email):
        self.first_name = fist_name
        self.last_name = last_name
        self.address = address
        self.password = password
        self.town = town
        self.country = country
        self.phoneNumber = phone_number
        self.email = email
        
    #c# notacija ToString() metoda
    #def __repr__(self) -> str:
    #   return f'<Customer {self.first_name}, {self.last_name}, {self.town} {self.country} {self.address} {self.phone_number}'
    
    
    
    
    


