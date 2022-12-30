import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewServerSideComponent } from './new-server-side.component';

describe('NewServerSideComponent', () => {
  let component: NewServerSideComponent;
  let fixture: ComponentFixture<NewServerSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewServerSideComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewServerSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
