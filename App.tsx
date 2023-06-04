import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList  } from 'react-native';
import axios from 'axios';
import styled from 'styled-components/native';

interface Orca {
  id: number;
  habitat: string;
  comidaFavorita: string;
  descricao: string;
  sexo: string;
  domestico: boolean;
}

export default function App() {
  const [habitat, setHabitat] = useState('');
  const [comidaFavorita, setcomidaFavorita] = useState('');
  const [descricao, setDescricao] = useState('');
  const [sexo, setSexo] = useState('');
  const [domestico, setDomestico] = useState('');
  const [searchText, setSearchText] = useState('');
  const [orcas, setOrcas] = useState<Orca[]>([]);

  useEffect(() => {
    fetchOrcas();
  }, []);

  const fetchOrcas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/orca');
      setOrcas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post('http://localhost:3000/orca', {
        habitat,
        comidaFavorita,
        descricao,
        sexo,
        domestico: domestico === 'false',
      });
      setOrcas([...orcas, response.data]);
      clearInputs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/orca/${id}`);
      setOrcas(orcas.filter((orca) => orca.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const response = await axios.put(`http://localhost:3000/orca/${id}`, {
        habitat,
        comidaFavorita,
        descricao,
        sexo,
        domestico: domestico === 'false',
      });
      const updatedOrcas = orcas.map((orca) =>
        orca.id === id ? response.data : orca
      );
      setOrcas(updatedOrcas);
      clearInputs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/orca/search/${searchText}`
      );
      setOrcas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const clearInputs = () => {
    setHabitat('');
    setcomidaFavorita('');
    setDescricao('');
    setSexo('');
    setDomestico('');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Cadastrar Orca</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        placeholder="Habitat"
        value={habitat}
        onChangeText={setHabitat}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        placeholder="Comida favorita"
        value={comidaFavorita}
        onChangeText={setcomidaFavorita}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        placeholder="Sexo"
        value={sexo}
        onChangeText={setSexo}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        placeholder="Domestico"
        value={domestico}
        onChangeText={setDomestico}
      />
      <Button title="Cadastrar" onPress={handleCreate} />

      <Text style={{ fontSize: 24, marginTop: 20, marginBottom: 10 }}>Pesquisar Orca</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        placeholder="Pesquisar"
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="Pesquisar" onPress={handleSearch} />

      <Text style={{ fontSize: 24, marginTop: 20, marginBottom: 10 }}>Lista de Orcas</Text>
      <FlatList
        data={orcas}
        keyExtractor={(orca: any) => String(orca.id)}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>Habitat: {item.habitat}</Text>
            <Text>Comida favorita: {item.comidaFavorita}</Text>
            <Text>Descrição: {item.descricao}</Text>
            <Text>Sexo: {item.sexo}</Text>
            <Text>Domestico: {item.domestico ? 'true' : 'false'}</Text>
            <Button title="Editar" onPress={() => handleEdit(item.id)} />
            <Button title="Apagar" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
}