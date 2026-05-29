import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedOfficesComponent } from './deleted-offices.component';

describe('DeletedOfficesComponent', () => {
  let component: DeletedOfficesComponent;
  let fixture: ComponentFixture<DeletedOfficesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletedOfficesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletedOfficesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
