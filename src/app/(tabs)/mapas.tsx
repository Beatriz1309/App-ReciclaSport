import { BotaoSair } from '@/components/BotaoSair';
import { Colors } from '@/constants/colors';
import { getFavoritosOffline } from '@/services/favoritosStorage';
import { MOCK_PONTOS } from '@/services/mockPontos';
import { PontoColeta } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const PINS_MAPA = [
  { id: '5', top: '28%', left: '25%', color: Colors.primary },
  { id: '1', top: '18%', left: '52%', color: Colors.badgePilha },
  { id: '4', top: '34%', left: '66%', color: Colors.primary },
  { id: '2', top: '26%', left: '78%', color: Colors.badgeOleo },
  { id: '3', top: '42%', left: '38%', color: Colors.badgePilha },
  { id: '6', top: '56%', left: '51%', color: Colors.primary },
];

export default function MapasScreen() {
  const [pontosDisponiveis, setPontosDisponiveis] = useState<PontoColeta[]>(MOCK_PONTOS);
  const [pontoAtivo, setPontoAtivo] = useState<PontoColeta | null>(
    () => MOCK_PONTOS.at(4) ?? MOCK_PONTOS.at(0) ?? null
  );

  // Sincroniza com o armazenamento local (Modo Offline) sempre que a aba Mapas é aberta
  useFocusEffect(
    useCallback(() => {
      let ativo = true;

      const carregarPontosOffline = async () => {
        const salvosOffline = await getFavoritosOffline();
        if (!ativo) return;

        // Mescla os pontos em cache offline com os dados locais
        const mapaPorId = new Map<string, PontoColeta>();
        MOCK_PONTOS.forEach((p) => mapaPorId.set(p.id, p));
        salvosOffline.forEach((p) => mapaPorId.set(p.id, p));

        const listaAtualizada = Array.from(mapaPorId.values());
        setPontosDisponiveis(listaAtualizada);

        setPontoAtivo((atual) => {
          if (atual) {
            return listaAtualizada.find((p) => p.id === atual.id) ?? atual;
          }
          return listaAtualizada.at(0) ?? null;
        });
      };

      carregarPontosOffline();

      return () => {
        ativo = false;
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapCanvas}>
        <View style={[styles.road, { top: '30%', transform: [{ rotate: '-18deg' }] }]} />
        <View style={[styles.road, { top: '55%', transform: [{ rotate: '12deg' }] }]} />
        <View style={[styles.roadVertical, { left: '48%', transform: [{ rotate: '8deg' }] }]} />

        <Text style={styles.cityLabel}>São Paulo</Text>

        <View style={styles.userLocationOuter}>
          <View style={styles.userLocationInner} />
        </View>

        {PINS_MAPA.map((pin) => (
          <Pressable
            key={pin.id}
            style={[styles.pinWrapper, { top: pin.top as any, left: pin.left as any }]}
            onPress={() => {
              const encontrado = pontosDisponiveis.find((p) => p.id === pin.id);
              if (encontrado) setPontoAtivo(encontrado);
            }}>
            <Ionicons name="location" size={38} color={pin.color} />
          </Pressable>
        ))}

        {/* Botões Flutuantes Superiores */}
        <View style={styles.topControls}>
          <Pressable style={styles.roundBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
          </Pressable>

          <View style={styles.rightControls}>
            <Pressable style={styles.roundBtn} onPress={() => router.push('/(tabs)')}>
              <Ionicons name="reorder-two" size={24} color={Colors.textPrimary} />
            </Pressable>
            <BotaoSair corFundo={Colors.white} />
          </View>
        </View>

        {/* Card Flutuante Inferior */}
        {pontoAtivo && (
          <View style={styles.bottomCard}>
            <Text style={styles.cardTitle}>{pontoAtivo.nome}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="location" size={14} color={Colors.statusClosed} />
                <Text style={styles.metaText}>{pontoAtivo.distanciaKm}</Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                <Text style={styles.metaText}>{pontoAtivo.horarioFuncionamento}</Text>
              </View>
            </View>

            <View style={styles.footerRow}>
              <View style={styles.iconsRow}>
                <Ionicons name="phone-portrait-outline" size={16} color="#222" />
                <Ionicons name="bulb-outline" size={16} color="#E6B83A" />
                <Ionicons name="water" size={16} color="#D93025" />
                <Ionicons name="battery-charging" size={16} color="#28A745" />
              </View>

              <Pressable
                style={styles.detailButton}
                onPress={() => router.push(`/detalhes/${pontoAtivo.id}`)}>
                <Text style={styles.detailButtonText}>Ver Detalhes</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#EDF2F7',
    position: 'relative',
    overflow: 'hidden',
  },
  road: {
    position: 'absolute',
    width: '140%',
    height: 14,
    backgroundColor: Colors.white,
    left: '-20%',
  },
  roadVertical: {
    position: 'absolute',
    width: 14,
    height: '120%',
    backgroundColor: Colors.white,
    top: '-10%',
  },
  cityLabel: {
    position: 'absolute',
    top: '43%',
    left: '46%',
    fontSize: 22,
    fontWeight: '800',
    color: '#374151',
  },
  userLocationOuter: {
    position: 'absolute',
    top: '51%',
    left: '60%',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
  pinWrapper: {
    position: 'absolute',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  iconsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  detailButton: {
    backgroundColor: '#333333',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  detailButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
