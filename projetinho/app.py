from flask import Flask
from flask_cors import CORS
from database import db, init_db
from routes.produto_routes import produto_bp
from routes.cliente_routes import cliente_bp
from routes.movimento_routes import movimento_bp
from routes.venda_routes import venda_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///grafica.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializa o banco de dados
init_db(app)

# Configuração do CORS
CORS(app)

# Registra os blueprints das rotas
app.register_blueprint(produto_bp, url_prefix='/produtos')
app.register_blueprint(cliente_bp, url_prefix='/clientes')
app.register_blueprint(movimento_bp, url_prefix='/movimentos')
app.register_blueprint(venda_bp, url_prefix='/vendas')

if __name__ == '__main__':
    app.run(debug=True)
