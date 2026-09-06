import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Injectable({ providedIn: 'root' })
export class FotoService {

  /**
   * Captura a imagem já comprimida na origem (RNF04).
   * A redução acontece antes do base64 chegar ao aplicativo,
   * para não esgotar a área de armazenamento local.
   */
async capturar(): Promise<string> {
    const origem = Capacitor.isNativePlatform()
      ? CameraSource.Prompt
      : CameraSource.Photos;

    try {
      const foto = await Camera.getPhoto({
        quality: 50,
        width: 800,
        allowEditing: false,
        correctOrientation: true,
        resultType: CameraResultType.Base64,
        source: origem,
      });
      return foto.base64String ?? '';
    } catch (e: any) {
      const msg = String(e?.message ?? e);
      if (msg.includes('cancel')) { return ''; }

      console.error('[foto] falha na captura', e);
      throw e;
    }
  }

  paraExibicao(base64: string): string {
    return base64 ? `data:image/jpeg;base64,${base64}` : '';
  }
}