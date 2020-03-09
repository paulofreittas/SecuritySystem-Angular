import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';
import { System } from '../models/system';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  private readonly PATH: string = 'system';

  searchSystemEvent = new EventEmitter<any>();
  clearFormEvent = new EventEmitter();

  constructor(private http: HttpClient) { }

  getSystemsWithFilter(description: string, initials: string, email: string, page: number): Observable<any> {
    let query = "?page=" + page;

    if (description)
      query = query + "&description=" + description;

    if (initials)
      query = query + "&initials=" + initials;

    if (email)
      query = query + "&email=" + email;

    let result = this.http.get(env.baseApiUrl + this.PATH + "/filter" + query);
    return result;
  }

  getSystemById(id: string): Observable<any> {
    return this.http.get<System>(env.baseApiUrl + this.PATH + "/" + id);
  }

  update(system: System): Observable<any> {
    return this.http.put<System>(env.baseApiUrl + this.PATH, system);
  }

  save(system: System): Observable<any> {
    return this.http.post<System>(env.baseApiUrl + this.PATH, system);
  }

  getSystems(page: number): Observable<any> {
    let result = this.http.get(env.baseApiUrl + this.PATH + "?page=" + page);
    return result;
  }

  eventEmit(result: Observable<any>): void {
    this.searchSystemEvent.emit(result);
  }
}
