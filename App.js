import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { inicializarBanco } from './src/database/database';

import HomeScreen from './src/screens/HomeScreen';
import AddScreen from './src/screens/AddScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  
  // Inicializa o banco de dados SQLite assim que o app abre
  useEffect(() => {
    inicializarBanco();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown: false, // Oculta a barra superior padrão
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: { paddingBottom: 5, height: 60 }
      }}>
        <Tab.Screen name="Remédios" component={HomeScreen} />
        <Tab.Screen name="+ Adicionar" component={AddScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}