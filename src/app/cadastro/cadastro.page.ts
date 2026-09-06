import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonContent, IonItem, IonInput, IonSelect, IonSelectOption,
  IonTextarea, IonButton, IonIcon
} from '@ionic/angular'; // <-- Sem /standalone

import { addIcons } from 'ionicons';
import {
  cameraOutline, navigateOutline, paw, cloudOfflineOutline,
  sadOutline, happyOutline, heartOutline, callOutline
} from 'ionicons/icons';

interface TipoRegistro {
  valor: 'perdido' | 'encontrado' | 'adocao';
  rotulo: string;
  dica: string;
  icone: string;
}

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent, IonItem, IonInput, IonSelect, IonSelectOption,
    IonTextarea, IonButton, IonIcon, FormsModule
  ],
})
export class CadastroPage {
  tipos: TipoRegistro[] = [
    { valor: 'perdido', rotulo: 'Perdido', dica: 'O meu pet sumiu', icone: 'sad-outline' },
    { valor: 'encontrado', rotulo: 'Encontrado', dica: 'Achei um pet pela rua', icone: 'happy-outline' },
    { valor: 'adocao', rotulo: 'Adoção', dica: 'Quero doar para adoção', icone: 'heart-outline' },
  ];

  // Estado apenas de UI — o envio/gravacao fica a cargo do Lucas
  form = {
    tipo: 'perdido' as TipoRegistro['valor'],
    nome: '',
    especie: '',
    porte: '',
    cor: '',
    descricao: '',
    referencia: '',
    telefone: '',
  };

  constructor() {
    addIcons({ cameraOutline, navigateOutline, paw, cloudOfflineOutline, sadOutline, happyOutline, heartOutline, callOutline });
  }

  capturarFoto(): void {
    // TODO: Lucas implementa a lógica nativa aqui (Câmera / Galeria do Capacitor).
  }

  capturarLocalizacao(): void {
    // TODO: Lucas implementa a lógica nativa aqui (Geolocalização do Capacitor).
  }

  salvar(): void {
    // TODO: Lucas implementa a lógica nativa aqui (gravar no StorageService e sincronizar).
  }
}
