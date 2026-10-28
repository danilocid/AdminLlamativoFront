import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiRequest, ServerResponse } from 'src/app/shared/constants';
import { Setting } from 'src/app/shared/models/setting.model';
import { AlertService } from 'src/app/shared/services/alert.service';
import { ApiService } from 'src/app/shared/services/ApiService';

interface SettingMeta {
  titulo: string;
  descripcion: string;
}

@Component({
  standalone: false,
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: [],
})
export class ConfiguracionesComponent implements OnInit {
  private apiService!: ApiService;

  settings: Setting[] = [];
  loading = false;
  savingName: string | null = null;
  testing = false;
  showToken = false;

  /** Etiquetas conocidas; los parámetros no listados muestran su clave tal cual. */
  readonly metadatos: Record<string, SettingMeta> = {
    telegram_bot_token: {
      titulo: 'Token del bot de Telegram',
      descripcion: 'Token otorgado por @BotFather. Se usa para enviar los avisos.',
    },
    telegram_chat_id: {
      titulo: 'Chat ID de Telegram',
      descripcion:
        'Identificador de la conversación donde se reciben los mensajes.',
    },
  };

  constructor(
    readonly titleService: Title,
    readonly http: HttpClient,
    readonly spinner: NgxSpinnerService,
    readonly alertSV: AlertService
  ) {
    this.titleService.setTitle('Configuraciones');
  }

  ngOnInit(): void {
    this.apiService = new ApiService(this.http);
    this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.apiService.get<ServerResponse>(ApiRequest.getSettings).subscribe({
      next: (response) => {
        this.settings = (response.data as Setting[]) || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  tituloDe(setting: Setting): string {
    return this.metadatos[setting.name]?.titulo ?? setting.name;
  }

  descripcionDe(setting: Setting): string {
    return (
      this.metadatos[setting.name]?.descripcion ??
      'Parámetro general del sistema.'
    );
  }

  esOculto(setting: Setting): boolean {
    return setting.name.includes('token') || setting.name.includes('secret');
  }

  guardar(setting: Setting): void {
    if (!setting.parameter) {
      this.alertSV.alertBasic(
        'Atención',
        'El valor del parámetro no puede estar vacío.',
        'warning'
      );
      return;
    }

    this.savingName = setting.name;
    this.apiService
      .put<ServerResponse>(ApiRequest.updateSetting + setting.name, {
        parameter: setting.parameter,
      })
      .subscribe({
        next: (response) => {
          this.savingName = null;
          this.alertSV.alertBasic(
            'Éxito',
            response.serverResponseMessage || 'Parámetro guardado.',
            'success'
          );
        },
        error: (error: ServerResponse) => {
          this.savingName = null;
          this.alertSV.alertBasic(
            'Error',
            error.serverResponseMessage || 'No se pudo guardar el parámetro.',
            'error'
          );
        },
      });
  }

  probarTelegram(): void {
    this.testing = true;
    this.apiService.post<ServerResponse>(ApiRequest.testTelegram, {}).subscribe({
      next: (response) => {
        this.testing = false;
        this.alertSV.alertBasic(
          'Éxito',
          response.serverResponseMessage || 'Mensaje de prueba enviado.',
          'success'
        );
      },
      error: (error: ServerResponse) => {
        this.testing = false;
        this.alertSV.alertBasic(
          'Error',
          error.serverResponseMessage || 'No se pudo enviar el mensaje.',
          'error'
        );
      },
    });
  }
}
