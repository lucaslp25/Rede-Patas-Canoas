import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import { pawOutline, mapOutline, informationCircleOutline, add } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ],
})
export class TabsPage {
  constructor(private router: Router) {
    addIcons({ pawOutline, mapOutline, informationCircleOutline, add });
  }

  // Botão central de destaque do dock → cadastro de nova ocorrência
  abrirCadastro(): void {
    this.router.navigate(['/cadastro']);
  }
}
