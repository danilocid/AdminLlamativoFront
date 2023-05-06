import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { FormatDataTableGlobal } from 'src/app/shared/constants';
import { Sale } from 'src/app/shared/models/sale.model';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {};
  ventas: Sale[] = [];
  date = new Date();

  constructor() {}

  ngOnInit(): void {
    this.dtOptions = FormatDataTableGlobal();

    this.ventas = [
      {
        id: 1,
        monto_neto: 1000,
        monto_imp: 190,
        tipo_documento: 'Factura',
        n_documento: 1,
        cliente: 'Juan Perez',
        medio_pago: 'Efectivo',
        fecha: '2018-01-01',
        usuario: 'admin',
      },
      {
        id: 2,
        monto_neto: 2000,
        monto_imp: 380,
        tipo_documento: 'Factura',
        n_documento: 2,
        cliente: 'Maria Lopez',
        medio_pago: 'Efectivo',
        fecha: '2018-01-02',
        usuario: 'admin',
      },
    ];
    this.dtTrigger.next(this.dtOptions);
  }
}
