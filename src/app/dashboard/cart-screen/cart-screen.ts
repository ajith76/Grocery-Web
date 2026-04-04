import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-screen',
  imports: [CommonModule],
  templateUrl: './cart-screen.html',
  styleUrl: './cart-screen.scss',
})
export class CartScreen {
  /** The cart items with product info and quantity */
  cartItems = input<{product: any, quantity: number}[]>([]);

  /** Emit changes in quantity from the cart screen */
  cartChange = output<{product: any, delta: number}>();

  cartTotal = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  });

  totalItems = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  });

  updateQuantity(product: any, delta: number): void {
     this.cartChange.emit({product, delta});
  }

  removeItem(product: any, currentQty: number): void {
     this.cartChange.emit({product, delta: -currentQty});
  }
}
