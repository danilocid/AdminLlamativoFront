import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  registerables,
} from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { Hydrocontrol } from 'src/app/shared/models/hydrocontrol.model';
import { Title } from '@angular/platform-browser';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
);
@Component({
  selector: 'app-hydrocontrol',
  templateUrl: './hydrocontrol.component.html',
  styleUrls: ['./hydrocontrol.component.css'],
})
export class HydrocontrolComponent implements OnInit, AfterViewInit {
  constructor(
    readonly titleService: Title,
    readonly db: AngularFireDatabase,
    readonly spinner: NgxSpinnerService,
  ) {
    this.titleService.setTitle('Hydrocontrol');
    Chart.register(...registerables);
  }
  public chart: Chart;
  hydroData: AngularFireList<any> | undefined;
  isUpdated = false;
  data: Hydrocontrol[] = [];

  // Paginación
  currentPage = 1;
  pageSize = 15;
  searchTerm = '';
  sortColumn = 'timeStamp.dateString';
  sortDirection: 'asc' | 'desc' = 'desc';

  realoadTime = 300000;
  actualTime = 0;
  minutes = 5;
  seconds = 0;
  maxTempA = 0;
  timeMaxTempA = '';
  minTempA = 100;
  timeMinTempA = '';
  maxTempI = 0;
  timeMaxTempI = '';
  minTempI = 100;
  timeMinTempI = '';
  maxTempE = 0;
  timeMaxTempE = '';
  minTempE = 100;
  timeMinTempE = '';

  ngOnInit() {
    this.spinner.show();
    this.hydroData = this.db.list('data');
    this.getData();
  }

  get filteredData(): Hydrocontrol[] {
    if (!this.searchTerm) return this.data;
    const term = this.searchTerm.toLowerCase();
    return this.data.filter(
      (item) =>
        item.timeStamp?.date?.toLowerCase().includes(term) ||
        item.agua?.temperatura?.toString().includes(term),
    );
  }

