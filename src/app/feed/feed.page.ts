import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
  IonSearchbar, IonChip, IonRefresher, IonRefresherContent
} from '@ionic/angular'; // <-- Sem /standalone
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  paw, pawOutline, sadOutline, happyOutline, heartOutline,
  notificationsOutline, notifications, locationOutline, walkOutline
} from 'ionicons/icons';

type StatusPet = 'perdido' | 'encontrado' | 'adocao';

interface PetFeed {
  id: string;
  nome: string;
  status: StatusPet;
  especie: string;
  porte: string;
  cor: string;
  local: string;
  distancia: string;
  tempo: string;
  foto: string;
}

const ROTULOS_STATUS: Record<StatusPet, string> = {
  perdido: 'Perdido',
  encontrado: 'Encontrado',
  adocao: 'Para adoção',
};

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
    IonSearchbar, IonChip, IonRefresher, IonRefresherContent,
    FormsModule, RouterModule
  ],
})
export class FeedPage {
  // TODO: Lucas implementa a lógica nativa aqui — esta lista é apenas
  // ilustrativa para a UI; os pets reais virão do StorageService.
  pets: PetFeed[] = [
    {
      id: 'bolinha',
      nome: 'Bolinha',
      status: 'perdido',
      especie: 'Cão',
      porte: 'Médio',
      cor: 'Caramelo',
      local: 'Perto do La Salle, Centro',
      distancia: '2,5 km',
      tempo: 'há 2 h',
      foto: 'https://placedog.net/640/420?id=12',
    },
    {
      id: 'mimi',
      nome: 'Mimi',
      status: 'perdido',
      especie: 'Gata',
      porte: 'Pequena',
      cor: 'Siamesa',
      local: 'Bairro Mathias Velho',
      distancia: '4,1 km',
      tempo: 'há 5 h',
      foto: 'https://cataas.com/cat?width=640&height=420',
    },
    {
      id: 'thor',
      nome: 'Thor',
      status: 'encontrado',
      especie: 'Cão',
      porte: 'Grande',
      cor: 'Preto e branco',
      local: 'Parque Getúlio Vargas',
      distancia: '1,2 km',
      tempo: 'há 1 dia',
      foto: 'https://placedog.net/640/420?id=27',
    },
    {
      id: 'nina',
      nome: 'Nina',
      status: 'adocao',
      especie: 'Cadelinha',
      porte: 'Pequena',
      cor: 'Preta',
      local: 'Abrigo da protetora Ana, Igara',
      distancia: '3,8 km',
      tempo: 'há 2 dias',
      foto: 'https://placedog.net/640/420?id=45',
    },
    {
      id: 'pudim',
      nome: 'Pudim',
      status: 'encontrado',
      especie: 'Cão',
      porte: 'Pequeno',
      cor: 'Dourado',
      local: 'Canoas Shopping, entrada sul',
      distancia: '2,9 km',
      tempo: 'ontem',
      foto: 'https://placedog.net/640/420?id=64',
    },
    {
      id: 'foguete',
      nome: 'Foguete',
      status: 'adocao',
      especie: 'Gato',
      porte: 'Filhote',
      cor: 'Frajola',
      local: 'Bairro Rio Branco',
      distancia: '6,0 km',
      tempo: 'há 3 dias',
      foto: 'https://cataas.com/cat?width=640&height=420',
    },
  ];

  filtroAtual: StatusPet | 'todos' = 'todos';
  busca = '';
  notificacoesNaoLidas = 3;

  constructor() {
    addIcons({ paw, pawOutline, sadOutline, happyOutline, heartOutline, notificationsOutline, notifications, locationOutline, walkOutline });
  }

  get petsFiltrados(): PetFeed[] {
    const termo = this.busca.trim().toLowerCase();
    return this.pets.filter(pet => {
      const bateFiltro = this.filtroAtual === 'todos' || pet.status === this.filtroAtual;
      const bateBusca = !termo || `${pet.nome} ${pet.local} ${pet.especie}`.toLowerCase().includes(termo);
      return bateFiltro && bateBusca;
    });
  }

  rotulo(status: StatusPet): string {
    return ROTULOS_STATUS[status];
  }

  // Se a foto ilustrativa falhar, o card mostra o fundo com a patinha
  falhaFoto(pet: PetFeed): void {
    pet.foto = '';
  }

  abrirNotificacoes(): void {
    // TODO: Lucas implementa a lógica nativa aqui (Notificações Locais do Capacitor).
  }

  atualizar(event: CustomEvent): void {
    // TODO: Lucas implementa a lógica nativa aqui (recarregar pets do StorageService).
    (event.target as HTMLIonRefresherElement).complete();
  }
}
