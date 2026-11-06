from flask import Flask, request, jsonify
import psycopg 

import os
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
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
            SELECT id, nome, coordenada_x, coordenada_y
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
                "coordenada_x": float(atracao[2]) if atracao[2] is not None else None,
                "coordenada_y": float(atracao[3]) if atracao[3] is not None else None
            })

        return jsonify(listar_atracoes), 200

    except Exception as erro: 
        print("Erro ao listar atrações", erro)

        return jsonify({
                    "mensagem": "Erro ao cadastrar atração."
                }), 500
            
@app.route("/atracoes/<int:id>", methods=["DELETE"])
def excluir_atracao(id):

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

if __name__ == "__main__": 
    testar_conexao()
    app.run(debug = True)