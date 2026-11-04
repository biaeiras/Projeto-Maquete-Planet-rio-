-- Cria a tabela de atrações do museu
CREATE TABLE IF NOT EXISTS atracoes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    localizacao VARCHAR(100)
);