import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Ocorrencia } from '../models/ocorrencia.model';

const MARCA = 'seed-aplicado';

@Injectable({ providedIn: 'root' })
export class SeedService {

  private promessa: Promise<void> | null = null;

  private async executar(): Promise<void> {
    await Preferences.set({
      key: 'ocorrencias',
      value: JSON.stringify(this.exemplos())
    });
    await Preferences.set({ key: MARCA, value: 'sim' });
  }

  pronto(): Promise<void> {
    if (!this.promessa) {
      this.promessa = this.executar();
    }
    return this.promessa;
  }

  async resetar(): Promise<void> {
    await Preferences.remove({ key: 'ocorrencias' });
    await Preferences.remove({ key: MARCA });
    this.promessa = null;
    await this.pronto();
  }

  private horasAtras(h: number): string {
    return new Date(Date.now() - h * 3600_000).toISOString();
  }

  // mock de exemplos ficticios para demonstração
  private exemplos(): Ocorrencia[] {
    return [
      {
        id: 'seed-bolinha', tipo: 'perdido', nome: 'Bolinha',
        especie: 'cao', porte: 'medio', cor: 'caramelo',
        descricao: 'Coleira azul, muito dócil, atende pelo nome.',
        foto: '', lat: -29.9145, lng: -51.1810,
        referencia: 'Perto do La Salle, Centro',
        contato: '(51) 99999-1234', data: this.horasAtras(2), resolvido: false,
      },
      {
        id: 'seed-mimi', tipo: 'perdido', nome: 'Mimi',
        especie: 'gato', porte: 'pequeno', cor: 'siamesa',
        descricao: 'Gata siamesa, olhos azuis, sem coleira.',
        foto: '', lat: -29.9320, lng: -51.1650,
        referencia: 'Bairro Mathias Velho',
        contato: '(51) 98888-5678', data: this.horasAtras(5), resolvido: false,
      },
      {
        id: 'seed-thor', tipo: 'encontrado', nome: 'Thor',
        especie: 'cao', porte: 'grande', cor: 'preto e branco',
        descricao: 'Encontrado no parque, sem coleira, bem cuidado.',
        foto: '', lat: -29.9190, lng: -51.1795,
        referencia: 'Parque Getúlio Vargas',
        contato: '(51) 97777-4321', data: this.horasAtras(26), resolvido: false,
      },
      {
        id: 'seed-nina', tipo: 'adocao', nome: 'Nina',
        especie: 'cao', porte: 'pequeno', cor: 'preta',
        descricao: 'Castrada e vacinada, ótima com crianças.',
        foto: '', lat: -29.9050, lng: -51.1520,
        referencia: 'Lar temporário no Igara',
        contato: '(51) 96666-8765', data: this.horasAtras(50), resolvido: false,
      },
      {
        id: 'seed-foguete', tipo: 'adocao', nome: 'Foguete',
        especie: 'gato', porte: 'pequeno', cor: 'frajola',
        descricao: 'Filhote de 3 meses, muito brincalhão.',
        foto: '', lat: -29.9400, lng: -51.1900,
        referencia: 'Bairro Rio Branco',
        contato: '(51) 95555-2468', data: this.horasAtras(74), resolvido: false,
      },
    ];
  }
}