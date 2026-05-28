import * as SQLite from 'expo-sqlite';

// Inicializa o banco de dados 
export const inicializarBanco = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('cuidador.db');
    
    // Criando a tabela de medicamentos caso ela ainda não exista
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
    console.log("Banco de dados e tabela inicializados com sucesso!");
    return db;
  } catch (error) {
    console.error("Erro ao inicializar o banco de dados:", error);
  }
};

// Função auxiliar para pegar banco de dados aberto
export const obterConexaoBanco = async () => {
  return await SQLite.openDatabaseAsync('cuidador.db');
};

// CRUD

// 1. Criar - Inserir um novo medicamento
export const adicionarMedicamento = async (nome, dosagem, horario, instrucoes) => {
  const db = await obterConexaoBanco();
  try {
    const resultado = await db.runAsync(
      'INSERT INTO medicamentos (nome, dosagem, horario, instrucoes, status) VALUES (?, ?, ?, ?, 0);',
      [nome, dosagem, horario, instrucoes]
    );
    return resultado.lastInsertRowId; // O ID do item é criado e retornado
  } catch (error) {
    console.error("Erro ao inserir medicamento:", error);
  }
};

// 2. LER - Listar todos os medicamentos
export const listarMedicamentos = async () => {
  const db = await obterConexaoBanco();
  try {
    const todosRegistros = await db.getAllAsync('SELECT * FROM medicamentos ORDER BY horario ASC;');
    return todosRegistros;
  } catch (error) {
    console.error("Erro ao listar medicamentos:", error);
    return [];
  }
};

// 3. Atualizar - Mudar o status (Pendente = 0, Tomado = 1)
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

// 4. DELETE - Remover um medicamento do banco
export const eliminarMedicamento = async (id) => {
  const db = await obterConexaoBanco();
  try {
    await db.runAsync('DELETE FROM medicamentos WHERE id = ?;', [id]);
    return true;
  } catch (error) {
    console.error("Erro ao eliminar medicamento:", error);
  }
};