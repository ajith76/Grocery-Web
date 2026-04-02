import { Component, signal, computed, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import productData from './product.json';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  weight: string;
  rating: number;
  reviews: number;
  brand: string;
  discount: number;
  bgColor: string;
}

@Component({
  selector: 'app-product-screen',
  imports: [CommonModule],
  templateUrl: './product-screen.html',
  styleUrl: './product-screen.scss',
})
export class ProductScreen implements OnInit {

  // ── Inputs ──
  /** Active category filter — null means show all */
  filterCategory = input<string | null>(null);

  // ── State ──
  allProducts = signal<Product[]>([]);
  showAll = signal(false);
  displayLimit = 12;

  // ── Computed ──
  filteredProducts = computed(() => {
    const products = this.allProducts();
    const filter = this.filterCategory();
    if (!filter) return products;
    return products.filter(p => p.category === filter);
  });

  displayedProducts = computed(() => {
    const products = this.filteredProducts();
    return this.showAll() ? products : products.slice(0, this.displayLimit);
  });

  totalFiltered = computed(() => this.filteredProducts().length);
  hasMore = computed(() => this.filteredProducts().length > this.displayLimit);

  /** Extract unique categories from product data */
  static getCategories(products: Product[]): { name: string; count: number; icon: string }[] {
    const iconMap: Record<string, string> = {
      'Fruits': '🍎',
      'Vegetables': '🥦',
      'Dairy & Eggs': '🥛',
      'Bakery': '🍞',
      'Chocolate & Sweets': '🍫',
      'Beverages': '🥤',
      'Snacks & Chips': '🍿',
      'Nuts & Seeds': '🥜',
      'Meat & Fish': '🥩',
      'Frozen Foods': '🧊',
      'Spices & Herbs': '🌶️',
      'Rice & Grains': '🌾',
      'Oils & Ghee': '🫒',
      'Personal Care': '🧴',
      'Household': '🏠'
    };
    const colorMap: Record<string, string> = {
      'Fruits': '#e74c3c',
      'Vegetables': '#27ae60',
      'Dairy & Eggs': '#3498db',
      'Bakery': '#e67e22',
      'Chocolate & Sweets': '#8b5cf6',
      'Beverages': '#06b6d4',
      'Snacks & Chips': '#f59e0b',
      'Nuts & Seeds': '#a16207',
      'Meat & Fish': '#dc2626',
      'Frozen Foods': '#0ea5e9',
      'Spices & Herbs': '#ef4444',
      'Rice & Grains': '#92400e',
      'Oils & Ghee': '#65a30d',
      'Personal Care': '#ec4899',
      'Household': '#6366f1'
    };

    const catMap = new Map<string, number>();
    products.forEach(p => {
      catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
    });

    return Array.from(catMap.entries()).map(([name, count]) => ({
      name,
      count,
      icon: iconMap[name] || '📦',
      color: colorMap[name] || '#1a4d45'
    }));
  }

  static loadProducts(): Product[] {
    return productData.featured as Product[];
  }

  ngOnInit(): void {
    this.allProducts.set(ProductScreen.loadProducts());
  }

  toggleSeeAll(): void {
    this.showAll.update(v => !v);
  }

  onAddToCart(product: Product): void {
    console.log('Added to cart:', product.name);
  }

  onWishlist(product: Product): void {
    console.log('Wishlist toggled:', product.name);
  }

  getStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating) ? 1 : 0);
  }
}
