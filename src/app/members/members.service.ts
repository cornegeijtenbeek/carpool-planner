import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { Member } from './member.interface';
import { environment } from '../../environments/environment';

@Service()
export class MembersService {
  private readonly http = inject(HttpClient);

  get() {
    return firstValueFrom(this.http.get<Member[]>(`${environment.apiUrl}/members`));
  }
}
