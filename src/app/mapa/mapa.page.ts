import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonSearchbar, IonChip, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { addIcons } from 'ionicons';
import { paw, pawOutline, sadOutline, happyOutline, heartOutline, locateOutline, walkOutline } from 'ionicons/icons';

import { StorageService } from '../services/storage.service';
import { LocalService, Coordenada } from '../services/local.service';
import { FotoService } from '../services/foto.service';
import { SeedService } from '../services/seed.service';
import { Ocorrencia } from '../models/ocorrencia.model';

type StatusPet = 'perdido' | 'encontrado' | 'adocao';

interface PetMapa {
  id: string;
  nome: string;
  status: StatusPet;
  local: string;
  distancia: string;
  foto: string;
  lat: number;
  lng: number;
}

interface Pino {
  id: string;
  status: StatusPet;
  esquerda: number;
  topo: number;
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

  private storage = inject(StorageService);
  private local = inject(LocalService);
  private fotoSrv = inject(FotoService);
  private seed = inject(SeedService);
  private toast = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  pets: PetMapa[] = [];
  private ocorrencias: Ocorrencia[] = [];
  private minhaPosicao: Coordenada = { lat: -29.9177, lng: -51.1836 };

  /** area que a projeção cobre */
  private limites = { latMin: 0, latMax: 0, lngMin: 0, lngMax: 0 };

  filtroAtual: StatusPet | 'todos' = 'todos';
  busca = '';
  carregando = false;

  constructor() {
    addIcons({ paw, pawOutline, sadOutline, happyOutline, heartOutline, locateOutline, walkOutline });
  }

  async ionViewWillEnter(): Promise<void> {
    await this.carregar();
  }

  // ---------------------------------------------------------------- carga

  private async carregar(): Promise<void> {
    this.carregando = true;
    try {
      await this.seed.pronto();
      this.minhaPosicao = await this.local.posicaoAtual();

      const todas = await this.storage.listar();
      this.ocorrencias = todas.filter(o => !o.resolvido);
      this.montarPets();
    } catch (e) {
      console.error('[mapa] ERRO', e);
      await this.aviso('Não foi possível carregar as ocorrências');
    } finally {
      this.carregando = false;
      this.cdr.markForCheck();
    }
  }

  /** Converte, ordena por distância real e recalcula a área do mapa. */
  private montarPets(): void {
    this.pets = this.ocorrencias
      .map(o => this.paraMapa(o))
      .sort((a, b) => a.distanciaKm - b.distanciaKm)
      .map(({ distanciaKm, ...pet }) => pet);

    this.calcularLimites();
  }

  private paraMapa(o: Ocorrencia): PetMapa & { distanciaKm: number } {
    const km = this.distancia(o);
    return {
      id: o.id,
      nome: o.nome || 'Sem nome',
      status: o.tipo,
      local: o.referencia || 'Local não informado',
      distancia: this.local.formatarDistancia(km),
      foto: this.fotoSrv.paraExibicao(o.foto),
      lat: o.lat,
      lng: o.lng,
      distanciaKm: km,
    };
  }

  private distancia(o: Ocorrencia): number {
    if (!o.lat || !o.lng) { return 0; }
    return this.local.distanciaKm(this.minhaPosicao, { lat: o.lat, lng: o.lng });
  }

  /**
   * Define a janela geográfica que será mapeada para a área da tela,
   * a partir das ocorrências existentes e da posição do usuário.
   */
  private calcularLimites(): void {
    const pontos: Coordenada[] = [
      ...this.pets.filter(p => p.lat && p.lng).map(p => ({ lat: p.lat, lng: p.lng })),
      this.minhaPosicao,
    ];
    if (!pontos.length) { return; }

    const lats = pontos.map(p => p.lat);
    const lngs = pontos.map(p => p.lng);

    // margem para os pinos não encostarem na borda
    const margemLat = (Math.max(...lats) - Math.min(...lats)) * 0.12 || 0.01;
    const margemLng = (Math.max(...lngs) - Math.min(...lngs)) * 0.12 || 0.01;

    this.limites = {
      latMin: Math.min(...lats) - margemLat,
      latMax: Math.max(...lats) + margemLat,
      lngMin: Math.min(...lngs) - margemLng,
      lngMax: Math.max(...lngs) + margemLng,
    };
  }

  /** Projeção linear de coordenada para percentual da área visível. */
  private projetar(lat: number, lng: number): { esquerda: number; topo: number } {
    const { latMin, latMax, lngMin, lngMax } = this.limites;
    const spanLat = latMax - latMin;
    const spanLng = lngMax - lngMin;

    if (!spanLat || !spanLng) { return { esquerda: 50, topo: 50 }; }

    return {
      esquerda: ((lng - lngMin) / spanLng) * 100,
      topo: ((latMax - lat) / spanLat) * 100,  
    };
  }

  get pinos(): Pino[] {
    return this.petsFiltrados
      .filter(p => p.lat && p.lng)
      .map(p => ({ id: p.id, status: p.status, ...this.projetar(p.lat, p.lng) }));
  }

  get pinoUsuario(): { esquerda: number; topo: number } {
    return this.projetar(this.minhaPosicao.lat, this.minhaPosicao.lng);
  }

  // ---------------------------------------------------------------- interface

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

  /** pega denovo a posição do GPS e recalcula distâncias e projeção. */
  async centralizar(): Promise<void> {
    try {
      this.minhaPosicao = await this.local.posicaoAtual();
      this.montarPets();
      await this.aviso('Localização atualizada');
    } catch {
      await this.aviso('Não foi possível obter sua localização');
    } finally {
      this.cdr.markForCheck();
    }
  }

  private async aviso(mensagem: string): Promise<void> {
    const t = await this.toast.create({ message: mensagem, duration: 1800 });
    await t.present();
  }
}