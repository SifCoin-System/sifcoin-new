from models import Produto, Movimento, Cliente, Venda, FaixaPreco
from flask_marshmallow import Marshmallow
from marshmallow import fields

ma = Marshmallow()

class FaixaPrecoSchema(ma.SQLAlchemyAutoSchema):
    produto_id = fields.Integer(dump_only=True)  # Só para leitura (dump), não pode ser enviado no POST

    class Meta:
        model = FaixaPreco
        #include_fk = True  # Inclui a chave estrangeira 'produto_id' se necessário

class ProdutoSchema(ma.SQLAlchemyAutoSchema):
    faixas_preco = fields.List(fields.Nested(FaixaPrecoSchema))

    class Meta:
        model = Produto
        include_relationships = True

class MovimentoSchema(ma.SQLAlchemyAutoSchema):
    data = fields.Date(format="%d/%m/%Y")

    class Meta:
        model = Movimento

class ClienteSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Cliente

class VendaSchema(ma.SQLAlchemyAutoSchema):
    data_venda = fields.Date(format="%d/%m/%Y")
    produto = fields.Nested('ProdutoSchema', only=['id', 'nome', 'descricao', 'faixas_preco'])
    cliente = fields.Nested('ClienteSchema', only=['id', 'nome', 'telefone'])

    class Meta:
        model = Venda
        #include_fk = True
