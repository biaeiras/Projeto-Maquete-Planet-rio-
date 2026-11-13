from flask import Flask, request, jsonify, session, send_from_directory, redirect
import psycopg 

import os
from dotenv import load_dotenv
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from pathlib import Path

load_dotenv()

app = Flask(__name__)

CAMINHO_FRONT = Path(__file__).parent.parent / "front"

CAMINHO_ADMIN = CAMINHO_FRONT / "admin"

CAMINHO_PUBLICO = CAMINHO_FRONT / "publico"

app.secret_key = os.getenv("SECRET_KEY") 
CORS(app)

def conectar_banco():
    return psycopg.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD")

    )
def testar_conexao(): 
    try: 
        conexao = conectar_banco()
        print("Conexão com PostgreSQL realizada com sucesso!")

        conexao.close()

    except Exception as erro: 
        print("Erro ao conectar com PostgreSQL: ")
        print(erro)


@app.route("/") 
def inicio(): 
    return "API do Museu funcionando!"


@app.route("/atracoes", methods = ["POST"])
def cadastrar_atracao(): 

    if "usuario_id" not in session:
        return jsonify({
            "mensagem": "Faça login para continuar."
    }), 401


    dados = request.get_json()

    nome = dados["nome"]
    coordenada_x = dados["coordenada_x"]
    coordenada_y = dados["coordenada_y"]

    try: 
        conexao = conectar_banco()

        cursor = conexao.cursor()

        cursor.execute("""
            INSERT INTO atracoes (nome, coordenada_x, coordenada_y)
            VALUES (%s, %s, %s)
            RETURNING id;
        """, (nome, coordenada_x, coordenada_y))

    
        id_atracao = cursor.fetchone()[0]

        conexao.commit()

        cursor.close()
        conexao.close()

        return jsonify({
            "id": id_atracao,
            "nome": nome,
            "coordenada_x": coordenada_x,
            "coordenada_y": coordenada_y,
            "mensagem": "Atração cadastrada com sucesso!"
        }), 201

    except Exception as erro:
        print("Erro ao cadastrar atração:", erro)

        return jsonify({
            "mensagem": "Erro ao cadastrar atração."
        }), 500
    
@app.route("/atracoes", methods = ["GET"])
def listar_atracoes():
    try: 
        conexao = conectar_banco()
        
        cursor = conexao.cursor()

        cursor.execute("""
            SELECT id, nome, resumo, link, qtd_obras, coordenada_x, coordenada_y
            FROM atracoes
            ORDER BY id;
        """)

        atracoes = cursor.fetchall()

        cursor.close()

        conexao.close()

        listar_atracoes = []

        for atracao in atracoes: 
            listar_atracoes.append({
                "id": atracao[0], 
                "nome": atracao[1], 
                "resumo": atracao[2], 
                "link" : atracao[3], 
                "qtd_obras": atracao[4],
                "coordenada_x": float(atracao[5]) if atracao[5] is not None else None,
                "coordenada_y": float(atracao[6]) if atracao[6] is not None else None
            })

        return jsonify(listar_atracoes), 200

    except Exception as erro: 
        print("Erro ao listar atrações", erro)

        return jsonify({
                    "mensagem": "Erro ao cadastrar atração."
                }), 500
            
@app.route("/atracoes/<int:id>", methods=["DELETE"])
def excluir_atracao(id):

    if "usuario_id" not in session:
            return jsonify({
                "mensagem": "Faça login para continuar."
    }), 401

    try:
        conexao = conectar_banco()
        cursor = conexao.cursor()

        cursor.execute("""
            DELETE FROM atracoes
            WHERE id = %s
            RETURNING id;
        """, (id,))

        atracao_excluida = cursor.fetchone()

        conexao.commit()

        cursor.close()
        conexao.close()

        if atracao_excluida is None:
            return jsonify({
                "mensagem": "Atração não encontrada."
            }), 404

        return jsonify({
            "mensagem": "Atração excluída com sucesso!"
        }), 200

    except Exception as erro:
        print("Erro ao excluir atração:", erro)

        return jsonify({
            "mensagem": "Erro ao excluir atração."
        }), 500


