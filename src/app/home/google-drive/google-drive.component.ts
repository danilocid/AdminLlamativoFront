import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { AlertService } from '../../shared/services/alert.service';
import { ApiRequest } from '../../shared/constants';

interface DriveImage {
  id: string;
  name: string;
  webViewLink: string;
  webContentLink: string;
  mimeType: string;
  size: string;
  createdTime: string;
  thumbnailLink?: string;
}

interface DriveFolder {
  id: string;
  name: string;
  createdTime: string;
}

@Component({
  selector: 'app-google-drive',
  templateUrl: './google-drive.component.html',
  styleUrls: ['./google-drive.component.scss'],
  standalone: false,
})
export class GoogleDriveComponent implements OnInit {
  images: DriveImage[] = [];
  folders: DriveFolder[] = [];
  selectedFolder: string = '';
  loading = false;
  uploading = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  newFolderName: string = '';
  showUploadModal = false;
  showNewFolderModal = false;
  showImageModal = false;
  selectedImage: DriveImage | null = null;

  constructor(
    private titleService: Title,
    private http: HttpClient,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Google Drive - Imágenes');
    this.loadFolders();
    this.loadImages();
  }

  loadFolders(): void {
    this.http.get(ApiRequest.googleDriveFolders).subscribe({
      next: (response: any) => {
        this.folders = response.data || response;
      },
      error: (error) => {
        console.error('Error loading folders:', error);
      },
    });
  }

  loadImages(): void {
    this.loading = true;
    const params = this.selectedFolder ? `?folder=${this.selectedFolder}` : '';
    this.http.get(ApiRequest.googleDriveList + params).subscribe({
      next: (response: any) => {
        this.images = response.files || [];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.alertService.alertBasic(
          'Error',
          'No se pudieron cargar las imágenes',
          'error',
        );
      },
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;
    this.uploading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    if (this.selectedFolder) {
      formData.append('folder', this.selectedFolder);
    }
    this.http.post(ApiRequest.googleDriveUpload, formData).subscribe({
      next: () => {
        this.uploading = false;
        this.showUploadModal = false;
        this.selectedFile = null;
        this.previewUrl = null;
        this.alertService.alertBasic(
          'Éxito',
          'Imagen subida correctamente',
          'success',
        );
        this.loadImages();
      },
      error: () => {
        this.uploading = false;
        this.alertService.alertBasic(
          'Error',
          'No se pudo subir la imagen',
          'error',
        );
      },
    });
  }

  createFolder(): void {
    if (!this.newFolderName.trim()) return;
    this.http
      .post(ApiRequest.googleDriveFolders, { name: this.newFolderName })
      .subscribe({
        next: () => {
          this.showNewFolderModal = false;
          this.newFolderName = '';
          this.alertService.alertBasic(
            'Éxito',
            'Carpeta creada correctamente',
            'success',
          );
          this.loadFolders();
        },
        error: () => {
          this.alertService.alertBasic(
            'Error',
            'No se pudo crear la carpeta',
            'error',
          );
        },
      });
  }

  selectFolder(folderId: string): void {
    this.selectedFolder = folderId;
    this.loadImages();
  }

  clearFolderFilter(): void {
    this.selectedFolder = '';
    this.loadImages();
  }

  viewImage(image: DriveImage): void {
    this.selectedImage = image;
    this.showImageModal = true;
  }

  copyLink(image: DriveImage): void {
    navigator.clipboard.writeText(image.webContentLink);
    this.alertService.alertBasic(
      'Copiado',
      'Enlace copiado al portapapeles',
      'success',
    );
  }

  deleteImage(image: DriveImage): void {
    this.alertService.verificationAlertWithFunction(
      '¿Eliminar imagen?',
      `¿Estás seguro de que deseas eliminar "${image.name}"?`,
      'Eliminar',
      'Cancelar',
      'warning',
      () => {
        this.http
          .delete(ApiRequest.googleDriveDelete + '/' + image.id)
          .subscribe({
            next: () => {
              this.alertService.alertBasic(
                'Éxito',
                'Imagen eliminada correctamente',
                'success',
              );
              this.loadImages();
            },
            error: () => {
              this.alertService.alertBasic(
                'Error',
                'No se pudo eliminar la imagen',
                'error',
              );
            },
          });
      },
    );
  }

  formatSize(bytes: string): string {
    const size = parseInt(bytes, 10);
    if (isNaN(size)) return 'N/A';
    if (size < 1024) return size + ' B';
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
    return (size / (1024 * 1024)).toFixed(1) + ' MB';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL');
  }

  openUploadModal(): void {
    this.showUploadModal = true;
  }

  closeUploadModal(): void {
    this.showUploadModal = false;
    this.selectedFile = null;
    this.previewUrl = null;
  }

  openNewFolderModal(): void {
    this.showNewFolderModal = true;
  }

  closeNewFolderModal(): void {
    this.showNewFolderModal = false;
    this.newFolderName = '';
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.selectedImage = null;
  }
}
