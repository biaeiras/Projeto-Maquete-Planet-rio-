-- Cria a tabela de atrações do museu
CREATE TABLE IF NOT EXISTS atracoes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    resumo TEXT(150),
    link VARCHAR(255), 
    qtd_obras INTEGER(7), 
    coordenada_x DECIMAL(5,2),
    coordenada_y DECIMAL(5,2)

);

CREATE TABLE usuarios_site_atracoes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo VARCHAR(30) NOT NULL DEFAULT 'administrador'
);

-- -- Tabela de pessoas
-- CREATE TABLE IF NOT EXISTS pessoas (
--     id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     uid_rfid VARCHAR(50) UNIQUE
-- );

-- -- Tabela de visitas
-- CREATE TABLE IF NOT EXISTS visitas (
--     id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

--     pessoa_id INTEGER NOT NULL,
--     atracao_id INTEGER NOT NULL,

--     data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

--     CONSTRAINT fk_visitas_pessoas
--         FOREIGN KEY (pessoa_id)
--         REFERENCES pessoas(id),

--     CONSTRAINT fk_visitas_atracoes
--         FOREIGN KEY (atracao_id)
--         REFERENCES atracoes(id)
-- );
