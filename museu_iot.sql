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



-- Tabela de pessoas
CREATE TABLE IF NOT EXISTS pessoas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uid_rfid VARCHAR(50) UNIQUE
);

-- Tabela de visitas
CREATE TABLE IF NOT EXISTS visitas (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    pessoa_id INTEGER NOT NULL,
    atracao_id INTEGER NOT NULL,

    data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_visitas_pessoas
        FOREIGN KEY (pessoa_id)
        REFERENCES pessoas(id),

    CONSTRAINT fk_visitas_atracoes
        FOREIGN KEY (atracao_id)
        REFERENCES atracoes(id)
);
