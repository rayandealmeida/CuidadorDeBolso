import * as SQLite from 'expo-sqlite';

export const inicializarBanco = async () => {
  try {
    // 1. Mudado para cuidador_v3.db
    const db = await SQLite.openDatabaseAsync('cuidador_v3.db');
    
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS medicamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        dosagem TEXT NOT NULL,
        horario TEXT NOT NULL,
        instrucoes TEXT,
        dias_tratamento TEXT,
        tipo_ingestao TEXT,
        status INTEGER DEFAULT 0
      );
    `);
    console.log("Banco de dados atualizado com sucesso!");
    return db;
  } catch (error) {
    console.error("Erro ao inicializar o banco:", error);
  }
};

export const obterConexaoBanco = async () => {
  // 2. Mudado para cuidador_v3.db 
  return await SQLite.openDatabaseAsync('cuidador_v3.db');
};

// CREATE - Incluindo os novos campos
export const adicionarMedicamento = async (nome, dosagem, horario, instrucoes, dias_tratamento, tipo_ingestao) => {
  const db = await obterConexaoBanco();
  try {
    const resultado = await db.runAsync(
      'INSERT INTO medicamentos (nome, dosagem, horario, instrucoes, dias_tratamento, tipo_ingestao, status) VALUES (?, ?, ?, ?, ?, ?, 0);',
      [nome, dosagem, horario, instrucoes, dias_tratamento, tipo_ingestao]
    );
    return resultado.lastInsertRowId;
  } catch (error) {
    console.error("Erro ao inserir:", error);
  }
};

// Leitura - READ
export const listarMedicamentos = async () => {
  const db = await obterConexaoBanco();
  try {
    return await db.getAllAsync('SELECT * FROM medicamentos ORDER BY horario ASC;');
  } catch (error) {
    console.error("Erro ao listar:", error);
    return [];
  }
};

// UPDATE STATUS (Tomado/Pendente)
export const alternarStatusMedicamento = async (id, statusAtual) => {
  const db = await obterConexaoBanco();
  const novoStatus = statusAtual === 0 ? 1 : 0;
  try {
    await db.runAsync('UPDATE medicamentos SET status = ? WHERE id = ?;', [novoStatus, id]);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
  }
};

// UPDATE DADOS (Novo: Para editar as informações do remédio)
export const atualizarMedicamentoCompleto = async (id, nome, dosagem, horario, instrucoes, dias_tratamento, tipo_ingestao) => {
  const db = await obterConexaoBanco();
  try {
    await db.runAsync(
      'UPDATE medicamentos SET nome = ?, dosagem = ?, horario = ?, instrucoes = ?, dias_tratamento = ?, tipo_ingestao = ? WHERE id = ?;',
      [nome, dosagem, horario, instrucoes, dias_tratamento, tipo_ingestao, id]
    );
    return true;
  } catch (error) {
    console.error("Erro ao atualizar dados do medicamento:", error);
  }
};

// DELETE
export const eliminarMedicamento = async (id) => {
  const db = await obterConexaoBanco();
  try {
    await db.runAsync('DELETE FROM medicamentos WHERE id = ?;', [id]);
    return true;
  } catch (error) {
    console.error("Erro ao eliminar:", error);
  }
};