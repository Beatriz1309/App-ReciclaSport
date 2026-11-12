import { Colors } from '@/constants/colors';
import { PontoColeta } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  item: PontoColeta;
  onPress: () => void;
}

export function EcopontoCard({ item, onPress }: Props) {
  const renderMaterialIcons = () => {
    return (
      <View style={styles.iconsRow}>
        {item.categoria.includes('Eletrônicos') && (
          <Ionicons name="phone-portrait-outline" size={16} color="#222" />
        )}
        {item.categoria.includes('Recicláveis Gerais') && (
          <Ionicons name="bulb-outline" size={16} color="#E6B83A" />
        )}
        {item.categoria.includes('Óleo Usado') && (
          <Ionicons name="water" size={16} color="#D93025" />
        )}
        {item.categoria.includes('Pilhas/Baterias') && (
          <Ionicons name="battery-charging" size={16} color="#28A745" />
        )}
        {item.categoria.includes('Medicamentos') && (
          <Ionicons name="medkit" size={16} color="#2C62B5" />
        )}
      </View>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <Image
        source={typeof item.imagemUri === 'string' ? { uri: item.imagemUri } : item.imagemUri}
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.nome}
          </Text>
          <Text style={styles.distance}>{item.distanciaKm}</Text>
        </View>

        <Text style={styles.address} numberOfLines={1}>
          {item.endereco}
        </Text>

        <Text
          style={[
            styles.status,
            { color: item.abertoAgora ? Colors.statusOpen : Colors.statusClosed },
          ]}>
          {item.abertoAgora ? 'Aberto agora' : 'Fechado'}
        </Text>

        {renderMaterialIcons()}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.85,
  },
  image: {
    width: 78,
    height: 105,
    borderRadius: 12,
    backgroundColor: '#DDD',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
    height: 98,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  distance: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  address: {
    fontSize: 13,
    color: '#333333',
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
});
