import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { adicionarMedicamento } from '../database/database';

export default function AddScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [horario, setHorario] = useState('');
  const [instrucoes, setInstrucoes] = useState('');

  const handleSalvar = async () => {
    if (!nome || !dosagem || !horario) {
      Alert.alert("Atenção", "Por favor, preencha os campos obrigatórios (Nome, Dosagem e Horário).");
      return;
    }

    await adicionarMedicamento(nome, dosagem, horario, instrucoes);
    Alert.alert("Sucesso", "Medicamento cadastrado!", [
      { text: "OK", onPress: () => {
          // Limpa os campos do formulário
          setNome(''); setDosagem(''); setHorario(''); setInstrucoes('');
          // Volta para a tela inicial
          navigation.navigate('Remédios');
        } 
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Novo Medicamento</Text>

      <Text style={styles.label}>Nome do Remédio *</Text>
      <TextInput style={styles.input} placeholder="Ex: Paracetamol" value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Dosagem *</Text>
      <TextInput style={styles.input} placeholder="Ex: 1 comprimido, 500mg" value={dosagem} onChangeText={setDosagem} />

      <Text style={styles.label}>Horário *</Text>
      <TextInput style={styles.input} placeholder="Ex: 08:00" value={horario} onChangeText={setHorario} />

      <Text style={styles.label}>Instruções (Opcional)</Text>
      <TextInput style={[styles.input, styles.inputLongo]} placeholder="Ex: Tomar após o café da manhã" value={instrucoes} onChangeText={setInstrucoes} multiline />

      <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
        <Text style={styles.textoBotao}>Salvar Medicamento</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 5 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  inputLongo: { height: 80, textAlignVertical: 'top' },
  botaoSalvar: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});