import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/** Represents a grocery category item */
export interface CategoryItem {
  id: string;
  name: string;
  icon: string;        // emoji icon
  itemCount?: number;  // optional count of products
  color?: string;      // optional accent color override
}

@Component({
  selector: 'app-side-nav',
  imports: [CommonModule, FormsModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
})
export class SideNav {

  // ── Inputs ──
  categories = input<CategoryItem[]>([]);
  isOpen = input<boolean>(true);
  title = input<string>('Categories');
  activeFilter = input<string | null>(null);

  // ── Internal State ──
  searchQuery = signal('');

  // ── Outputs ──
  categorySelect = output<CategoryItem>();
  closeNav = output<void>();

  // ── Computed ──
  filteredCategories = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const cats = this.categories();
    if (!query) return cats;
    return cats.filter(c => c.name.toLowerCase().includes(query));
  });

  totalProducts = computed(() => {
    return this.categories().reduce((sum, c) => sum + (c.itemCount || 0), 0);
  });

  // ── Methods ──
  selectCategory(category: CategoryItem): void {
    this.categorySelect.emit(category);
  }

  onClose(): void {
    this.closeNav.emit();
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }
}