  get paginatedData(): Hydrocontrol[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onSearch(): void {
    this.currentPage = 1;
  }

  private getData() {
    this.hydroData?.valueChanges().subscribe({
      next: (value) => {
        if (this.isUpdated == false) {
          this.data = value;
          this.orderData();
          this.isUpdated = true;
        }
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  reloadv2() {
    //reload the window every 5 minutes
    // check if the actual time is less than the reload time
    if (this.actualTime * 1000 < this.realoadTime) {
      // if the actual time is less than the reload time, wait 1 second and then call the function again
      setTimeout(() => {
        this.actualTime = this.actualTime + 1;
        // print the time in minutes and seconds left to reload the page
        this.minutes = Math.floor(
          (this.realoadTime - this.actualTime * 1000) / 60000,
        );
        this.seconds =
          ((this.realoadTime - this.actualTime * 1000) % 60000) / 1000;
        this.titleService.setTitle(
          'Hydrocontrol ' + this.minutes + ':' + this.seconds,
        );
        this.reloadv2();
      }, 1000);
    } else {
      // if the actual time is greater than the reload time, reload the page
      window.location.reload();
    }
  }

  orderData() {
    //order data by timeStamp -> day (is a numeric value from 0 to 6, this is the number of the day, from monday to sunday) and hora (is a numeric value from 0 to 23) and then by minutos (is a numeric value from 0 to 59)
    //the order is from the newest to the oldest
    const tmpData: Hydrocontrol[] = [];
    const dataToDelete: number[] = [];
    let badDataCount = 0;

    for (let i = 0; i < this.data.length; i++) {
      const element = this.data[i];
      let isValidData = true;

      // Verificar si algún campo crítico es undefined
      if (
        !element ||
        !element.timeStamp ||
        element.timeStamp.timeStamp === undefined ||
        element.timeStamp.count === undefined ||
        element.timeStamp.hora === undefined ||
        element.timeStamp.minutos === undefined ||
        element.timeStamp.day === undefined ||
        !element.agua ||
        element.agua.temperatura === undefined ||
        !element.interior ||
        !element.exterior ||
        element.exterior.temperatura === undefined ||
        element.agua.temperatura >= 60
      ) {
        // Datos inválidos o con campos undefined
        isValidData = false;
        badDataCount++;

        // Intentar agregar a dataToDelete si tiene count
        if (
          element &&
          element.timeStamp &&
          element.timeStamp.count !== undefined
        ) {
          dataToDelete.push(element.timeStamp.count);
          console.warn(
            'Data marcada para eliminar (undefined detectado):',
            element.timeStamp.count,
          );
        } else {
          console.warn(
            'Registro sin count, no se puede eliminar automáticamente:',
            element,
          );
        }
      }

      // Si los datos son válidos, verificar temperatura
      if (isValidData) {
        if (element.agua.temperatura < 0) {
          // Temperatura negativa - datos inválidos
          badDataCount++;
          dataToDelete.push(element.timeStamp.count);
          console.warn(
            'Temperatura negativa detectada, marcada para eliminar:',
            element.timeStamp.count,
          );
        } else {
          // Datos válidos - formatear fecha y agregar a tmpData
          const date = new Date(element.timeStamp.timeStamp);
          date.setHours(date.getHours() - 3);
          let dateString = date.toISOString();
          dateString = dateString.replace('T', ' ');
          dateString = dateString.replace('Z', '');
          dateString = dateString.replace(/\.\d+/, '');
          element.timeStamp.date = dateString;
          element.timeStamp.dateString = date;

          tmpData.push(element);
        }
      }
    }
    this.data = tmpData;

    //order the data by date from the newest to the oldest
    this.data.sort(function (a, b) {
      return b.timeStamp.dateString - a.timeStamp.dateString;
    });
    this.data.forEach((element) => {
      if (element.agua.temperatura >= this.maxTempA) {
        this.maxTempA = element.agua.temperatura;
        this.timeMaxTempA = element.timeStamp.date;
      }
      if (element.agua.temperatura <= this.minTempA) {
        this.minTempA = element.agua.temperatura;
        this.timeMinTempA = element.timeStamp.date;
      }

      if (element.interior.temperatura >= this.maxTempI) {
        this.maxTempI = element.interior.temperatura;
        this.timeMaxTempI = element.timeStamp.date;
      }
      if (element.interior.temperatura <= this.minTempI) {
        this.minTempI = element.interior.temperatura;
        this.timeMinTempI = element.timeStamp.date;
      }

      // Calcular temperaturas máximas y mínimas del exterior (ambiente)
      if (element.exterior && element.exterior.temperatura !== undefined) {
        if (element.exterior.temperatura >= this.maxTempE) {
          this.maxTempE = element.exterior.temperatura;
          this.timeMaxTempE = element.timeStamp.date;
        }
        if (element.exterior.temperatura <= this.minTempE) {
          this.minTempE = element.exterior.temperatura;
          this.timeMinTempE = element.timeStamp.date;
        }
      }
    });
    this.firstAndLastData();
    this.createChart();
    this.spinner.hide();
    console.warn('Bad data count: ' + badDataCount);
    console.warn('Data to delete: ' + dataToDelete.length);

    try {
      // delete only the first record of the bad data
      if (badDataCount !== 0 && dataToDelete.length !== 0) {
        console.warn('Deleting bad data!');
        console.warn(dataToDelete[0]);
        this.deleteData(dataToDelete[0]);
      }
    } catch (error) {
      console.error('There was an error deleting the bad data!', error);
    }
  }

  firstAndLastData() {
    //print the first and last data

    const diff =
      this.data[0].timeStamp.count -
      this.data[this.data.length - 1].timeStamp.count;

    if (diff !== -1) {
      console.warn('Data difference: ' + diff);
      console.warn('Data is missing!');
    }
    this.deleteData(this.data[this.data.length - 1].timeStamp.count);
  }

  dayOfWeekAsString(dayIndex: number) {
    return [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ][dayIndex];
  }
  createChart() {
    const labels: string[] = [];
    const tAgua: number[] = [];

    const tInterior: number[] = [];
    let par = 1;

    this.data.forEach((element) => {
      //if element.timeStamp.timeStamp is not undefined, print it

      if (labels.length < 60) {
        if (element.agua != undefined && element.interior != undefined) {
          //si element.agua.temperatura es menor a 60, se agrega al grafico
          if (element.agua.temperatura < 60 && element.agua.temperatura > 0) {
            if (par == 1) {
              labels.push(
                element.timeStamp.hora + ':' + element.timeStamp.minutos,
              );
              tAgua.push(parseFloat(element.agua.temperatura.toFixed(1)));

              tInterior.push(
                parseFloat(element.interior.temperatura.toFixed(1)),
              );
              par = 2;
            } else {
              if (par == 13) {
                par = 1;
              } else {
                par = par + 1;
              }
            }
          }
        }
      }
    });

    this.chart = new Chart('MyChart', {
      type: 'line', //this denotes tha type of chart

      data: {
        // values on X-Axis
        labels: labels,
        datasets: [
          {
            label: 'T° Agua',
            data: tAgua,
            backgroundColor: 'red',
          },

          {
            label: 'T° Interior',
            data: tInterior,
            backgroundColor: 'yellow',
          },
        ],
      },
      options: {
        aspectRatio: 2,
        responsive: true,
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (context: any) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y + '°C';
                }
                return label;
              },
            },
          },
        },
        scales: {
          y: {
            type: 'linear',
          },
        },
      },
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.warn('Reloading page in 5 minutes');
      this.reloadv2();
    }, 10000);
  }

  deleteData(id: number) {
    try {
      this.db.list('data').remove(id.toString());
    } catch (error) {
      console.error('There was an error!', error);
    }
  }
}
