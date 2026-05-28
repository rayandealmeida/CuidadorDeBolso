import * as SQLite from 'expo-sqlite';

// Inicializa o banco abrindo a conexão de forma direta
export const inicializarBanco = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('cuidador.db');
    
    // Cria a tabela de medicamentos se ela ainda não existir
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS medicamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        dosagem TEXT NOT NULL,
        horario TEXT NOT NULL,
        instrucoes TEXT,
        status INTEGER DEFAULT 0
      );
    `);
    console.log("Banco de dados inicializado com sucesso!");
    return db;
  } catch (error) {
    console.error("Erro ao inicializar o banco:", error);
  }
};

// Abre e retorna a instância do banco para operações rápidas
export const obterConexaoBanco = async () => {
  return await SQLite.openDatabaseAsync('cuidador.db');
};

// 1. CREATE
export const adicionarMedicamento = async (nome, dosagem, horario, instrucoes) => {
  const db = await obterConexaoBanco();
  try {
    const resultado = await db.runAsync(
      'INSERT INTO medicamentos (nome, dosagem, horario, instrucoes, status) VALUES (?, ?, ?, ?, 0);',
      [nome, dosagem, horario, instrucoes]
    );
    return resultado.lastInsertRowId;
  } catch (error) {
    console.error("Erro ao inserir:", error);
  }
};

// 2. READ
export const listarMedicamentos = async () => {
  const db = await obterConexaoBanco();
  try {
    return await db.getAllAsync('SELECT * FROM medicamentos ORDER BY horario ASC;');
  } catch (error) {
    console.error("Erro ao listar:", error);
    return [];
  }
};

// 3. UPDATE
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

// 4. DELETE
export const eliminarMedicamento = async (id) => {
  const db = await obterConexaoBanco();
  try {
    await db.runAsync('DELETE FROM medicamentos WHERE id = ?;', [id]);
    return true;
  } catch (error) {
    console.error("Erro ao eliminar:", error);
  }
};