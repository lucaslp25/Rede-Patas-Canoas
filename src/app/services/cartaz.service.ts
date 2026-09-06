import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Ocorrencia } from '../models/ocorrencia.model';

const ENTIDADE = 'Rede Patas de Canoas';

@Injectable({ providedIn: 'root' })
export class CartazService {

  gerar(o: Ocorrencia): void {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const meio = 105;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(42);
    doc.text(this.titulo(o), meio, 32, { align: 'center' });

    doc.setDrawColor(30);
    doc.setLineWidth(0.8);
    doc.rect(50, 42, 110, 110);

    if (o.foto) {
      doc.addImage(`data:image/jpeg;base64,${o.foto}`, 'JPEG', 50, 42, 110, 110);
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.text('sem foto', meio, 100, { align: 'center' });
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.text(o.nome || 'Sem nome', meio, 168, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`${o.especie} · porte ${o.porte} · ${o.cor}`, meio, 180, { align: 'center' });

    if (o.referencia) {
      doc.text(`Visto em: ${o.referencia}`, meio, 190, { align: 'center' });
    }

    if (o.descricao) {
      const linhas = doc.splitTextToSize(o.descricao, 150);
      doc.setFontSize(12);
      doc.text(linhas, meio, 202, { align: 'center' });
    }

    doc.setFillColor(20, 20, 20);
    doc.rect(30, 232, 150, 22, 'F');
    doc.setTextColor(255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(`Contato: ${o.contato}`, meio, 246, { align: 'center' });

    doc.setTextColor(90);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(ENTIDADE, meio, 275, { align: 'center' });
    doc.text(new Date(o.data).toLocaleDateString('pt-BR'), meio, 281, { align: 'center' });

    doc.save(`cartaz-${this.slug(o.nome)}.pdf`);
  }

  private titulo(o: Ocorrencia): string {
    if (o.tipo === 'adocao') { return 'ADOTE'; }
    if (o.tipo === 'encontrado') { return 'ACHEI ESTE PET'; }
    return 'PROCURA-SE';
  }

  private slug(nome: string): string {
    return (nome || 'pet')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-');
  }
}