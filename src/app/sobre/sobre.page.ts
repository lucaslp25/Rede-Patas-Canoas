import { Component } from '@angular/core';
import { IonContent, IonButton, IonIcon } from '@ionic/angular'; // <-- Sem /standalone
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  paw, happyOutline, peopleOutline, personAddOutline, shareSocialOutline,
  homeOutline, sadOutline, heartOutline, heart, logoInstagram,
  logoWhatsapp, mailOutline, chevronForwardOutline
} from 'ionicons/icons';

interface Passo {
  titulo: string;
  texto: string;
  icone: string;
}

interface Recurso {
  titulo: string;
  texto: string;
  icone: string;
  cor: 'danger' | 'warning' | 'success';
}

interface CanalContato {
  rotulo: string;
  valor: string;
  icone: string;
  link: string;
}

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, RouterModule],
})
export class SobrePage {
  // Números ilustrativos para a UI — TODO: Lucas implementa a lógica nativa
  // aqui (contadores reais a partir do StorageService).
  estatisticas = [
    { valor: '128', rotulo: 'pets cadastrados', icone: 'paw' },
    { valor: '47', rotulo: 'reencontros', icone: 'happy-outline' },
    { valor: '63', rotulo: 'protetores ativos', icone: 'people-outline' },
  ];

  passos: Passo[] = [
    {
      titulo: 'Você cadastra',
      texto: 'Foto, local e descrição do pet em menos de 1 minuto — mesmo sem internet.',
      icone: 'person-add-outline',
    },
    {
      titulo: 'A rede espalha',
      texto: 'Protetores e moradores próximos são avisados e ajudam a compartilhar.',
      icone: 'share-social-outline',
    },
    {
      titulo: 'Reencontro!',
      texto: 'Alguém reconhece o pet e a família é avisada pelo contato do registro.',
      icone: 'home-outline',
    },
  ];

  recursos: Recurso[] = [
    {
      titulo: 'Perdidos',
      texto: 'Publique o pet que sumiu e aviste a rede na sua região.',
      icone: 'sad-outline',
      cor: 'danger',
    },
    {
      titulo: 'Encontrados',
      texto: 'Achou um pet pela rua? Aviste a comunidade e cuide dele.',
      icone: 'happy-outline',
      cor: 'warning',
    },
    {
      titulo: 'Adoção',
      texto: 'Conecte resgates a famílias que querem adotar com responsabilidade.',
      icone: 'heart-outline',
      cor: 'success',
    },
  ];

  contatos: CanalContato[] = [
    {
      rotulo: 'Instagram',
      valor: '@rededepatas.canoas',
      icone: 'logo-instagram',
      link: 'https://instagram.com/rededepatas.canoas',
    },
    {
      rotulo: 'WhatsApp',
      valor: '(51) 99999-9999',
      icone: 'logo-whatsapp',
      link: 'https://wa.me/5551999999999',
    },
    {
      rotulo: 'E-mail',
      valor: 'contato@rededepatascanoas.org',
      icone: 'mail-outline',
      link: 'mailto:contato@rededepatascanoas.org',
    },
  ];

  constructor() {
    addIcons({
      paw, happyOutline, peopleOutline, personAddOutline, shareSocialOutline,
      homeOutline, sadOutline, heartOutline, heart, logoInstagram,
      logoWhatsapp, mailOutline, chevronForwardOutline
    });
  }
}
