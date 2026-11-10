import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OlMap } from './ol-map';

describe('OlMap', () => {
  let component: OlMap;
  let fixture: ComponentFixture<OlMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OlMap],
    }).compileComponents();

    fixture = TestBed.createComponent(OlMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
