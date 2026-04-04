import { Component, input, signal, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

/** Represents a user profile displayed in the header avatar */
export interface HeaderUser {
  name: string;
  avatarUrl?: string;
}

/** Configuration for the promotional banner in the header */
export interface PromoConfig {
  icon: string;
  message: string;
  highlight: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  // ── Configurable Inputs ──
  /** Brand/logo name displayed in the header */
  brandName = input<string>('Gromuse');

  /** Search bar placeholder text */
  searchPlaceholder = input<string>('Search for Grocery, Stores, Vegetable or Meat');

  /** Number of items in the cart (badge count) */
  cartCount = input<number>(0);

  /** Number of items in the wishlist (badge count) */
  wishlistCount = input<number>(0);

  /** User profile for the avatar */
  user = input<HeaderUser>({ name: 'User' });

  /** Promotional banner config — set to null to hide */
  promo = input<PromoConfig | null>({
    icon: '⚡',
    message: 'Order now and get it within',
    highlight: '15 mint!'
  });

  /** Route the logo links to */
  logoRoute = input<string>('/dashboard');

  // ── Internal State ──
  searchQuery = signal('');

  // ── Computed ──
  avatarUrl = computed(() => {
    const u = this.user();
    if (u.avatarUrl) return u.avatarUrl;
    const encoded = encodeURIComponent(u.name);
    return `https://ui-avatars.com/api/?name=${encoded}&background=f97316&color=fff&size=36&bold=true`;
  });

  // ── Outputs ──
  /** Emitted when hamburger menu is clicked */
  menuToggle = output<void>();

  /** Emitted when a search is submitted (Enter key or search icon click) */
  searchSubmit = output<string>();

  /** Emitted when the cart button is clicked */
  cartClick = output<void>();

  /** Emitted when the user avatar is clicked */
  avatarClick = output<void>();

  /** Emitted when the wishlist button is clicked */
  wishlistClick = output<void>();

  // ── Methods ──
  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onSearch(): void {
    const query = this.searchQuery().trim();
    this.searchSubmit.emit(query);
  }

  onCartClick(): void {
    this.cartClick.emit();
    window.scrollTo(0, 0);
  }

  onAvatarClick(): void {
    this.avatarClick.emit();
  }

  onWishlistClick(): void {
    this.wishlistClick.emit();
    window.scrollTo(0, 0);
  }
}
