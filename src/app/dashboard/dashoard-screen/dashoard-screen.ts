import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Header, HeaderUser, PromoConfig } from '../header/header';
import { SideNav, CategoryItem } from '../side-nav/side-nav';
import { Footer } from '../footer/footer';
import { Banner, BannerSlide } from '../banner/banner';
import { ProductScreen } from '../product-screen/product-screen';

@Component({
  selector: 'app-dashoard-screen',
  imports: [CommonModule, Header, SideNav, Footer, Banner, ProductScreen],
  templateUrl: './dashoard-screen.html',
  styleUrl: './dashoard-screen.scss',
})
export class DashoardScreen {

  // ── Header Configuration ──
  brandName = signal('Gromuse');
  searchPlaceholder = signal('Search for Grocery, Stores, Vegetable or Meat');
  cartCount = signal(9);
  currentUser = signal<HeaderUser>({ name: 'Ajith R' });
  promoConfig = signal<PromoConfig | null>({
    icon: '⚡',
    message: 'Order now and get it within',
    highlight: '15 mint!'
  });

  // ── Side Nav State ──
  sideNavOpen = signal(false);
  activeFilterCategory = signal<string | null>(null);

  // ── Categories — derived from product.json ──
  categories = signal<CategoryItem[]>(
    ProductScreen.getCategories(ProductScreen.loadProducts()).map(c => ({
      id: c.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: c.name,
      icon: c.icon,
      itemCount: c.count,
      color: (c as any).color || '#1a4d45'
    }))
  );

  // ── Banner Slides ──
  bannerSlides = signal<BannerSlide[]>([
    {
      subtitle: 'WELCOME TO GROMUSE',
      title: 'STAY HOME & GET YOUR DAILY NEEDS',
      description: 'Fresh vegetables, fruits and groceries delivered to your doorstep. Healthy living starts here.',
      ctaText: 'Shop Now',
      bgColor: 'linear-gradient(135deg, #1a4d45 0%, #1e6b5e 50%, #0d9373 100%)'
    },
    {
      subtitle: 'FRESH DEALS',
      title: 'UP TO 40% OFF ON FRESH FRUITS',
      description: 'Handpicked seasonal fruits straight from the farm. Order now and taste the freshness.',
      ctaText: 'Explore Fruits',
      bgColor: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #059669 100%)'
    },
    {
      subtitle: 'DAILY ESSENTIALS',
      title: 'ORGANIC VEGETABLES JUST FOR YOU',
      description: 'Farm-fresh organic vegetables with no chemicals. Good for your health, great for your family.',
      ctaText: 'View Offers',
      bgColor: 'linear-gradient(135deg, #134e5e 0%, #1a6b6a 50%, #1e8a7a 100%)'
    },
    {
      subtitle: 'LIMITED TIME',
      title: 'FREE DELIVERY ON ORDERS ABOVE ₹499',
      description: 'Stock up your kitchen with premium groceries. Fast delivery, fresh products guaranteed.',
      ctaText: 'Order Now',
      bgColor: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)'
    }
  ]);

  constructor(private router: Router) { }

  // ── Header Event Handlers ──
  onMenuToggle(): void {
    this.sideNavOpen.update(v => !v);
  }

  onSearch(query: string): void {
    console.log('Search query:', query);
  }

  onCartClick(): void {
    console.log('Cart clicked');
  }

  onAvatarClick(): void {
    console.log('Avatar clicked');
  }

  // ── Side Nav Event Handlers ──
  onCategorySelect(category: CategoryItem): void {
    // If same category clicked again, clear filter
    if (this.activeFilterCategory() === category.name) {
      this.activeFilterCategory.set(null);
    } else {
      this.activeFilterCategory.set(category.name);
    }
    this.sideNavOpen.set(false);
  }

  onSideNavClose(): void {
    this.sideNavOpen.set(false);
  }

  clearFilter(): void {
    this.activeFilterCategory.set(null);
  }
}
