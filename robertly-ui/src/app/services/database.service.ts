import { Injectable } from '@angular/core';
import { Database } from '../app.database';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  public db: Database | null = null;

  public constructor() {}

  public init(userUuid: string) {
    this.db = new Database(userUuid);
  }
}
