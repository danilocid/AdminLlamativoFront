import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { DataTableDirective } from 'angular-datatables';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from 'chart.js';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { Hydrocontrol } from 'src/app/shared/models/hydrocontrol.model';
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale
);
@Component({
  selector: 'app-hydrocontrol',
  templateUrl: './hydrocontrol.component.html',
  styleUrls: ['./hydrocontrol.component.css'],
})

//
export class HydrocontrolComponent implements OnInit {
  constructor(
    private db: AngularFireDatabase,
    private spinner: NgxSpinnerService
  ) {}
  public chart: Chart;
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  hydroData: AngularFireList<any> | undefined;
  isUpdated = false;
  data: Hydrocontrol[] = []; // Specify the type as 'any[]'
  realoadTime = 300000;
  actualTime = 0;
  minutes = 0;
  seconds = 0;
  maxTempA = 0;
  timeMaxTempA = '';
  minTempA = 100;
  timeMinTempA = '';
  maxTempE = 0;
  timeMaxTempE = '';
  minTempE = 100;
  timeMinTempE = '';
  maxTempI = 0;
  timeMaxTempI = '';
  minTempI = 100;
  timeMinTempI = '';

  ngOnInit() {
    this.spinner.show();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      order: [[10, 'desc']],
      dom: 'Bfrtip',
      language: {
        search: 'Buscar:',
        searchPlaceholder: 'Buscar',
        paginate: {
          first: '<<',
          previous: '<<',
          next: '>>',
          last: '>>',
        },
        zeroRecords: 'No se encontraron registros',
        info: 'Mostrando desde _START_ al _END_ de _TOTAL_ elementos',
        infoFiltered: '(filtrado de _MAX_ elementos en total)',
      },
    };
    this.hydroData = this.db.list('data');
    this.getData();
    this.reload();
    this.reloadv2();
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
  reload() {
    //reload the window every 5 minutes
    const timeout = 300000;
    setTimeout(() => {
      window.location.reload();
    }, timeout);
  }

  reloadv2() {
    //reload the window every 5 minutes
    // check if the actual time is less than the reload time
    if (this.actualTime * 1000 < this.realoadTime) {
      // if the actual time is less than the reload time, wait 1 second and then call the function again
      setTimeout(() => {
        /*       console.log('Reload');
         */ this.actualTime = this.actualTime + 1;
        // print the time in minutes and seconds left to reload the page
        this.minutes = Math.floor(
          (this.realoadTime - this.actualTime * 1000) / 60000
        );
        this.seconds =
          ((this.realoadTime - this.actualTime * 1000) % 60000) / 1000;
        /*  console.log(
           'Time left to reload: ' +
             this.minutes +
             ' minutes and ' +
             this.seconds +
             ' seconds'
         ); */
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
    this.data.forEach((element) => {
      if (
        element.timeStamp.timeStamp != undefined &&
        element.agua != undefined &&
        element.exterior != undefined &&
        element.interior != undefined &&
        element.agua.temperatura < 60
      ) {
        //console.log(element.timeStamp.timeStamp);
        //convert the timeStamp to a Date object, whith the format: day-month-year hour:minutes:seconds
        const date = new Date(element.timeStamp.timeStamp);
        //set the timezone to UTC-3
        date.setHours(date.getHours() - 4);

        //console.log(date.toISOString());
        //convert the date to a string, with the format: day-month-year hour:minutes:seconds
        let dateString = date.toISOString();
        dateString = dateString.replace('T', ' ');
        //replace the 'Z' character with nothing
        dateString = dateString.replace('Z', '');
        //replace the decimal part of the seconds with nothing
        dateString = dateString.replace(/\.\d+/, '');
        //console.log(dateString);
        element.timeStamp.date = dateString;
        element.timeStamp.dateString = date;
        // get max and min temperature of the water
        if (element.agua.temperatura > this.maxTempA) {
          this.maxTempA = element.agua.temperatura;
          this.timeMaxTempA = element.timeStamp.date;
        }
        if (element.agua.temperatura < this.minTempA) {
          this.minTempA = element.agua.temperatura;
          this.timeMinTempA = element.timeStamp.date;
        }
        // get max and min temperature of the exterior
        if (element.exterior.temperatura > this.maxTempE) {
          this.maxTempE = element.exterior.temperatura;
          this.timeMaxTempE = element.timeStamp.date;
        }
        if (element.exterior.temperatura < this.minTempE) {
          this.minTempE = element.exterior.temperatura;
          this.timeMinTempE = element.timeStamp.date;
        }
        // get max and min temperature of the interior
        if (element.interior.temperatura > this.maxTempI) {
          this.maxTempI = element.interior.temperatura;
          this.timeMaxTempI = element.timeStamp.date;
        }
        if (element.interior.temperatura < this.minTempI) {
          this.minTempI = element.interior.temperatura;
          this.timeMinTempI = element.timeStamp.date;
        }
        tmpData.push(element);
      }
    });
    this.data = tmpData;

    //order the data by date from the newest to the oldest
    this.data.sort(function (a, b) {
      return b.timeStamp.dateString - a.timeStamp.dateString;
    });

    //console.log(this.data);
    this.dtTrigger.next(this.dtOptions);
    //
    this.createChart();
    this.spinner.hide();
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
    const tAmbiente: number[] = [];
    const hAmbiente: number[] = [];
    const tInterior: number[] = [];
    const hInterior: number[] = [];
    let par = 1;

    this.data.forEach((element) => {
      //if element.timeStamp.timeStamp is not undefined, print it

      if (labels.length < 60) {
        if (
          element.agua != undefined &&
          element.exterior != undefined &&
          element.interior != undefined
        ) {
          //si element.agua.temperatura es menor a 60, se agrega al grafico
          if (element.agua.temperatura < 60 && element.agua.temperatura > 0) {
            if (par == 1) {
              labels.push(
                element.timeStamp.hora + ':' + element.timeStamp.minutos
              );
              tAgua.push(element.agua.temperatura);
              tAmbiente.push(element.exterior.temperatura);
              hAmbiente.push(element.exterior.humedad);
              tInterior.push(element.interior.temperatura);
              hInterior.push(element.interior.humedad);
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
            /* label: 'T° Agua', */
            data: tAgua,
            backgroundColor: 'red',
            /*             yAxisID: 'y',
             */
          },
          {
            /*             label: 'T° Ambiente',
             */ data: tAmbiente,
            backgroundColor: 'blue',
            /*             yAxisID: 'y',
             */
          },
          /* {
            label: 'H° Ambiente',
            data: hAmbiente,
            backgroundColor: 'green',
            yAxisID: 'z',
          }, */
          {
            /*             label: 'T° Interior',
             */ data: tInterior,
            backgroundColor: 'yellow',
            /* yAxisID: 'y', */
          },
          /* {
            label: 'H° Interior',
            data: hInterior,
            backgroundColor: 'orange',
            yAxisID: 'z',
            hoverBackgroundColor: 'red',
          }, */
        ],
      },
      options: {
        aspectRatio: 2,
        responsive: true,
        scales: {
          y: {
            ticks: {
              color: 'red',
              stepSize: 0.2,
            },
            beginAtZero: false,
            /* position: 'top',
            title: {
              display: true,
              text: 'Temperatura (°C)',
              color: 'red',
            }, */
          },
          /* z: {
            beginAtZero: false,
            position: 'left',
            title: {
              display: true,
              text: 'Humedad (%)',
              color: 'green',
            },
          }, */
        },
      },
    });
  }
}
