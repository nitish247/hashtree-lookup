import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom, catchError } from 'rxjs';
import HashTree, { KeyValuePair } from 'src/hashtree/HashTree';

@Injectable({
  providedIn: 'root'
})
export class HashTreeService {
  private hashTree: HashTree;
  private resultsSubject = new BehaviorSubject<KeyValuePair[]>([]);
  private readonly API_URL = 'http://localhost:3000/data';

  constructor(private http: HttpClient) {
    this.hashTree = new HashTree();
    this.loadInitialData();
  }

  private async loadInitialData(): Promise<void> {
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      });

      const data = await firstValueFrom(
        this.http.get<KeyValuePair[]>(this.API_URL, { headers })
          .pipe(
            catchError(this.handleError)
          )
      );

      if (data) {
        data.forEach(pair => {
          this.hashTree.addToTree(pair);
        });
        console.log('Initial data loaded successfully');
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      this.loadFallbackData();
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // Client-side or network error occurred
      console.error('A client-side or network error occurred:', error.error);
    } else {
      // Backend returned unsuccessful response code
      console.error(
        `Backend returned code ${error.status}, body was:`, 
        error.error
      );
    }
    return Promise.reject(error);
  }

  private loadFallbackData(): void {
    const sampleData = [
      { key: 'apple', value: 'fruit' },
      { key: 'banana', value: 'fruit' },
      { key: 'cat', value: 'animal' }
    ];
    
    sampleData.forEach(pair => {
      this.hashTree.addToTree(pair);
    });
    console.log('Fallback data loaded');
  }

  search(term: string): Observable<KeyValuePair[]> {
    const results: KeyValuePair[] = [];
    this.hashTree.searchTree(term, results);
    this.resultsSubject.next(results);
    return this.resultsSubject.asObservable();
  }
}