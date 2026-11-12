import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function LoginScreen() {
  const [perfilTipo, setPerfilTipo] = useState<'Cidadão' | 'Voluntário'>('Cidadão');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleEntrar = () => {
    router.replace('../(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <Text style={styles.headerTitle}>Login</Text>

        {/* Seletor Cidadão / Voluntário */}
        <View style={styles.roleContainer}>
          <Pressable
            onPress={() => setPerfilTipo('Cidadão')}
            style={[
              styles.roleButton,
              perfilTipo === 'Cidadão' ? styles.roleActive : styles.roleInactive,
            ]}>
            <Text
              style={[
                styles.roleText,
                perfilTipo === 'Cidadão' ? styles.roleTextActive : styles.roleTextInactive,
              ]}>
              Cidadão
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setPerfilTipo('Voluntário')}
            style={[
              styles.roleButton,
              perfilTipo === 'Voluntário' ? styles.roleActive : styles.roleInactive,
            ]}>
            <Text
              style={[
                styles.roleText,
                perfilTipo === 'Voluntário' ? styles.roleTextActive : styles.roleTextInactive,
              ]}>
              Voluntário
            </Text>
          </Pressable>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder=""
          />

          <Text style={[styles.label, { marginTop: 18 }]}>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholder=""
          />

          <Pressable style={styles.forgotWrapper}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </Pressable>
        </View>

        {/* Ações */}
        <View style={styles.actions}>
          <Pressable style={styles.loginButton} onPress={handleEntrar}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </Pressable>

          <Pressable onPress={handleEntrar}>
            <Text style={styles.registerText}>Cadastra-se</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 42,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 36,
  },
  roleButton: {
    paddingVertical: 11,
    paddingHorizontal: 28,
    borderRadius: 22,
    minWidth: 130,
    alignItems: 'center',
  },
  roleActive: {
    backgroundColor: Colors.primary,
  },
  roleInactive: {
    backgroundColor: Colors.inputBackground,
  },
  roleText: {
    fontSize: 15,
    fontWeight: '700',
  },
  roleTextActive: {
    color: Colors.white,
  },
  roleTextInactive: {
    color: '#222222',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    height: 46,
    borderRadius: 23,
    paddingHorizontal: 18,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  actions: {
    alignItems: 'center',
    marginTop: 34,
    gap: 14,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 25,
    width: '82%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  registerText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
