import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import type { Member } from './member.interface';

@Service()
export class MembersService {
  private readonly http = inject(HttpClient);

  get() {
    return firstValueFrom(this.http.get<Member[]>('http://localhost:3000/members'));
  }
}
