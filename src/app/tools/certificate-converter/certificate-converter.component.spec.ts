import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateConverterComponent } from './certificate-converter.component';

describe('CertificateConverterComponent', () => {
  let component: CertificateConverterComponent;
  let fixture: ComponentFixture<CertificateConverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateConverterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
