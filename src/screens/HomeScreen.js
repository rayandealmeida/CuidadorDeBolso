import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, 
  Modal, TextInput, ScrollView, Keyboard, TouchableWithoutFeedback 
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { 
  listarMedicamentos, alternarStatusMedicamento, eliminarMedicamento, atualizarMedicamentoCompleto 
} from '../database/database';

export default function HomeScreen() {
  const [medicamentos, setMedicamentos] = useState([]);
  const isFocused = useIsFocused();

  // Estados para o Modal de Edição (Item 1)
  const [modalVisivel, setModalVisivel] = useState(false);
  const [idEditando, setIdEditando] = useState(null);
  const [nomeEditando, setNomeEditando] = useState('');
  const [dosagemEditando, setDosagemEditando] = useState('');
  const [horarioEditando, setHorarioEditando] = useState('');
  const [diasEditando, setDiasEditando] = useState('');
  const [tipoEditando, setTipoEditando] = useState('');
  const [instrucoesEditando, setInstrucoesEditando] = useState('');

  const carregarDados = async () => {
    const dados = await listarMedicamentos();
    setMedicamentos(dados);
  };

  useEffect(() => {
    if (isFocused) carregarDados();
  }, [isFocused]);

  // Abre a janela de edição preenchendo os campos com os valores atuais do remédio
  const abrirEditar = (item) => {
    setIdEditando(item.id);
    setNomeEditando(item.nome);
    setDosagemEditando(item.dosagem);
    setHorarioEditando(item.horario);
    setDiasEditando(item.dias_tratamento || '');
    setTipoEditando(item.tipo_ingestao || '');
    setInstrucoesEditando(item.instrucoes || '');
    setModalVisivel(true);
  };

  // Salva a edição do medicamento
  const handleSalvarEdicao = async () => {
    if (!nomeEditando.trim() || !dosagemEditando.trim() || !horarioEditando.trim()) {
      Alert.alert("Erro", "Campos obrigatórios não podem ficar vazios.");
      return;
    }
    await atualizarMedicamentoCompleto(idEditando, nomeEditando, dosagemEditando, horarioEditando, instrucoesEditando, diasEditando, tipoEditando);
    setModalVisivel(false);
    carregarDados();
  };

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
                <Text style={styles.horario}>🕒 Horário: {item.horario}</Text>
                {item.dias_tratamento ? <Text style={styles.detalhes}>📅 {item.dias_tratamento}</Text> : null}
                {item.tipo_ingestao ? <Text style={styles.detalhes}>🍽️ {item.tipo_ingestao}</Text> : null}
                {item.instrucoes ? <Text style={styles.instrucoes}>📝 {item.instrucoes}</Text> : null}
              </View>
              
              <View style={styles.botoesContainer}>
                <TouchableOpacity 
                  style={[styles.botaoIcone, item.status === 1 ? styles.btnPendente : styles.btnTomado]}
                  onPress={() => alternarStatusMedicamento(item.id, item.status).then(carregarDados)}
                >
                  <Text style={styles.textoBotao}>{item.status === 1 ? "✓" : "Tomar"}</Text>
                </TouchableOpacity>

                {/* ADICIONADO REQUISITO : Botão para Editar Registro */}
                <TouchableOpacity style={[styles.botaoIcone, styles.btnEditar]} onPress={() => abrirEditar(item)}>
                  <Text style={styles.textoBotao}>✏️</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.botaoIcone, styles.btnDeletar]} onPress={() => handleDeletar(item.id)}>
                  <Text style={styles.textoBotao}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* MODAL DE EDIÇÃO */}
      <Modal visible={modalVisivel} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                <Text style={styles.modalTitulo}>Editar Medicamento</Text>
                
                <Text style={styles.label}>Nome *</Text>
                <TextInput style={styles.input} value={nomeEditando} onChangeText={setNomeEditando} />

                <Text style={styles.label}>Dosagem *</Text>
                <TextInput style={styles.input} value={dosagemEditando} onChangeText={setDosagemEditando} />

                <Text style={styles.label}>Horário *</Text>
                <TextInput style={styles.input} value={horarioEditando} onChangeText={setHorarioEditando} />

                <Text style={styles.label}>Duração</Text>
                <TextInput style={styles.input} value={diasEditando} onChangeText={setDiasEditando} />

                <Text style={styles.label}>Como tomar</Text>
                <TextInput style={styles.input} value={tipoEditando} onChangeText={setTipoEditando} />

                <Text style={styles.label}>Instruções</Text>
                <TextInput style={styles.input} value={instrucoesEditando} onChangeText={setInstrucoesEditando} multiline />

                <View style={styles.modalBotoes}>
                  <TouchableOpacity style={[styles.btnModal, styles.btnCancelar]} onPress={() => setModalVisivel(false)}>
                    <Text style={styles.textoBotao}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.btnModal, styles.btnSalvarEdicao]} onPress={handleSalvarEdicao}>
                    <Text style={styles.textoBotao}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 60 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  textoVazio: { textAlign: 'center', marginTop: 40, color: '#666', fontSize: 16 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 },
  cardTomado: { backgroundColor: '#d4edda', opacity: 0.7 },
  infoContainer: { flex: 1, marginRight: 10 },
  nomeRemedio: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  horario: { fontSize: 14, color: '#007bff', marginTop: 4, fontWeight: '600' },
  detalhes: { fontSize: 13, color: '#555', marginTop: 2 },
  instrucoes: { fontSize: 12, color: '#777', fontStyle: 'italic', marginTop: 3 },
  botoesContainer: { flexDirection: 'row', alignItems: 'center' },
  botaoIcone: { paddingVertical: 10, paddingHorizontal: 10, borderRadius: 6, marginLeft: 5, justifyContent: 'center', alignItems: 'center', minWidth: 40 },
  btnTomado: { backgroundColor: '#28a745' },
  btnPendente: { backgroundColor: '#6c757d' },
  btnEditar: { backgroundColor: '#ffc107' },
  btnDeletar: { backgroundColor: '#dc3545' },
  textoBotao: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  
  // Estilos do Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, maxHeight: '80%' },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  label: { fontSize: 12, fontWeight: '600', color: '#666', marginBottom: 3 },
  input: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 6, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  modalBotoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  btnModal: { flex: 0.48, padding: 12, borderRadius: 6, alignItems: 'center' },
  btnCancelar: { backgroundColor: '#6c757d' },
  btnSalvarEdicao: { backgroundColor: '#007bff' }
});