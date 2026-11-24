import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DestinationSearch } from './destination-search';

describe('DestinationSearch', () => {
  let component: DestinationSearch;
  let fixture: ComponentFixture<DestinationSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinationSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(DestinationSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('#destination');
  }

  function getForm(): HTMLFormElement {
    return fixture.nativeElement.querySelector('form');
  }

  function getError(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.destination-search__error');
  }

  function setInputValue(value: string) {
    const input = getInput();
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show an error before the field is touched', () => {
    expect(getError()).toBeNull();
  });

  it('should show an error after the field is touched and left empty', () => {
    // Act
    getInput().dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    // Assert
    expect(getError()).not.toBeNull();
  });

  it('should show an error when the value does not match the coordinate pattern', () => {
    // Act
    setInputValue('not a coordinate');
    getInput().dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    // Assert
    expect(getError()).not.toBeNull();
  });

  it('should not show an error for a valid "longitude, latitude" value', () => {
    // Act
    setInputValue('4.895168, 52.370216');
    getInput().dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    // Assert
    expect(getError()).toBeNull();
  });

  it('should not emit search when the form is invalid', () => {
    // Arrange
    const searchSpy = vi.fn();
    component.search.subscribe(searchSpy);

    // Act
    getForm().dispatchEvent(new Event('submit', { cancelable: true }));

    // Assert
    expect(searchSpy).not.toHaveBeenCalled();
  });

  it('should emit the parsed coordinate when the form is valid', () => {
    // Arrange
    const searchSpy = vi.fn();
    component.search.subscribe(searchSpy);

    // Act
    setInputValue('4.895168, 52.370216');
    getForm().dispatchEvent(new Event('submit', { cancelable: true }));

    // Assert
    expect(searchSpy).toHaveBeenCalledWith([4.895168, 52.370216]);
  });

  it('should trim whitespace around each coordinate value', () => {
    // Arrange
    const searchSpy = vi.fn();
    component.search.subscribe(searchSpy);

    // Act
    setInputValue('  4.895168 ,  52.370216  ');
    getForm().dispatchEvent(new Event('submit', { cancelable: true }));

    // Assert
    expect(searchSpy).toHaveBeenCalledWith([4.895168, 52.370216]);
  });
});
