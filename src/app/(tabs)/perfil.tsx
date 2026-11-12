import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { BotaoSair } from '@/components/BotaoSair';
import { Colors } from '@/constants/colors';
import { MOCK_USUARIO } from '@/services/mockPontos';

export default function PerfilScreen() {
  const [quilosDescartados, setQuilosDescartados] = useState(MOCK_USUARIO.pontosReciclagem);
  const [fotoDescarteUri, setFotoDescarteUri] = useState<string | null>(null);

  const abrirCamera = async () => {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert(
        'Permissão necessária',
        'Precisamos de acesso à câmera para fotografar os materiais recicláveis.'
      );
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets.length > 0) {
      setFotoDescarteUri(resultado.assets[0].uri);
    }
  };

  const registrarDescarte = () => {
    if (!fotoDescarteUri) {
      Alert.alert(
        'Foto obrigatória',
        'Toque no ícone da câmera para tirar uma foto do material antes de registrar o descarte.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Câmera', onPress: abrirCamera },
        ]
      );
      return;
    }

    setQuilosDescartados((prev) => prev + 2);
    setFotoDescarteUri(null);
    Alert.alert(
      'Descarte Registrado!',
      'Foto comprovada com sucesso. +2 KG adicionados ao seu contador!'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={{ width: 38 }} />
          <Text style={styles.headerTitle}>Perfil</Text>
          <BotaoSair />
        </View>

        <Image
          source={
            typeof MOCK_USUARIO.fotoPerfilUri === 'string'
              ? { uri: MOCK_USUARIO.fotoPerfilUri }
              : MOCK_USUARIO.fotoPerfilUri
          }
          style={styles.avatar}
        />
        <Text style={styles.userName}>{MOCK_USUARIO.nome}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{MOCK_USUARIO.tipo}</Text>
        </View>
      </View>

      <ScrollView style={styles.sheet} contentContainerStyle={styles.sheetContent}>
        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.kgValue}>{quilosDescartados} KG</Text>
            <Text style={styles.statLabel}>Contador de{'\n'}descartes{'\n'}conscientes</Text>
          </View>

          <View style={styles.statBlock}>
            <Text style={styles.materialsHeader}>Materiais que{'\n'}serão descartados</Text>
            {MOCK_USUARIO.materiaisParaDescarte.map((mat) => (
              <Text key={mat} style={styles.materialItem}>
                {mat}
              </Text>
            ))}
          </View>
        </View>

        {fotoDescarteUri ? (
          <View style={styles.previewWrapper}>
            <Image source={{ uri: fotoDescarteUri }} style={styles.previewImage} />
            <Pressable style={styles.retakeButton} onPress={abrirCamera}>
              <Ionicons name="camera-reverse-outline" size={16} color={Colors.white} />
              <Text style={styles.retakeText}>Tirar outra foto</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.cameraCircle}
            onPress={abrirCamera}
            accessibilityLabel="Abrir câmera para fotografar descarte">
            <Ionicons name="camera-outline" size={44} color={Colors.textPrimary} />
          </Pressable>
        )}

        <Pressable style={styles.registerButton} onPress={registrarDescarte}>
          <Text style={styles.registerButtonText}>Registrar Novo Descarte</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 24,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 10,
  },
  badge: {
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: 22,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sheet: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 36,
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  statBlock: {
    alignItems: 'center',
    flex: 1,
  },
  kgValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  materialsHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },
  materialItem: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  cameraCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  previewWrapper: {
    alignItems: 'center',
    marginTop: 22,
    gap: 8,
  },
  previewImage: {
    width: 140,
    height: 105,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 5,
  },
  retakeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginTop: 24,
    width: '88%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
