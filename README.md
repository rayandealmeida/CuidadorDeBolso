## 🎓 Informações Acadêmicas

* **Instituição:** Centro Universitário Estácio de Sá (Estácio)
* **Curso:** ADS
* **Disciplina:** PROGRAMAÇÃO PARA DISPOSITIVOS MÓVEIS EM ANDROID
* **Professor Orientador:** Julio Cartier
* **Acadêmico:** Rayan

# Projeto Cuidador de Bolso 📱

O **Cuidador de Bolso** é um aplicativo mobile desenvolvido em React Native e Expo, projetado para auxiliar no gerenciamento e controle diário de medicamentos. O foco principal do projeto é oferecer uma solução com funcionamento 100% offline, garantindo a privacidade dos dados médicos do usuário por meio de persistência local.

---

## 🚀 Funcionalidades (Operações CRUD)

O aplicativo cumpre integralmente todos os requisitos de persistência de dados utilizando o padrão CRUD:

* **Create (Cadastrar):** Permite adicionar novos medicamentos informando Nome, Dosagem, Horário de ingestão, Duração do tratamento, Como tomar (ex: em jejum) e Instruções adicionais.
* **Read (Listar):** Exibição dinâmica de todos os medicamentos cadastrados em uma lista organizada cronologicamente por horário na tela inicial.
* **Update (Atualizar):** * **Status:** Marcação rápida de medicamentos como "Tomado" (mudando visualmente o card para verde).
    * **Registro:** Janela interativa (Modal) para edição completa de todas as informações de um remédio já cadastrado.
* **Delete (Excluir):** Remoção definitiva de registros do banco de dados com alerta de confirmação de segurança.

---

## 🛠️ Tecnologias Utilizadas

* **Framework Base:** React Native com Expo (SDK 54)
* **Linguagem:** JavaScript
* **Navegação:** React Navigation (Tab Navigation para alternância entre abas)
* **Persistência de Dados:** Expo SQLite (Banco de dados relacional local)
* **Interface (UI/UX):** Layout responsivo, moderno e minimalista focado na usabilidade, incluindo tratamento de teclado nativo para dispositivos iOS.

---

## 📱 Como Executar o Projeto

Para rodar o projeto localmente em modo de desenvolvimento, siga os passos abaixo:

### Pré-requisitos
* Node.js instalado na máquina.
* Aplicativo **Expo Go** instalado no seu dispositivo móvel (Android ou iOS).

### Passo a Passo

1. Clone o repositório para sua máquina:
   ```bash
   git clone [https://github.com/SEU_USUARIO_DO_GITHUB/CuidadorDeBolso.git](https://github.com/SEU_USUARIO_DO_GITHUB/CuidadorDeBolso.git)