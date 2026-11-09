import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface CarpoolRoute {
  id: string;
  from: [number, number];
  to: [number, number];
  color: string;
}

@Service()
export class RoutesService {
  private readonly http = inject(HttpClient);

  getRoutes(): Promise<CarpoolRoute[]> {
    return firstValueFrom(this.http.get<CarpoolRoute[]>('http://localhost:3000/routes'));
  }
}
