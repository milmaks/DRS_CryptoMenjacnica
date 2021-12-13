from marshmallow import Schema,fields,post_load

class CustomerSchema(Schema):
    name = fields.Str()
    password = fields.Str()
    address = fields.Str()
    town = fields.Str()
    country = fields.Str()
    phoneNum = fields.Str()
    email = fields.Str()
    
    #mapiramo customera 
    @post_load
    def postLoadMethod(self,data,**kwargs):
        return Customer(**data)
    


class Customer:
    name = None
    password = None
    address = None
    town = None
    country = None
    phoneNumber = None
    email = None
    
    #konsutrktor sa poljima
    def __init__(self,name,password,address,town,country,phoneNumber,email):
        self.name = name
        self.address = address 
        self.password = password
        self.town = town
        self.country = country
        self.phoneNumber = phoneNumber
        self.email = email
        
    #c# notacija ToString() metoda
    def __repr__(self) -> str:
        return f'<Customer {self.name}, {self.town} {self.country} {self.address} {self.phoneNumber}'
    
    
    
    
    


