import { Component, Input, OnInit } from '@angular/core';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton,
  IonButton, IonIcon, IonFooter
} from '@ionic/angular'; // <-- Sem /standalone
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  timeOutline, shareSocialOutline, locationOutline, navigateOutline,
  chevronForwardOutline, callOutline, chatbubbleEllipsesOutline,
  documentTextOutline, checkmarkCircleOutline, calendarClearOutline,
  colorPaletteOutline, resizeOutline, paw
} from 'ionicons/icons';

type StatusPet = 'perdido' | 'encontrado' | 'adocao';

interface PetDetalhe {
  nome: string;
  status: StatusPet;
  especie: string;
  porte: string;
  cor: string;
  idade: string;
  descricao: string;
  local: string;
  referencia: string;
  contatoNome: string;
  contatoPapel: string;
  contatoFone: string;
  foneE164: string;
  tempo: string;
  foto: string;
}

// TODO: Lucas implementa a lógica nativa aqui — registros ilustrativos;
// os dados reais virão do StorageService (busca por id).
const PETS_EXEMPLO: Record<string, PetDetalhe> = {
  bolinha: {
    nome: 'Bolinha',
    status: 'perdido',
    especie: 'Cão',
    porte: 'Médio',
    cor: 'Caramelo',
    idade: 'Adulto (cerca de 4 anos)',
    descricao:
      'O Bolinha desapareceu no fim da tarde perto do La Salle. Ele é muito dócil, ' +
      'se dá bem com outros cachorros e estava usando uma coleira azul quando sumiu. ' +
      'Responde pelo nome e adora biscoito — se você avistar, chame ele com carinho!',
    local: 'Visto perto do La Salle',
    referencia: 'Rua dos Andradas, próximo à portaria principal',
    contatoNome: 'Protetora Ana',
    contatoPapel: 'Protetora voluntária · Rede Patas',
    contatoFone: '(51) 99999-9990',
    foneE164: '+5551999999990',
    tempo: 'há 2 h',
    foto: 'https://placedog.net/720/560?id=12',
  },
  thor: {
    nome: 'Thor',
    status: 'encontrado',
    especie: 'Cão',
    porte: 'Grande',
    cor: 'Preto e branco',
    idade: 'Adulto (cerca de 5 anos)',
    descricao:
      'Encontrei o Thor vagando no Parque Getúlio Vargas na manhã de hoje. ' +
      'Está saudável, muito manso e aparenta ter família: conhece comandos básicos ' +
      'como "senta" e "deita". Vamos achar o tutor dele!',
    local: 'Encontrado no Parque Getúlio Vargas',
    referencia: 'Perto da quadra de areia',
    contatoNome: 'Protetor Júlio',
    contatoPapel: 'Morador · Bairro Centro',
    contatoFone: '(51) 99999-9991',
    foneE164: '+5551999999991',
    tempo: 'há 1 dia',
    foto: 'https://placedog.net/720/560?id=27',
  },
  nina: {
    nome: 'Nina',
    status: 'adocao',
    especie: 'Cadelinha',
    porte: 'Pequena',
    cor: 'Preta',
    idade: 'Filhote (cerca de 4 meses)',
    descricao:
      'A Nina foi resgatada ainda bebê e já está vermifugada e com a primeira dose de vacina. ' +
    'É super brincalhona, convive bem com gatos e precisa de uma família que tenha paciência com filhotes.',
    local: 'Abrigo da protetora Ana, Igara',
    referencia: 'Retirada com visita prévia ao abrigo',
    contatoNome: 'Protetora Ana',
    contatoPapel: 'Protetora voluntária · Rede Patas',
    contatoFone: '(51) 99999-9990',
    foneE164: '+5551999999990',
    tempo: 'há 2 dias',
    foto: 'https://placedog.net/720/560?id=45',
  },
};

const ROTULOS_STATUS: Record<StatusPet, string> = {
  perdido: 'Perdido',
  encontrado: 'Encontrado',
  adocao: 'Para adoção',
};

@Component({
  selector: 'app-detalhe',
  templateUrl: './detalhe.page.html',
  styleUrls: ['./detalhe.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton,
    IonButton, IonIcon, IonFooter, RouterModule
  ],
})
export class DetalhePage implements OnInit {
  // Chega via query param (?id=...) — comComponentInputBinding já está ativo no main.ts
  @Input() id = 'bolinha';

  pet: PetDetalhe = PETS_EXEMPLO['bolinha'];

  constructor() {
    addIcons({
      timeOutline, shareSocialOutline, locationOutline, navigateOutline,
      chevronForwardOutline, callOutline, chatbubbleEllipsesOutline,
      documentTextOutline, checkmarkCircleOutline, calendarClearOutline,
      colorPaletteOutline, resizeOutline, paw
    });
  }

  ngOnInit(): void {
    this.pet = PETS_EXEMPLO[this.id] ?? PETS_EXEMPLO['bolinha'];
  }

  rotulo(status: StatusPet): string {
    return ROTULOS_STATUS[status];
  }

  get zapLink(): string {
    return 'https://wa.me/' + this.pet.foneE164.replace(/\D/g, '');
  }

  iniciais(nome: string): string {
    return nome.split(' ').map(parte => parte[0]).slice(0, 2).join('').toUpperCase();
  }

  falhaFoto(): void {
    this.pet.foto = '';
  }

  compartilhar(): void {
    // TODO: Lucas implementa a lógica nativa aqui (compartilhar do Capacitor).
  }

  gerarCartaz(): void {
    // TODO: Lucas implementa a lógica nativa aqui (geração de PDF / cartaz).
  }

  marcarResolvido(): void {
    // TODO: Lucas implementa a lógica nativa aqui (atualizar status no StorageService).
  }
}
