import requests

id_atracao = 2

url = f"http://127.0.0.1:5000/atracoes/{id_atracao}"

resposta = requests.delete(url)

print("Status:", resposta.status_code)
print("Resposta:", resposta.json())