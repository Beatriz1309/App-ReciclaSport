import { Colors } from '@/constants/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('../login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Pressable style={styles.container} onPress={() => router.replace('../login')}>
      <MaterialCommunityIcons name="recycle" size={160} color={Colors.primaryDark} />
      <Text style={styles.title}>ReciclaSpot</Text>
      <Text style={styles.subtitle}>Sua Rota para um Futuro{'\n'}Sustentável!</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.white,
    marginTop: 24,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 25,
  },
});
