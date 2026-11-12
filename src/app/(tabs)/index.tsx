import { BotaoSair } from '@/components/BotaoSair';
import { EcopontoCard } from '@/components/EcopontoCard';
import { Colors } from '@/constants/colors';
import { MOCK_PONTOS } from '@/services/mockPontos';
import { CategoriaResiduo } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';


const FILTROS_RAPIDOS: {
  label: string;
  categoria: CategoriaResiduo;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: 'Pilha', categoria: 'Pilhas/Baterias', color: Colors.badgePilha, icon: 'battery-charging' },
  { label: 'Óleo', categoria: 'Óleo Usado', color: Colors.badgeOleo, icon: 'water' },
  { label: 'E-waste', categoria: 'Eletrônicos', color: Colors.badgeEwaste, icon: 'phone-portrait' },
  { label: 'Lâmpada', categoria: 'Recicláveis Gerais', color: Colors.badgeLampada, icon: 'bulb' },
];

export default function HomeScreen() {
  const [busca, setBusca] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaResiduo | null>(null);
  const [modoOffice, setModoOffice] = useState(false);

  const pontosFiltrados = useMemo(() => {
    return MOCK_PONTOS.filter((ponto) => {
      const matchTexto =
        ponto.nome.toLowerCase().includes(busca.toLowerCase()) ||
        ponto.endereco.toLowerCase().includes(busca.toLowerCase());

      const matchCategoria = categoriaSelecionada
        ? ponto.categoria.includes(categoriaSelecionada)
        : true;

      return matchTexto && matchCategoria;
    });
  }, [busca, categoriaSelecionada]);

  const toggleFiltro = (cat: CategoriaResiduo) => {
    setCategoriaSelecionada((prev) => (prev === cat ? null : cat));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {modoOffice ? (
        <View style={styles.officeBanner}>
          <View style={{ width: 38 }} />
          <Pressable style={styles.officeTextContainer} onPress={() => setModoOffice(false)}>
            <Text style={styles.officeTitle}>Modo Office Ativo</Text>
            <Text style={styles.officeSub}>Toque para voltar ao modo padrão</Text>
          </Pressable>
          <BotaoSair />
        </View>
      ) : (
        <View style={styles.header}>
          <View style={styles.topRow}>
            <Text style={styles.brand}>ReciclaSpot</Text>

            <View style={styles.headerIcons}>
              <Pressable
                style={styles.circleIcon}
                onPress={() => setModoOffice(true)}
                accessibilityLabel="Ativar Modo Office">
                <Ionicons name="briefcase" size={20} color="#2C62B5" />
              </Pressable>
              <Pressable
                style={styles.circleIcon}
                onPress={() => router.push('/(tabs)/perfil')}>
                <Ionicons name="notifications" size={20} color="#E6B83A" />
              </Pressable>
              <BotaoSair />
            </View>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar ecopontos ou materiais..."
              placeholderTextColor="#888"
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          <View style={styles.filtersRow}>
            {FILTROS_RAPIDOS.map((filtro) => {
              const ativo = categoriaSelecionada === filtro.categoria;
              return (
                <Pressable
                  key={filtro.label}
                  onPress={() => toggleFiltro(filtro.categoria)}
                  style={[
                    styles.filterCard,
                    { backgroundColor: filtro.color },
                    ativo && styles.filterCardActive,
                  ]}>
                  <Ionicons name={filtro.icon} size={24} color={Colors.white} />
                  <Text style={styles.filterLabel}>{filtro.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.listWrapper}>
        <FlatList
          data={pontosFiltrados}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
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
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 22,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  circleIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 22,
    paddingHorizontal: 14,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 10,
  },
  filterCard: {
    flex: 1,
    height: 68,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  filterCardActive: {
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
  filterLabel: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  officeBanner: {
    backgroundColor: Colors.navyOffice,
    paddingVertical: 22,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  officeTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  officeTitle: {
    color: Colors.white,
    fontSize: 19,
    fontWeight: '700',
  },
  officeSub: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 4,
  },
  listWrapper: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  listContent: {
    padding: 18,
    paddingBottom: 28,
  },
});
