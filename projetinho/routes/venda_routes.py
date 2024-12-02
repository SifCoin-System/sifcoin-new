from flask import Blueprint, request, jsonify
from models import Venda, Produto, Cliente
from schemas import VendaSchema
from database import db
from datetime import datetime

venda_bp = Blueprint('venda_bp', __name__)
venda_schema = VendaSchema()
vendas_schema = VendaSchema(many=True)

# Adiciona uma nova venda
@venda_bp.route('/', methods=['POST'])
def add_venda():
    produto_id = request.json['produto_id']
    cliente_id = request.json['cliente_id']
    quantidade = request.json['quantidade']
    valor = request.json['valor']
    data_venda = datetime.strptime(request.json['data_venda'], '%Y-%m-%d').date()

    # Validação básica para garantir que produto e cliente existem
    produto = Produto.query.get(produto_id)
    cliente = Cliente.query.get(cliente_id)
    if not produto:
        return jsonify({'error': 'Produto não encontrado'}), 404
    if not cliente:
        return jsonify({'error': 'Cliente não encontrado'}), 404

    nova_venda = Venda(produto_id=produto_id, cliente_id=cliente_id,
                       quantidade=quantidade, valor=valor, data_venda=data_venda)
    db.session.add(nova_venda)
    db.session.commit()
    return venda_schema.jsonify(nova_venda), 201

# Lista todas as vendas
@venda_bp.route('/', methods=['GET'])
def get_vendas():
    vendas = Venda.query.all()
    return vendas_schema.jsonify(vendas)

# Busca uma venda específica por ID
@venda_bp.route('/<int:id>', methods=['GET'])
def get_venda(id):
    venda = Venda.query.get_or_404(id)
    return venda_schema.jsonify(venda)

# Atualiza uma venda existente
@venda_bp.route('/<int:id>', methods=['PUT'])
def update_venda(id):
    venda = Venda.query.get_or_404(id)
    produto_id = request.json['produto_id']
    cliente_id = request.json['cliente_id']
    quantidade = request.json['quantidade']
    valor = request.json['valor']
    data_venda = datetime.strptime(request.json['data_venda'], '%Y-%m-%d').date()

    # Validação dos IDs de produto e cliente
    produto = Produto.query.get(produto_id)
    cliente = Cliente.query.get(cliente_id)
    if not produto:
        return jsonify({'error': 'Produto não encontrado'}), 404
    if not cliente:
        return jsonify({'error': 'Cliente não encontrado'}), 404

    venda.produto_id = produto_id
    venda.cliente_id = cliente_id
    venda.quantidade = quantidade
    venda.valor = valor
    venda.data_venda = data_venda

    db.session.commit()
    return venda_schema.jsonify(venda)

# Deleta uma venda
@venda_bp.route('/<int:id>', methods=['DELETE'])
def delete_venda(id):
    venda = Venda.query.get_or_404(id)
    db.session.delete(venda)
    db.session.commit()
    return jsonify({'message': 'Venda deletada com sucesso'})
