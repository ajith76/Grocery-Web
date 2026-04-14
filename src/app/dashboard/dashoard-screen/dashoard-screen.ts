import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Header, HeaderUser, PromoConfig } from '../header/header';
import { SideNav, CategoryItem } from '../side-nav/side-nav';
import { Footer } from '../footer/footer';
import { Banner, BannerSlide } from '../banner/banner';
import { ProductScreen } from '../product-screen/product-screen';
import { CartScreen } from '../cart-screen/cart-screen';
import { ProfileDetails } from '../profile-details/profile-details';
import { ApiService } from '../../api/api-service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-dashoard-screen',
  imports: [CommonModule, Header, SideNav, Footer, Banner, ProductScreen, CartScreen, ProfileDetails],
  templateUrl: './dashoard-screen.html',
  styleUrl: './dashoard-screen.scss',
})
export class DashoardScreen implements OnInit {
  private apiService = inject(ApiService);
  allProducts = signal<Product[]>([]);

  // ── Header Configuration ──
  brandName = signal('Gromuse');
  searchPlaceholder = signal('Search for Grocery, Stores, Vegetable or Meat');
  currentUser = signal<HeaderUser>({ name: 'Ajith R' });
  promoConfig = signal<PromoConfig | null>({
    icon: '⚡',
    message: 'Order now and get it within',
    highlight: '15 mint!'
  });

  // ── Side Nav State ──
  sideNavOpen = signal(false);
  activeFilterCategories = signal<string[]>([]);

  // ── Wishlist State ──
  wishlistIds = signal<string[]>([]);
  showingWishlist = signal(false);

  // ── Profile State ──
  showingProfile = signal(false);


  // ── Categories — derived from products ──
  categories = computed<CategoryItem[]>(() => {
    const products = this.allProducts();
    return ProductScreen.getCategories(products).map(c => ({
      id: c.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: c.name,
      icon: c.icon,
      itemCount: c.count,
      color: (c as any).color || '#1a4d45'
    }));
  });

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

  // ── Search State ──
  searchQuery = signal<string | null>(null);

  // ── Cart State ──
  cartItemsMap = signal<Record<string, number>>({});
  showingCart = signal(false);

  // ── Computed ──
  cartCount = computed(() => {
    return Object.values(this.cartItemsMap()).reduce((sum, qty) => sum + qty, 0);
  });

  cartItemsData = computed(() => {
    const allProducts = this.allProducts();
    const map = this.cartItemsMap();
    return Object.entries(map).map(([code, qty]) => {
       return { product: allProducts.find(p => p.product_code === code)!, quantity: qty };
    }).filter(x => x.product);
  });

  ngOnInit(): void {
    this.apiService.getProducts().subscribe({
      next: (products) => {
        const data = Array.isArray(products) ? products : (products as any).featured;
        if (data) {
          this.allProducts.set(data);
        }
      },
      error: (err) => console.error('Failed to load products:', err)
    });
  }

  constructor(private router: Router) { }

  // ── Header Event Handlers ──
  onMenuToggle(): void {
    this.sideNavOpen.update(v => !v);
  }

  onSearch(query: string): void {
    console.log('Search query:', query);
    this.searchQuery.set(query || null);
  }

  onCartClick(): void {
    this.showingCart.set(true);
    this.showingWishlist.set(false);
    this.showingProfile.set(false);
  }

  onProfileClick(): void {
    this.showingProfile.set(true);
    this.showingCart.set(false);
    this.showingWishlist.set(false);
    this.sideNavOpen.set(false);
  }


  onAvatarClick(): void {
    console.log('Avatar clicked');
  }

  onHeaderWishlistClick(): void {
    this.showingWishlist.set(true);
    this.showingCart.set(false);
    this.showingProfile.set(false);
  }


  // ── Side Nav Event Handlers ──
  onCategorySelect(category: CategoryItem): void {
    const current = this.activeFilterCategories();
    if (current.includes(category.name)) {
      this.activeFilterCategories.set(current.filter(c => c !== category.name));
    } else {
      this.activeFilterCategories.set([...current, category.name]);
    }
    this.showingWishlist.set(false);
    this.showingCart.set(false);
    this.showingProfile.set(false);
    this.sideNavOpen.set(false);
  }


  removeCategoryFilter(categoryName: string): void {
    const current = this.activeFilterCategories();
    this.activeFilterCategories.set(current.filter(c => c !== categoryName));
  }

  onSideNavClose(): void {
    this.sideNavOpen.set(false);
  }

  clearFilter(): void {
    this.activeFilterCategories.set([]);
    this.showingWishlist.set(false);
    this.showingCart.set(false);
    this.showingProfile.set(false);
  }


  // ── Product Event Handlers ──
  onWishlistToggle(product: Product): void {
    const current = this.wishlistIds();
    if (current.includes(product.product_code)) {
      this.wishlistIds.set(current.filter(code => code !== product.product_code));
    } else {
      this.wishlistIds.set([...current, product.product_code]);
    }
  }

  onCartChange(event: {product: Product, delta: number}): void {
    const { product, delta } = event;
    const current = { ...this.cartItemsMap() };
    const currentQty = current[product.product_code] || 0;
    const newQty = currentQty + delta;
    
    if (newQty <= 0) {
      delete current[product.product_code];
    } else {
      current[product.product_code] = newQty;
    }
    this.cartItemsMap.set(current);
  }
}
