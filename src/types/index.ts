export type CategoriaResiduo =
  | 'Eletrônicos'
  | 'Óleo Usado'
  | 'Pilhas/Baterias'
  | 'Recicláveis Gerais'
  | 'Medicamentos';

export type ImagemFonte = number | { uri: string } | string;

export interface PontoColeta {
  id: string;
  nome: string;
  categoria: CategoriaResiduo[];
  endereco: string;
  bairro: string;
  distanciaKm: string;
  abertoAgora: boolean;
  horarioFuncionamento: string;
  latitude: number;
  longitude: number;
  imagemUri: ImagemFonte;
  telefoneContato: string;
  aceitaEntulho: boolean;
  favorito?: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'Cidadão' | 'Voluntário';
  pontosReciclagem: number;
  fotoPerfilUri: ImagemFonte;
  materiaisParaDescarte: string[];
}
