import { Component } from '@angular/core';
import { KeyValuePair } from 'src/hashtree/HashTree';
import { HashTreeService } from 'src/services/HashTreeService';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchTerm = '';
  results: KeyValuePair[] = [];
  isLoading = false;

  constructor(private hashTreeService: HashTreeService) {}

  onSearch(): void {
    if (!this.searchTerm.trim()) return;
    
    this.isLoading = true;
    this.hashTreeService.search(this.searchTerm)
      .subscribe({
        next: (results) => {
          this.results = results;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.isLoading = false;
        }
      });
  }
}