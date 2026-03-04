import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { SimpleTableComponent, TableColumn } from './simple-table.component';

describe('SimpleTableComponent', () => {
  let component: SimpleTableComponent;
  let fixture: ComponentFixture<SimpleTableComponent>;

  const mockColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
  ];

  const mockData = [
    { id: 1, name: 'Juan Pérez', email: 'juan@test.com' },
    { id: 2, name: 'María García', email: 'maria@test.com' },
    { id: 3, name: 'Pedro López', email: 'pedro@test.com' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleTableComponent],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.pageSize).toBe(10);
    expect(component.currentPage).toBe(1);
    expect(component.showSearch).toBe(true);
    expect(component.showPagination).toBe(true);
    expect(component.showViewButton).toBe(true);
    expect(component.showEditButton).toBe(true);
    expect(component.showDeleteButton).toBe(false);
  });

  it('should calculate showActions correctly', () => {
    component.showViewButton = true;
    component.showEditButton = false;
    component.showDeleteButton = false;
    expect(component.showActions).toBe(true);

    component.showViewButton = false;
    component.showEditButton = false;
    component.showDeleteButton = false;
    expect(component.showActions).toBe(false);
  });

  it('should display data correctly in client-side mode', () => {
    component.data = mockData;
    component.columns = mockColumns;
    component.serverSide = false;

    component.ngOnChanges({
      data: {
        currentValue: mockData,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    fixture.detectChanges();

    expect(component.paginatedData.length).toBeGreaterThan(0);
  });

  it('should emit dataRequest on init when serverSide is true', () => {
    spyOn(component.dataRequest, 'emit');
    component.serverSide = true;
    component.ngOnInit();

    expect(component.dataRequest.emit).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      sortColumn: '',
      sortDirection: 'desc',
      searchTerm: '',
    });
  });

  it('should emit onView when view button is clicked', () => {
    spyOn(component.onView, 'emit');
    const testItem = mockData[0];

    component.onView.emit(testItem);

    expect(component.onView.emit).toHaveBeenCalledWith(testItem);
  });

  it('should emit onEdit when edit button is clicked', () => {
    spyOn(component.onEdit, 'emit');
    const testItem = mockData[0];

    component.onEdit.emit(testItem);

    expect(component.onEdit.emit).toHaveBeenCalledWith(testItem);
  });

  it('should format cell values correctly using valueGetter', () => {
    const columnWithGetter: TableColumn = {
      key: 'test',
      label: 'Test',
      valueGetter: (row) => row.name.toUpperCase(),
    };

    const result = component.formatCell(mockData[0], columnWithGetter);

    expect(result).toBe('JUAN PÉREZ');
  });

  it('should handle sorting correctly', () => {
    component.serverSide = false;
    component.data = mockData;
    component.columns = mockColumns;

    component.onSort('name');

    expect(component.sortColumn).toBe('name');
    expect(component.sortDirection).toBe('asc');

    component.onSort('name');

    expect(component.sortDirection).toBe('desc');
  });

  it('should calculate total pages correctly', () => {
    component.serverSide = false;
    component.pageSize = 10;
    component.filteredData = new Array(25);

    expect(component.totalPages).toBe(3);
  });

  it('should calculate totalPagesServer correctly', () => {
    component.serverSide = true;
    component.pageSize = 10;
    component.totalRecords = 47;

    expect(component.totalPagesServer).toBe(5);
  });
});
