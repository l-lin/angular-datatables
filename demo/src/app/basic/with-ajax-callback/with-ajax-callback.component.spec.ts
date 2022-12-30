import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithAjaxCallbackComponent } from './with-ajax-callback.component';

describe('WithAjaxCallbackComponent', () => {
  let component: WithAjaxCallbackComponent;
  let fixture: ComponentFixture<WithAjaxCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithAjaxCallbackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithAjaxCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