@app.route("/atracoes/<int:id>", methods =["PUT"])

def editar_atracao(id): 

    if "usuario_id" not in session:
            return jsonify({
                "mensagem": "Faça login para continuar."
    }), 401

    dados = request.get_json()
    nome = dados["nome"]
    coordenada_x = dados["coordenada_x"]
    coordenada_y = dados["coordenada_y"]

    try: 
        conexao = conectar_banco()
        cursor = conexao.cursor()


        cursor.execute("""
                UPDATE atracoes
                SET nome = %s,
                    coordenada_x = %s,
                    coordenada_y = %s
                WHERE id = %s
                RETURNING id;
            """, (nome, coordenada_x, coordenada_y, id))

        atracao_atualizada = cursor.fetchone()

        conexao.commit()

        cursor.close()
        conexao.close()

        if atracao_atualizada is None:
            return jsonify({"mensagem": "Atração não encontrada."}), 404

        return jsonify({
            "id": id,
            "nome": nome,
            "coordenada_x": coordenada_x,
            "coordenada_y": coordenada_y,
            "mensagem": "Atração atualizada com sucesso!"
        }), 200

    except Exception as erro:
        print("Erro ao editar atração:", erro)

        return jsonify({"mensagem": "Erro ao atualizar atração."}), 500

def criar_usuário_admin(): 
    conexao = conectar_banco(); 
    cursor = conexao.cursor(); 

    nome = "Admin"
    email = "admin@museu.com"
    senha = "Museu123"

    senha_hash = generate_password_hash(senha); 


    cursor.execute("""
        INSERT INTO usuarios_site_atracoes (nome, email, senha)
        VALUES (%s, %s, %s)
        ON CONFLICT (email) DO NOTHING;
    """, (nome, email, senha_hash))

    conexao.commit()
    cursor.close()
    conexao.close()

    print("Usuário administrador criado ou já existente!")

@app.route("/admin/login")
def pagina_login(): 
    return send_from_directory(CAMINHO_ADMIN, "siteLogin.html")

@app.route("/admin/cadastro")
def pagina_cadastro(): 

    if "usuario_id" not in session:
        return redirect("/admin/login")

    return send_from_directory(CAMINHO_ADMIN, "siteCadastro.html")

@app.route("/admin/<path:arquivo>")
def arquivos_admin(arquivo):
    return send_from_directory(CAMINHO_ADMIN, arquivo)

@app.route("/logout")
def logout():
    session.clear();
    return redirect("/admin/login")


@app.route("/login", methods = ["POST"])
def login():

    dados = request.get_json()

    email = dados.get("email")
    senha = dados.get("senha")


    try: 
        conexao = conectar_banco()
        
        cursor = conexao.cursor()

        cursor.execute("""
            SELECT id, nome, email, senha
            FROM usuarios_site_atracoes
            WHERE email = %s;
        """, (email,))

        usuario = cursor.fetchone()

        cursor.close()

        conexao.close()

        if usuario is None: 
            return jsonify({"mensagem": "Email ou senha incorretos"}), 401


        senha_hash = usuario[3]; 

        if not check_password_hash(senha_hash, senha): 
            #401 - autenticação inválida 
            return jsonify({"mensagem": "Email ou senha incorreta"}), 401

        #guardando na sessão quem está conectado para não acessar diretamente outras telas sem passsar pelo login

        session["usuario_id"] = usuario[0]; 
        session["usuario_nome"] = usuario[1]; 


        return jsonify({
            "mensagem": "Login realizado com sucesso!",
            "usuario": {
                "id": usuario[0],
                "nome": usuario[1],
                "email": usuario[2]
            }
        }), 200


    except Exception as erro: 
        print("Erro ao realizar login", erro)

        return jsonify({
                    "mensagem": "Erro ao realizar login"
                }), 500
            

if __name__ == "__main__": 
    testar_conexao()
    criar_usuário_admin()
    app.run(debug = True)


