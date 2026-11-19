import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_PONTOS } from '@/services/mockPontos';
import { PontoColeta } from '@/types';

const FAVORITOS_KEY = '@reciclaspot:favoritos';

// Reidrata a imagem original do mock para evitar erro de URL inválida após JSON.parse
function restaurarImagemLocal(pontoSalvo: PontoColeta): PontoColeta {
  const original = MOCK_PONTOS.find((m) => m.id === pontoSalvo.id);
  return {
    ...pontoSalvo,
    imagemUri: original ? original.imagemUri : pontoSalvo.imagemUri,
  };
}

export async function getFavoritosOffline(): Promise<PontoColeta[]> {
  try {
    const json = await AsyncStorage.getItem(FAVORITOS_KEY);
    if (json !== null) {
      const lista = JSON.parse(json) as PontoColeta[];
      return lista.map(restaurarImagemLocal);
    }

    const iniciais = MOCK_PONTOS.filter((p) => p.favorito).map((p) => ({
      ...p,
      favorito: true,
    }));
    await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(iniciais));
    return iniciais;
  } catch (error) {
    console.error('Erro ao carregar favoritos offline:', error);
    return [];
  }
}

export async function isPontoFavorito(id: string): Promise<boolean> {
  const lista = await getFavoritosOffline();
  return lista.some((item) => item.id === id);
}

export async function toggleFavoritoOffline(ponto: PontoColeta): Promise<boolean> {
  try {
    const atuais = await getFavoritosOffline();
    const existe = atuais.some((item) => item.id === ponto.id);

    const atualizados = existe
      ? atuais.filter((item) => item.id !== ponto.id)
      : [...atuais, { ...ponto, favorito: true }];

    await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(atualizados));
    return !existe;
  } catch (error) {
    console.error('Erro ao salvar favorito offline:', error);
    return false;
  }
}
