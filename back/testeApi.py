import requests

url = "http://127.0.0.1:5000/atracoes"

dados = {
    "nome": "Planetário",
    "coordenada_x": 35.5,
    "coordenada_y": 62.2
}

resposta = requests.post(url, json=dados)

print("Status:", resposta.status_code)
print("Resposta:", resposta.json())