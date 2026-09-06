import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { FotoService } from '../services/foto.service';
import { LocalService } from '../services/local.service';
import { Ocorrencia } from '../models/ocorrencia.model';

import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonContent, IonItem, IonInput, IonSelect, IonSelectOption,
  IonTextarea, IonButton, IonIcon
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  cameraOutline, navigateOutline, paw, cloudOfflineOutline,
  sadOutline, happyOutline, heartOutline, callOutline
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

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

export class CadastroPage implements OnInit {

  private storage = inject(StorageService);
  private fotoSrv = inject(FotoService);
  private local = inject(LocalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastController);

  editandoId: string | null = null;

  tipos: TipoRegistro[] = [
    { valor: 'perdido', rotulo: 'Perdido', dica: 'O meu pet sumiu', icone: 'sad-outline' },
    { valor: 'encontrado', rotulo: 'Encontrado', dica: 'Achei um pet pela rua', icone: 'happy-outline' },
    { valor: 'adocao', rotulo: 'Adoção', dica: 'Quero doar para adoção', icone: 'heart-outline' },
  ];

  form = {
    tipo: 'perdido' as TipoRegistro['valor'],
    nome: '',
    especie: '',
    porte: '',
    cor: '',
    descricao: '',
    referencia: '',
    telefone: '',
    foto: '',
    lat: 0,
    lng: 0,
  };

  constructor() {
    addIcons({ cameraOutline, navigateOutline, paw, cloudOfflineOutline, sadOutline, happyOutline, heartOutline, callOutline });
  }

  async ngOnInit() {
    this.editandoId = this.route.snapshot.queryParamMap.get('id');
    if (!this.editandoId) { return; }

    const o = await this.storage.buscarPorId(this.editandoId);
    if (!o) { return; }

    this.form = {
      tipo: o.tipo,
      nome: o.nome,
      especie: o.especie,
      porte: o.porte,
      cor: o.cor,
      descricao: o.descricao,
      referencia: o.referencia,
      telefone: o.contato,
      foto: o.foto,
      lat: o.lat,
      lng: o.lng,
    };
  }

   async capturarFoto(): Promise<void> {
    try {
      const base64 = await this.fotoSrv.capturar();
      if (base64) {
        this.form.foto = base64;
        this.aviso('Foto adicionada', 'success');
      }
    } catch {
      this.aviso('Não foi possível acessar a câmera', 'warning');
    }
  }

  async capturarLocalizacao(): Promise<void> {
    try{
      const c = await this.local.posicaoAtual();
      this.form.lat = c.lat;
      this.form.lng = c.lng;
      this.aviso('Localização capturada');
    } catch {
      this.aviso('Não foi possível capturar a localização...', 'warning');
    }
  }

  get previewFoto(): string {
    return this.fotoSrv.paraExibicao(this.form.foto);
  }

  async salvar(): Promise<void> {
    if (!this.form.nome.trim() || !this.form.telefone.trim()) {
      this.aviso('Preencha ao menos o nome e o contato', 'warning');
      return;
    }

    if (!this.form.lat && !this.form.lng) {
      try {
        const c = await this.local.posicaoAtual();
        this.form.lat = c.lat;
        this.form.lng = c.lng;
      } catch {
        // segue sem coordenada, o registro não pode ser perdido
      }
    }

    await this.storage.salvar({
      id: this.editandoId ?? this.storage.novoId(), 
      tipo: this.form.tipo,
      nome: this.form.nome.trim(),
      especie: (this.form.especie || 'outro') as Ocorrencia['especie'],
      porte: (this.form.porte || 'medio') as Ocorrencia['porte'],
      cor: this.form.cor,
      descricao: this.form.descricao,
      foto: this.form.foto,
      lat: this.form.lat,
      lng: this.form.lng,
      referencia: this.form.referencia,
      contato: this.form.telefone.trim(),
      data: new Date().toISOString(),
      resolvido: false,
    });

    this.aviso(this.editandoId ? 'Ocorrência atualizada' : 'Ocorrência registrada', 'success');
    this.router.navigateByUrl('/feed');
  }

  private async aviso(mensagem: string, cor = 'medium'): Promise<void> {
    const t = await this.toast.create({ message: mensagem, duration: 1800, color: cor });
    await t.present();
  }
}