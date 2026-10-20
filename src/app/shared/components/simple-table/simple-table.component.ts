import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { ListState } from 'src/app/shared/services/list-state.service';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'currency';
  format?: (value: any, row: any) => string;
  valueGetter?: (row: any) => any;
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc';
}

export interface PageEvent {
  page: number;
  pageSize: number;
}

export interface DataRequestEvent {
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: 'asc' | 'desc' | '';
  searchTerm: string;
}

@Component({
  standalone: false,
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./simple-table.component.scss'],
})
export class SimpleTableComponent implements OnChanges, OnInit {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() pageSize = 10;
  @Input() showSearch = true;
  @Input() showPagination = true;
  @Input() showPageSize = true;
  @Input() showViewButton = true;
  @Input() showEditButton = true;
  @Input() showDeleteButton = false;
  @Input() rowLink?: (row: any) => string;

  get showActions(): boolean {
    return this.showViewButton || this.showEditButton || this.showDeleteButton;
  }
  @Input() emptyMessage = 'No hay datos disponibles';
  @Input() trackByKey = 'id';

  // Server-side pagination
  @Input() serverSide = false;
  @Input() totalRecords = 0;
  @Input() loading = false;

  /**
   * Estado a restaurar al iniciar la tabla (página, orden, búsqueda, pageSize).
   * Usado para mantener el estado del listado al volver desde una vista de detalle.
   */
  @Input() initialState: ListState | null = null;

  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<SortEvent>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() dataRequest = new EventEmitter<DataRequestEvent>();
  /** Emite el estado actual de la tabla (página, orden, búsqueda) tras cada cambio */
  @Output() stateChange = new EventEmitter<ListState>();

  searchTerm = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'desc';
  currentPage = 1;

  filteredData: any[] = [];
  paginatedData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      if (this.serverSide) {
        // En modo server-side, los datos ya vienen paginados
        this.paginatedData = this.data;
        this.filteredData = this.data;
      } else {
        this.applyFilters();
      }
    }

    // Si la página actual quedó fuera de rango (dato eliminado o estado
    // restaurado con una página ya inexistente), se salta a la última válida
    if (changes['data']) {
      const maxPage = this.serverSide ? this.totalPagesServer : this.totalPages;
      if (maxPage > 0 && this.currentPage > maxPage) {
        this.goToPage(maxPage);
      }
    }
  }

  ngOnInit(): void {
    this.applyInitialState();

    if (this.serverSide) {
      setTimeout(() => this.requestData(), 0);
    } else if (this.initialState) {
      this.applyFilters();
    }
  }

  private applyInitialState(): void {
    const state = this.initialState;
    if (!state) {
      return;
    }

    if (typeof state.page === 'number' && state.page >= 1) {
      this.currentPage = state.page;
    }
    if ([10, 25, 50, 100].includes(state.pageSize as number)) {
      this.pageSize = state.pageSize as number;
    }
    if (state.sortColumn) {
      this.sortColumn = state.sortColumn;
    }
    if (state.sortDirection === 'asc' || state.sortDirection === 'desc') {
      this.sortDirection = state.sortDirection;
    }
    if (state.searchTerm) {
      this.searchTerm = state.searchTerm;
    }
  }

  private requestData(): void {
    this.dataRequest.emit({
      page: this.currentPage,
      pageSize: this.pageSize,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      searchTerm: this.searchTerm,
    });
  }

  trackByFn = (index: number, item: any) => {
    return item[this.trackByKey] ?? index;
  };

  onSearch(): void {
    this.currentPage = 1;
    if (this.serverSide) {
      this.requestData();
    } else {
      this.applyFilters();
    }
    this.emitState();
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortChange.emit({ column, direction: this.sortDirection });
    if (this.serverSide) {
      this.requestData();
    } else {
      this.applyFilters();
    }
    this.emitState();
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.pageChange.emit({ page: this.currentPage, pageSize: this.pageSize });
    if (this.serverSide) {
      this.requestData();
    } else {
      this.applyFilters();
    }
    this.emitState();
  }

  goToPage(page: number): void {
    const maxPages = this.serverSide ? this.totalPagesServer : this.totalPages;
    if (page >= 1 && page <= maxPages) {
      this.currentPage = page;
      this.pageChange.emit({ page: this.currentPage, pageSize: this.pageSize });
      if (this.serverSide) {
        this.requestData();
      } else {
        this.applyFilters();
      }
      this.emitState();
    }
  }

  private emitState(): void {
    this.stateChange.emit({
      page: this.currentPage,
      pageSize: this.pageSize,
      sortColumn: this.sortColumn,
      sortDirection: this.sortDirection,
      searchTerm: this.searchTerm,
    });
  }

  private applyFilters(): void {
    let result = [...this.data];

    // Filtrar por búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter((row) =>
        this.columns.some((col) => {
          const value = this.getNestedValue(row, col.key);
          return value?.toString().toLowerCase().includes(term);
        }),
      );
    }

    // Ordenar
    if (this.sortColumn) {
      result.sort((a, b) => {
        const valueA = this.getNestedValue(a, this.sortColumn);
        const valueB = this.getNestedValue(b, this.sortColumn);

        let comparison = 0;
        if (valueA == null) comparison = 1;
        else if (valueB == null) comparison = -1;
        else if (valueA < valueB) comparison = -1;
        else if (valueA > valueB) comparison = 1;

        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    this.filteredData = result;

    // Paginar
    const start = (this.currentPage - 1) * this.pageSize;
    this.paginatedData = result.slice(start, start + this.pageSize);
  }

  formatCell(row: any, col: TableColumn): string {
    // Si hay valueGetter, usarlo para obtener el valor
    if (col.valueGetter) {
      const result = col.valueGetter(row);
      return result == null ? '' : String(result);
    }

    const value = this.getNestedValue(row, col.key);

    if (col.format) {
      return col.format(value, row);
    }

    if (value == null) return '';

    switch (col.type) {
      case 'currency':
        return new Intl.NumberFormat('es-CL', {
          style: 'currency',
          currency: 'CLP',
        }).format(value);
      case 'date':
        return new Date(value).toLocaleDateString('es-CL');
      case 'number':
        return new Intl.NumberFormat('es-CL').format(value);
      default:
        return String(value);
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => o?.[key], obj);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get totalPagesServer(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  get lastPage(): number {
    return this.serverSide ? this.totalPagesServer : this.totalPages;
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    if (this.serverSide) {
      return Math.min(this.startIndex + this.pageSize, this.totalRecords);
    }
    return Math.min(this.startIndex + this.pageSize, this.filteredData.length);
  }

  get totalCount(): number {
    return this.serverSide ? this.totalRecords : this.filteredData.length;
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const total = this.serverSide ? this.totalPagesServer : this.totalPages;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
