import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { BotaoSair } from '@/components/BotaoSair';
import { EcopontoCard } from '@/components/EcopontoCard';
import { Colors } from '@/constants/colors';
import { MOCK_PONTOS } from '@/services/mockPontos';

export default function FavoritosScreen() {
  const favoritos = MOCK_PONTOS.filter((p) => p.favorito);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Favoritos</Text>
          <Text style={styles.subtitle}>Seus pontos de coleta salvos</Text>
        </View>
        <BotaoSair />
      </View>

      <View style={styles.body}>
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <EcopontoCard
              item={item}
              onPress={() => router.push(`/detalhes/${item.id}`)}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.white,
    opacity: 0.9,
    marginTop: 4,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  listContent: {
    padding: 18,
  },
});
