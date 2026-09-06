import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { IonContent, IonButton, IonIcon } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import {
  paw, happyOutline, peopleOutline, personAddOutline, shareSocialOutline,
  homeOutline, sadOutline, heartOutline, heart, logoInstagram,
  logoWhatsapp, mailOutline, chevronForwardOutline
} from 'ionicons/icons';

import { StorageService } from '../services/storage.service';

interface Estatistica {
  valor: string;
  rotulo: string;
  icone: string;
}

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

  private storage = inject(StorageService);
  private cdr = inject(ChangeDetectorRef);

  /** Contadores reais, apurados a partir das ocorrências persistidas. */
  estatisticas: Estatistica[] = [
    { valor: '0', rotulo: 'pets cadastrados', icone: 'paw' },
    { valor: '0', rotulo: 'reencontros', icone: 'happy-outline' },
    { valor: '0', rotulo: 'aguardando adoção', icone: 'heart-outline' },
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
      texto: 'Publique o pet que sumiu e avise a rede na sua região.',
      icone: 'sad-outline',
      cor: 'danger',
    },
    {
      titulo: 'Encontrados',
      texto: 'Achou um pet pela rua? Avise a comunidade e cuide dele.',
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

  async ionViewWillEnter(): Promise<void> {
    await this.apurar();
  }

  private async apurar(): Promise<void> {
    try {
      const todas = await this.storage.listar();

      this.estatisticas = [
        {
          valor: String(todas.length),
          rotulo: 'pets cadastrados',
          icone: 'paw',
        },
        {
          valor: String(todas.filter(o => o.resolvido).length),
          rotulo: 'casos resolvidos',
          icone: 'happy-outline',
        },
        {
          valor: String(todas.filter(o => o.tipo === 'adocao' && !o.resolvido).length),
          rotulo: 'aguardando adoção',
          icone: 'heart-outline',
        },
      ];
    } catch (e) {
      console.error('[sobre] ERRO', e);
    } finally {
      this.cdr.markForCheck();
    }
  }
}