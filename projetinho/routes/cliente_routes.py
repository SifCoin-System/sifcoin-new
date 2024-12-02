from flask import Blueprint, request, jsonify
from models import Cliente
from schemas import ClienteSchema
from database import db

cliente_bp = Blueprint('cliente_bp', __name__)
cliente_schema = ClienteSchema()
clientes_schema = ClienteSchema(many=True)

# Adiciona um novo cliente
@cliente_bp.route('/', methods=['POST'])
def add_cliente():
    nome = request.json['nome']
    telefone = request.json.get('telefone', '')
    whatsapp = request.json['whatsapp']

    novo_cliente = Cliente(nome=nome, telefone=telefone, whatsapp=whatsapp)
    db.session.add(novo_cliente)
    db.session.commit()
    return cliente_schema.jsonify(novo_cliente), 201

# Lista todos os clientes
@cliente_bp.route('/', methods=['GET'])
def get_clientes():
    clientes = Cliente.query.all()
    return clientes_schema.jsonify(clientes)

# Busca um cliente específico por ID
@cliente_bp.route('/<int:id>', methods=['GET'])
def get_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    return cliente_schema.jsonify(cliente)

# Atualiza um cliente existente
@cliente_bp.route('/<int:id>', methods=['PUT'])
def update_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    cliente.nome = request.json['nome']
    cliente.telefone = request.json.get('telefone', cliente.telefone)
    cliente.whatsapp = request.json['whatsapp']

    db.session.commit()
    return cliente_schema.jsonify(cliente)

# Deleta um cliente
@cliente_bp.route('/<int:id>', methods=['DELETE'])
def delete_cliente(id):
    cliente = Cliente.query.get_or_404(id)
    db.session.delete(cliente)
    db.session.commit()
    return jsonify({'message': 'Cliente deletado com sucesso'})
