import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { User } from "@models/user.model";
import { Observable } from "rxjs";
import { API_URL } from "src/main";

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  public constructor() {

  }

  public getUserByFirebaseUuid(firebaseUuid: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/firebase-uuid/${firebaseUuid}`);
  }
}