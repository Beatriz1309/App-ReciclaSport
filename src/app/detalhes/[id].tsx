import { BotaoSair } from '@/components/BotaoSair';
import { Colors } from '@/constants/colors';
import {
  getFavoritosOffline,
  isPontoFavorito,
  toggleFavoritoOffline,
} from '@/services/favoritosStorage';
import { MOCK_PONTOS } from '@/services/mockPontos';
import { PontoColeta } from '@/types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/@-21.8040374,-50.8755968,15z?entry=ttu&g_ep=EgoyMDI2MTExNi4wIKXMDSoASAFQAw%3D%3D';

export default function DetalhesEcopontoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pontoInicial = MOCK_PONTOS.find((item) => item.id === id) || MOCK_PONTOS.at(0)!;

  const [ponto, setPonto] = useState<PontoColeta>(pontoInicial);
  const [favoritado, setFavoritado] = useState(false);
  const [salvandoFavorito, setSalvandoFavorito] = useState(false);

  useEffect(() => {
    const sincronizarOffline = async () => {
      const salvosOffline = await getFavoritosOffline();
      const pontoOffline = salvosOffline.find((item) => item.id === id);
      const pontoMock = MOCK_PONTOS.find((item) => item.id === id);

      if (pontoOffline) {
        setPonto({
          ...pontoOffline,
          imagemUri: pontoMock ? pontoMock.imagemUri : pontoOffline.imagemUri,
        });
      } else if (pontoMock) {
        setPonto(pontoMock);
      }

      const targetId = pontoOffline?.id ?? id ?? ponto.id;
      const jaFavoritado = await isPontoFavorito(targetId);
      setFavoritado(jaFavoritado);
    };

    sincronizarOffline();
  }, [id, ponto.id]);

  const handleToggleFavorito = async () => {
    if (salvandoFavorito) return;

    setSalvandoFavorito(true);
    const novoEstado = await toggleFavoritoOffline(ponto);
    setFavoritado(novoEstado);
    setSalvandoFavorito(false);

    Alert.alert(
      novoEstado ? 'Adicionado aos Favoritos' : 'Removido dos Favoritos',
      novoEstado
        ? 'Ecoponto salvo localmente! Você pode acessá-lo mesmo sem internet.'
        : 'Ecoponto removido da sua lista offline.'
    );
  };

  const abrirRotas = async () => {
    try {
      if (Platform.OS === 'web') {
        window.open(GOOGLE_MAPS_URL, '_blank');
      } else {
        await Linking.openURL(GOOGLE_MAPS_URL);
      }
    } catch {
      Alert.alert(
        'Erro ao abrir o Google Maps',
        `Não foi possível abrir o navegador ou aplicativo do Maps.\n\nEndereço: ${ponto.endereco}`
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper}>
        <Image
          source={ponto.imagemUri}
          style={styles.coverImage}
          contentFit="cover"
        />

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </Pressable>

        <View style={styles.logoutWrapper}>
          <BotaoSair />
        </View>
      </View>

      <ScrollView style={styles.sheet} contentContainerStyle={styles.sheetContent}>
        <Text style={styles.title}>{ponto.nome}</Text>

        <Pressable
          style={[
            styles.favoriteButton,
            favoritado ? styles.favoriteButtonActive : styles.favoriteButtonInactive,
          ]}
          onPress={handleToggleFavorito}>
          {salvandoFavorito ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons
                name={favoritado ? 'heart' : 'heart-outline'}
                size={20}
                color={favoritado ? Colors.white : Colors.primary}
              />
              <Text
                style={[
                  styles.favoriteButtonText,
                  favoritado ? styles.favoriteTextActive : styles.favoriteTextInactive,
                ]}>
                {favoritado ? 'Remover dos Favoritos' : 'Favoritar Ponto'}
              </Text>
            </>
          )}
        </Pressable>

        <Text style={styles.sectionLabel}>Endereço</Text>
        <Text style={styles.sectionValue}>{ponto.endereco}</Text>

        <Text style={styles.sectionLabel}>Horário de funcionamento</Text>
        <Text style={styles.sectionValue}>{ponto.horarioFuncionamento}</Text>

        <Text style={styles.sectionLabel}>Materiais Aceitos</Text>

        <View style={styles.materialsGrid}>
          <View style={styles.materialCard}>
            <Ionicons name="laptop-outline" size={32} color="#2C62B5" />
            <Text style={styles.materialText}>Eletrônicos</Text>
          </View>

          <View style={styles.materialCard}>
            <Ionicons name="battery-charging" size={32} color="#D93025" />
            <Text style={styles.materialText}>Pilhas e baterias</Text>
          </View>

          <View style={styles.materialCard}>
            <MaterialCommunityIcons name="bottle-tonic-outline" size={32} color="#E6B83A" />
            <Text style={styles.materialText}>Óleo de cozinha</Text>
          </View>

          <View style={styles.materialCard}>
            <MaterialCommunityIcons name="gold" size={32} color="#7F8C8D" />
            <Text style={styles.materialText}>Metais</Text>
          </View>

          <View style={styles.materialCard}>
            <MaterialCommunityIcons name="bottle-soda-outline" size={32} color="#38BDF8" />
            <Text style={styles.materialText}>Plásticos</Text>
          </View>
        </View>

        <Pressable style={styles.routeButton} onPress={abrirRotas}>
          <Text style={styles.routeButtonText}>Como chegar (rotas)</Text>
          <Ionicons name="arrow-forward" size={22} color={Colors.white} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  imageWrapper: {
    height: 245,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutWrapper: {
    position: 'absolute',
    top: 48,
    right: 16,
  },
  sheet: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    marginTop: -22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 14,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  favoriteButtonInactive: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  },
  favoriteButtonActive: {
    backgroundColor: '#D93025',
    borderColor: '#D93025',
  },
  favoriteButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  favoriteTextInactive: {
    color: Colors.primary,
  },
  favoriteTextActive: {
    color: Colors.white,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 12,
  },
  sectionValue: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  materialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  materialCard: {
    width: '30%',
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  materialText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  routeButton: {
    marginTop: 28,
    backgroundColor: Colors.primary,
    borderRadius: 26,
    paddingVertical: 15,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  routeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
