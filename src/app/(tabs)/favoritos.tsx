import { BotaoSair } from '@/components/BotaoSair';
import { EcopontoCard } from '@/components/EcopontoCard';
import { Colors } from '@/constants/colors';
import { getFavoritosOffline } from '@/services/favoritosStorage';
import { PontoColeta } from '@/types';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function FavoritosScreen() {
  const [favoritos, setFavoritos] = useState<PontoColeta[]>([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      const carregarDadosOffline = async () => {
        setCarregando(true);
        const salvos = await getFavoritosOffline();
        if (ativo) {
          setFavoritos(salvos);
          setCarregando(false);
        }
      };

      carregarDadosOffline();

      return () => {
        ativo = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Favoritos</Text>
          <Text style={styles.subtitle}>Seus pontos de coleta salvos (Offline)</Text>
        </View>
        <BotaoSair />
      </View>

      <View style={styles.body}>
        {carregando ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.emptyText}>Carregando pontos salvos...</Text>
          </View>
        ) : favoritos.length === 0 ? (
          <View style={styles.centerBox}>
            <Text style={styles.emptyText}>
              Você ainda não favoritou nenhum ecoponto.{'\n'}
              Acesse um ponto de coleta para salvar offline!
            </Text>
          </View>
        ) : (
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
        )}
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
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
