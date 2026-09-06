import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonFooter,
  IonIcon, IonButton, ToastController, AlertController
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  paw, pawOutline, locationOutline, walkOutline, callOutline, timeOutline,
  documentTextOutline, checkmarkCircleOutline, colorPaletteOutline,
  resizeOutline, chevronForwardOutline, chatbubbleEllipsesOutline
} from 'ionicons/icons';

import { StorageService } from '../services/storage.service';
import { LocalService, Coordenada } from '../services/local.service';
import { FotoService } from '../services/foto.service';
import { CartazService } from '../services/cartaz.service';
import { Ocorrencia } from '../models/ocorrencia.model';

type StatusPet = 'perdido' | 'encontrado' | 'adocao';

/** Modelo de exibição da tela */
interface PetDetalhe {
  id: string;
  nome: string;
  status: StatusPet;
  especie: string;
  porte: string;
  cor: string;
  descricao: string;
  local: string;
  coordenadas: string;
  distancia: string;
  tempo: string;
  foto: string;
  contatoFone: string;
}

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
    IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonFooter,
    IonIcon, IonButton, RouterModule
  ],
})
export class DetalhePage {

  private rota = inject(ActivatedRoute);
  private router = inject(Router);
  private storage = inject(StorageService);
  private local = inject(LocalService);
  private fotoSrv = inject(FotoService);
  private cartazSrv = inject(CartazService);
  private toast = inject(ToastController);
  private alerta = inject(AlertController);
  private cdr = inject(ChangeDetectorRef);

  pet: PetDetalhe | null = null;
  carregando = true;
  gerando = false;

  /** Registro original, mantido para gerar cartaz e atualizar a persistência. */
  private ocorrencia: Ocorrencia | null = null;
  private minhaPosicao: Coordenada = { lat: -29.9177, lng: -51.1836 };

  constructor() {
    addIcons({
      paw, pawOutline, locationOutline, walkOutline, callOutline, timeOutline,
      documentTextOutline, checkmarkCircleOutline, colorPaletteOutline,
      resizeOutline, chevronForwardOutline, chatbubbleEllipsesOutline
    });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.carregar();
  }

  private async carregar(): Promise<void> {
    this.carregando = true;
    try {
      const id = this.rota.snapshot.queryParamMap.get('id');
      if (!id) { this.pet = null; return; }

      const todas = await this.storage.listar();
      this.ocorrencia = todas.find(o => o.id === id) ?? null;
      if (!this.ocorrencia) { this.pet = null; return; }

      try {
        this.minhaPosicao = await this.local.posicaoAtual();
      } catch {
        // sem GPS a tela continua utilizável, só perde a distância (RNF07)
      }

      this.pet = this.paraDetalhe(this.ocorrencia);
    } catch (e) {
      console.error('[detalhe] ERRO', e);
      await this.aviso('Não foi possível carregar a ocorrência');
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  private paraDetalhe(o: Ocorrencia): PetDetalhe {
    const km = (o.lat && o.lng)
      ? this.local.distanciaKm(this.minhaPosicao, { lat: o.lat, lng: o.lng })
      : 0;

    return {
      id: o.id,
      nome: o.nome || 'Sem nome',
      status: o.tipo as StatusPet,
      especie: this.capitalizar(o.especie),
      porte: this.capitalizar(o.porte),
      cor: o.cor || 'Não informada',
      descricao: o.descricao || 'Sem descrição informada.',
      local: o.referencia || 'Local não informado',
      coordenadas: (o.lat && o.lng) ? `${o.lat.toFixed(5)}, ${o.lng.toFixed(5)}` : '',
      distancia: this.local.formatarDistancia(km),
      tempo: this.tempoRelativo(o.data),
      foto: this.fotoSrv.paraExibicao(o.foto),
      contatoFone: o.contato || '',
    };
  }

  private capitalizar(v: string): string {
    return v ? v.charAt(0).toUpperCase() + v.slice(1) : '';
  }

  private tempoRelativo(iso: string): string {
    const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (min < 1)  { return 'agora'; }
    if (min < 60) { return `há ${min} min`; }
    const h = Math.floor(min / 60);
    if (h < 24)   { return `há ${h} h`; }
    const d = Math.floor(h / 24);
    return d === 1 ? 'ontem' : `há ${d} dias`;
  }

  rotulo(status: StatusPet): string {
    return ROTULOS_STATUS[status];
  }

  iniciais(nome: string): string {
    return nome.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  private get somenteDigitos(): string {
    return (this.pet?.contatoFone || '').replace(/\D/g, '');
  }

  get zapLink(): string {
    const texto = encodeURIComponent(`Olá! Vi o registro de ${this.pet?.nome} no app Rede Patas de Canoas.`);
    return `https://wa.me/55${this.somenteDigitos}?text=${texto}`;
  }

  ligar(): void {
    if (!this.somenteDigitos) { return; }
    window.open(`tel:${this.somenteDigitos}`, '_system');
  }

  falhaFoto(): void {
    if (this.pet) { this.pet.foto = ''; }
  }

  /** RF10 — gera o cartaz de divulgação em PDF. */
  async gerarCartaz(): Promise<void> {
    if (!this.ocorrencia || this.gerando) { return; }
    this.gerando = true;
    try {
      await this.cartazSrv.gerar(this.ocorrencia);
      await this.aviso('Cartaz gerado');
    } catch (e) {
      console.error('[detalhe] cartaz', e);
      await this.aviso('Não foi possível gerar o cartaz');
    } finally {
      this.gerando = false;
      this.cdr.markForCheck();
    }
  }

  /** RF13 — encerra a ocorrência. */
  async marcarResolvido(): Promise<void> {
    if (!this.ocorrencia) { return; }

    const a = await this.alerta.create({
      header: 'Encerrar ocorrência',
      message: `Confirmar que o caso de ${this.ocorrencia.nome} foi resolvido?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: async () => {
            this.ocorrencia!.resolvido = true;
            await this.storage.salvar(this.ocorrencia!);
            await this.aviso('Ocorrência encerrada');
            this.router.navigate(['/feed']);
          },
        },
      ],
    });
    await a.present();
  }

  private async aviso(mensagem: string): Promise<void> {
    const t = await this.toast.create({ message: mensagem, duration: 1800 });
    await t.present();
  }
}