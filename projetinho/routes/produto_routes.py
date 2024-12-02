from flask import Blueprint, request, jsonify
from models import Produto, FaixaPreco
from schemas import ProdutoSchema
from database import db

produto_bp = Blueprint('produto_bp', __name__)
produto_schema = ProdutoSchema()
produtos_schema = ProdutoSchema(many=True)

@produto_bp.route('/', methods=['POST'])
def add_produto():
    nome = request.json['nome']
    descricao = request.json.get('descricao', '')
    
    novo_produto = Produto(nome=nome, descricao=descricao)

    # Adicionar as faixas de preço
    for faixa in request.get_json()['faixas_preco']:
        nova_faixa = FaixaPreco(
            qtd_minima=faixa['qtd_minima'],
            qtd_maxima=faixa['qtd_maxima'],
            preco_faixa=faixa['preco_faixa'],
            produto=novo_produto
        )
        db.session.add(nova_faixa)

    db.session.add(novo_produto)
    db.session.commit()
    return produto_schema.jsonify(novo_produto)

@produto_bp.route('/', methods=['GET'])
def get_produtos():
    produtos = Produto.query.all()
    return produtos_schema.jsonify(produtos)

@produto_bp.route('/<int:id>', methods=['GET'])
def get_produto(id):
    produto = Produto.query.get_or_404(id)
    return produto_schema.jsonify(produto)

@produto_bp.route('/<int:id>', methods=['PUT'])
def update_produto(id):
    produto = Produto.query.get_or_404(id)
    produto.nome = request.json['nome']
    produto.descricao = request.json.get('descricao', produto.descricao)
    produto.preco = request.json['preco']
    db.session.commit()
    return produto_schema.jsonify(produto)

@produto_bp.route('/<int:id>', methods=['DELETE'])
def delete_produto(id):
    produto = Produto.query.get_or_404(id)
    db.session.delete(produto)
    db.session.commit()
    return jsonify({'message': 'Produto deletado com sucesso'})
