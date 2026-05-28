import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, 
  Keyboard, TouchableWithoutFeedback, ScrollView 
} from 'react-native';
import { adicionarMedicamento } from '../database/database';

export default function AddScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [dosagem, setDosagem] = useState('');
  const [horario, setHorario] = useState('');
  const [diasTratamento, setDiasTratamento] = useState('');
  const [tipoIngestao, setTipoIngestao] = useState(''); // Ex: Jejum, Com alimentos
  const [instrucoes, setInstrucoes] = useState('');

  const handleSalvar = async () => {
    // REQUISITO Adicionado: Validação estrita de campos vazios
    if (!nome.trim() || !dosagem.trim() || !horario.trim()) {
      Alert.alert("Campos Obrigatórios", "Por favor, preencha o Nome, Dosagem e Horário do medicamento.");
      return;
    }

    await adicionarMedicamento(nome, dosagem, horario, instrucoes, diasTratamento, tipoIngestao);
    
    Alert.alert("Sucesso", "Medicamento cadastrado!", [
      { text: "OK", onPress: () => {
          setNome(''); setDosagem(''); setHorario('');
          setDiasTratamento(''); setTipoIngestao(''); setInstrucoes('');
          Keyboard.dismiss();
          navigation.navigate('Remédios');
        } 
      }
    ]);
  };

  return (
    // Adicionado TouchableWithoutFeedback para Fechar o teclado ao clicar fora dos inputs
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Novo Medicamento</Text>

        <Text style={styles.label}>Nome do Remédio *</Text>
        <TextInput style={styles.input} placeholder="Ex: Paracetamol" value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Dosagem *</Text>
        <TextInput style={styles.input} placeholder="Ex: 1 comprimido, 500mg" value={dosagem} onChangeText={setDosagem} />

        <Text style={styles.label}>Horário *</Text>
        <TextInput style={styles.input} placeholder="Ex: 08:00" value={horario} onChangeText={setHorario} />

        {/* REQUISITO 4: Novos campos adicionados */}
        <Text style={styles.label}>Duração do Tratamento (Opcional)</Text>
        <TextInput style={styles.input} placeholder="Ex: 7 dias, Uso contínuo" value={diasTratamento} onChangeText={setDiasTratamento} />

        <Text style={styles.label}>Como tomar? (Opcional)</Text>
        <TextInput style={styles.input} placeholder="Ex: Em jejum, Após o almoço" value={tipoIngestao} onChangeText={setTipoIngestao} />

        <Text style={styles.label}>Instruções Adicionais (Opcional)</Text>
        <TextInput style={[styles.input, styles.inputLongo]} placeholder="Ex: Não partir o comprimido" value={instrucoes} onChangeText={setInstrucoes} multiline />

        <TouchableOpacity style={styles.botaoSalvar} onPress={handleSalvar}>
          <Text style={styles.textoBotao}>Salvar Medicamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60, backgroundColor: '#f5f5f5' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: '#444', marginBottom: 5 },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  inputLongo: { height: 70, textAlignVertical: 'top' },
  botaoSalvar: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});