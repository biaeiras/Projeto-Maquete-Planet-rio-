from flask import Flask, request, jsonify
import psycopg 

import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

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
    
    


if __name__ == "__main__": 
    testar_conexao()
    app.run(debug = True)