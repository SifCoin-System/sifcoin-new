from flask import Blueprint, request, jsonify
from models import Movimento
from schemas import MovimentoSchema
from database import db
from datetime import datetime

movimento_bp = Blueprint('movimento_bp', __name__)
movimento_schema = MovimentoSchema()
movimentos_schema = MovimentoSchema(many=True)

# Adiciona um novo movimento
@movimento_bp.route('/', methods=['POST'])
def add_movimento():
    descricao = request.json['descricao']
    valor = request.json['valor']
    quantidade = request.json['quantidade']
    data = datetime.strptime(request.json['data'], '%Y-%m-%d').date()
    tipo = request.json['tipo']

    if tipo not in ['entrada', 'saida']:
        return jsonify({'error': 'Tipo inválido. Use "entrada" ou "saida".'}), 400

    novo_movimento = Movimento(descricao=descricao, valor=valor, quantidade=quantidade, data=data, tipo=tipo)
    db.session.add(novo_movimento)
    db.session.commit()
    return movimento_schema.jsonify(novo_movimento), 201

# Lista todos os movimentos
@movimento_bp.route('/', methods=['GET'])
def get_movimentos():
    movimentos = Movimento.query.all()
    return movimentos_schema.jsonify(movimentos)

# Busca um movimento específico por ID
@movimento_bp.route('/<int:id>', methods=['GET'])
def get_movimento(id):
    movimento = Movimento.query.get_or_404(id)
    return movimento_schema.jsonify(movimento)

# Atualiza um movimento existente
@movimento_bp.route('/<int:id>', methods=['PUT'])
def update_movimento(id):
    movimento = Movimento.query.get_or_404(id)
    movimento.descricao = request.json['descricao']
    movimento.valor = request.json['valor']
    movimento.quantidade = request.json['quantidade']
    data = datetime.strptime(request.json['data'], '%Y-%m-%d').date()
    movimento.tipo = request.json['tipo']

    if movimento.tipo not in ['entrada', 'saida']:
        return jsonify({'error': 'Tipo inválido. Use "entrada" ou "saida".'}), 400

    db.session.commit()
    return movimento_schema.jsonify(movimento)

# Deleta um movimento
@movimento_bp.route('/<int:id>', methods=['DELETE'])
def delete_movimento(id):
    movimento = Movimento.query.get_or_404(id)
    db.session.delete(movimento)
    db.session.commit()
    return jsonify({'message': 'Movimento deletado com sucesso'})
