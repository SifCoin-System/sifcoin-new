from database import db

class Produto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.Text)
    
    # Relacionamento com FaixaPreco
    faixas_preco = db.relationship('FaixaPreco', back_populates='produto', cascade='all, delete-orphan')

class FaixaPreco(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    produto_id = db.Column(db.Integer, db.ForeignKey('produto.id'), nullable=False)
    qtd_minima = db.Column(db.Integer, nullable=False)
    qtd_maxima = db.Column(db.Integer, nullable=False)
    preco_faixa = db.Column(db.Numeric(10, 2), nullable=False)

    # Relacionamento inverso
    produto = db.relationship('Produto', back_populates='faixas_preco')

class Movimento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    descricao = db.Column(db.String(255), nullable=False)
    valor = db.Column(db.Numeric(10, 2), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    data = db.Column(db.Date, nullable=False)
    tipo = db.Column(db.Enum('entrada', 'saida'), nullable=False)

class Cliente(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    telefone = db.Column(db.String(20))
    whatsapp = db.Column(db.Boolean, nullable=False)

class Venda(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    produto_id = db.Column(db.Integer, db.ForeignKey('produto.id'), nullable=False)
    quantidade = db.Column(db.Integer, nullable=False)
    valor = db.Column(db.Numeric(10, 2), nullable=False)
    data_venda = db.Column(db.Date, nullable=False)
    cliente_id = db.Column(db.Integer, db.ForeignKey('cliente.id'), nullable=False)

    produto = db.relationship('Produto', lazy=True) #backref='vendas'
    cliente = db.relationship('Cliente', lazy=True)
