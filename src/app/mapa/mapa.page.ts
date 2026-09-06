import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonSearchbar, IonChip } from '@ionic/angular'; // <-- Sem /standalone
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import { paw, pawOutline, sadOutline, happyOutline, heartOutline, locateOutline, walkOutline } from 'ionicons/icons';

type StatusPet = 'perdido' | 'encontrado' | 'adocao';

interface PetMapa {
  id: string;
  nome: string;
  status: StatusPet;
  local: string;
  distancia: string;
  foto: string;
}

const ROTULOS_STATUS: Record<StatusPet, string> = {
  perdido: 'Perdido',
  encontrado: 'Encontrado',
  adocao: 'Para adoção',
};

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonSearchbar, IonChip, FormsModule, RouterModule],
})
export class MapaPage {
  // TODO: Lucas implementa a lógica nativa aqui — lista ilustrativa;
  // os pins/itens reais virão do StorageService e a distância será
  // calculada com Haversine a partir da posição do usuário.
  pets: PetMapa[] = [
    {
      id: 'thor',
      nome: 'Thor',
      status: 'encontrado',
      local: 'Parque Getúlio Vargas',
      distancia: '1,2 km',
      foto: 'https://placedog.net/240/240?id=27',
    },
    {
      id: 'bolinha',
      nome: 'Bolinha',
      status: 'perdido',
      local: 'Perto do La Salle, Centro',
      distancia: '2,5 km',
      foto: 'https://placedog.net/240/240?id=12',
    },
    {
      id: 'pudim',
      nome: 'Pudim',
      status: 'encontrado',
      local: 'Canoas Shopping',
      distancia: '2,9 km',
      foto: 'https://placedog.net/240/240?id=64',
    },
    {
      id: 'nina',
      nome: 'Nina',
      status: 'adocao',
      local: 'Abrigo da Ana, Igara',
      distancia: '3,8 km',
      foto: 'https://placedog.net/240/240?id=45',
    },
    {
      id: 'mimi',
      nome: 'Mimi',
      status: 'perdido',
      local: 'Bairro Mathias Velho',
      distancia: '4,1 km',
      foto: 'https://cataas.com/cat?width=240&height=240',
    },
    {
      id: 'foguete',
      nome: 'Foguete',
      status: 'adocao',
      local: 'Bairro Rio Branco',
      distancia: '6,0 km',
      foto: 'https://cataas.com/cat?width=240&height=240',
    },
  ];

  filtroAtual: StatusPet | 'todos' = 'todos';
  busca = '';

  constructor() {
    addIcons({ paw, pawOutline, sadOutline, happyOutline, heartOutline, locateOutline, walkOutline });
  }

  get petsFiltrados(): PetMapa[] {
    const termo = this.busca.trim().toLowerCase();
    return this.pets.filter(pet => {
      const bateFiltro = this.filtroAtual === 'todos' || pet.status === this.filtroAtual;
      const bateBusca = !termo || `${pet.nome} ${pet.local}`.toLowerCase().includes(termo);
      return bateFiltro && bateBusca;
    });
  }

  rotulo(status: StatusPet): string {
    return ROTULOS_STATUS[status];
  }

  falhaFoto(pet: PetMapa): void {
    pet.foto = '';
  }

  centralizar(): void {
    // TODO: Lucas implementa a lógica nativa aqui (Geolocalização do Capacitor).
  }
}
