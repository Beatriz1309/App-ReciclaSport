import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet } from 'react-native';

interface Props {
  corIcone?: string;
  corFundo?: string;
}

export function BotaoSair({
  corIcone = Colors.statusClosed,
  corFundo = 'rgba(255, 255, 255, 0.9)',
}: Props) {
  const confirmarSaida = () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair do ReciclaSpot?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => router.replace('/login'),
      },
    ]);
  };

  return (
    <Pressable
      onPress={confirmarSaida}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: corFundo },
        pressed && styles.pressed,
      ]}
      accessibilityLabel="Sair da conta">
      <Ionicons name="log-out-outline" size={20} color={corIcone} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pressed: {
    opacity: 0.75,
  },
});
