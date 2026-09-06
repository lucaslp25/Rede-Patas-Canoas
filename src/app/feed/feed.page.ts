import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
  IonSearchbar, IonChip, IonRefresher, IonRefresherContent, ToastController
} from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  paw, pawOutline, sadOutline, happyOutline, heartOutline,
  notificationsOutline, notifications, locationOutline, walkOutline
} from 'ionicons/icons';

import { StorageService } from '../services/storage.service';
import { LocalService, Coordenada } from '../services/local.service';
import { FotoService } from '../services/foto.service';
import { NotificacaoService } from '../services/notification.service';
import { Ocorrencia } from '../models/ocorrencia.model';
import { SeedService } from '../services/seed.service';

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

  private storage = inject(StorageService);
  private local = inject(LocalService);
  private fotoSrv = inject(FotoService);
  private notificacao = inject(NotificacaoService);
  private toast = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  pets: PetFeed[] = [];
  private ocorrencias: Ocorrencia[] = [];
  private minhaPosicao: Coordenada = { lat: -29.9177, lng: -51.1836 };

  filtroAtual: StatusPet | 'todos' = 'todos';
  busca = '';
  notificacoesNaoLidas = 0;
  carregando = false;

  constructor() {
    addIcons({ paw, pawOutline, sadOutline, happyOutline, heartOutline, notificationsOutline, notifications, locationOutline, walkOutline });
  }

  private seed = inject(SeedService);

  // atualização das páginas
  async ionViewWillEnter() {
    await this.carregar();
  }

  private async carregar(): Promise<void> {
    this.carregando = true;
    try {
      await this.seed.pronto();

      const todas = await this.storage.listar();

      this.minhaPosicao = await this.local.posicaoAtual();
      this.ocorrencias = todas.filter(o => !o.resolvido);
      this.pets = this.ocorrencias.map(o => this.paraFeed(o));
      this.notificacoesNaoLidas = this.ocorrencias.filter(o => this.distancia(o) <= 5).length;

    } catch (e) {
      console.error('[feed] ERRO', e);
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  private distancia(o: Ocorrencia): number {
    if (!o.lat && !o.lng) { return 0; }
    return this.local.distanciaKm(this.minhaPosicao, { lat: o.lat, lng: o.lng });
  }

  private paraFeed(o: Ocorrencia): PetFeed {
    return {
      id: o.id,
      nome: o.nome || 'Sem nome',
      status: o.tipo,
      especie: this.capitalizar(o.especie),
      porte: this.capitalizar(o.porte),
      cor: o.cor,
      local: o.referencia || 'Local não informado',
      distancia: this.local.formatarDistancia(this.distancia(o)),
      tempo: this.tempoRelativo(o.data),
      foto: this.fotoSrv.paraExibicao(o.foto),
    };
  }

  private capitalizar(v: string): string {
    if (!v) { return ''; }
    return v.charAt(0).toUpperCase() + v.slice(1);
  }

  private tempoRelativo(iso: string): string {
    const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (min < 1)    { return 'agora'; }
    if (min < 60)   { return `há ${min} min`; }
    const h = Math.floor(min / 60);
    if (h < 24)     { return `há ${h} h`; }
    const d = Math.floor(h / 24);
    if (d === 1)    { return 'ontem'; }
    return `há ${d} dias`;
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

  falhaFoto(pet: PetFeed): void {
    pet.foto = '';
  }

  async abrirNotificacoes(): Promise<void> {
    const proximas = this.ocorrencias
      .filter(o => this.distancia(o) <= 5)
      .sort((a, b) => this.distancia(a) - this.distancia(b));

    if (!proximas.length) {
      await this.aviso('Nenhuma ocorrência num raio de 5 km');
      return;
    }

    const alvo = proximas[0];
    await this.notificacao.pedirPermissao();
    await this.notificacao.alertarProximidade(alvo, this.distancia(alvo));
    await this.aviso(`${proximas.length} ocorrência(s) perto de você`);
  }

  async atualizar(event: CustomEvent): Promise<void> {
    await this.carregar();
    (event.target as HTMLIonRefresherElement).complete();
  }

  private async aviso(mensagem: string): Promise<void> {
    const t = await this.toast.create({ message: mensagem, duration: 1800 });
    await t.present();
  }
}