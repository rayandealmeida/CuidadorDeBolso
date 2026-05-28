import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { listarMedicamentos, alternarStatusMedicamento, eliminarMedicamento } from '../database/database';

export default function HomeScreen() {
  const [medicamentos, setMedicamentos] = useState([]);
  const isFocused = useIsFocused(); // Recarrega a tela quando o usuário volta para ela

  // Função para buscar dados do SQLite
  const carregarDados = async () => {
    const dados = await listarMedicamentos();
    setMedicamentos(dados);
  };

  useEffect(() => {
    if (isFocused) {
      carregarDados();
    }
  }, [isFocused]);

  // Função para marcar como Tomado/Pendente (Update)
  const handleAlternarStatus = async (id, statusAtual) => {
    await alternarStatusMedicamento(id, statusAtual);
    carregarDados(); // Atualiza a lista na tela
  };

  // Função para deletar o medicamento (Delete)
  const handleDeletar = (id) => {
    Alert.alert("Excluir", "Deseja remover este medicamento?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
          await eliminarMedicamento(id);
          carregarDados();
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Medicamentos de Hoje</Text>
      
      {medicamentos.length === 0 ? (
        <Text style={styles.textoVazio}>Nenhum remédio cadastrado.</Text>
      ) : (
        <FlatList
          data={medicamentos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.card, item.status === 1 && styles.cardTomado]}>
              <View style={styles.infoContainer}>
                <Text style={styles.nomeRemedio}>{item.nome} ({item.dosagem})</Text>
                <Text style={styles.horario}>Horário: {item.horario}</Text>
                {item.instrucoes ? <Text style={styles.instrucoes}>{item.instrucoes}</Text> : null}
              </View>
              
              <View style={styles.botoesContainer}>
                <TouchableOpacity 
                  style={[styles.botaoStatus, item.status === 1 ? styles.btnPendente : styles.btnTomado]}
                  onPress={() => handleAlternarStatus(item.id, item.status)}
                >
                  <Text style={styles.textoBotao}>{item.status === 1 ? "Desfazer" : "Tomado"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoDeletar} onPress={() => handleDeletar(item.id)}>
                  <Text style={styles.textoBotao}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333', marginTop: 40 },
  textoVazio: { textAlign: 'center', marginTop: 40, color: '#666', fontSize: 16 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, flexDirection: 'row', justifyContent: 'between', alignItems: 'center', elevation: 3 },
  cardTomado: { backgroundColor: '#d4edda', opacity: 0.8 },
  infoContainer: { flex: 1 },
  nomeRemedio: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  horario: { fontSize: 14, color: '#555', marginTop: 4 },
  instrucoes: { fontSize: 12, color: '#777', fontStyle: 'italic' },
  botoesContainer: { flexDirection: 'row', alignItems: 'center' },
  botaoStatus: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginRight: 8 },
  btnTomado: { backgroundColor: '#007bff' },
  btnPendente: { backgroundColor: '#6c757d' },
  botaoDeletar: { backgroundColor: '#dc3545', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6 },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});