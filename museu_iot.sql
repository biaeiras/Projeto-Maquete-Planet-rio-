-- Cria a tabela de atrações do museu
CREATE TABLE IF NOT EXISTS atracoes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    localizacao VARCHAR(100)
);

ALTER TABLE atracoes
ADD COLUMN coordenada_x DECIMAL(5,2),
ADD COLUMN coordenada_y DECIMAL(5,2);

