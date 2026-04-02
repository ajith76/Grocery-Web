import { Component, signal, OnInit, OnDestroy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BannerSlide {
  subtitle: string;
  title: string;
  description: string;
  ctaText: string;
  bgColor: string;
}

@Component({
  selector: 'app-banner',
  imports: [CommonModule],
  templateUrl: './banner.html',
  styleUrl: './banner.scss',
})
export class Banner implements OnInit, OnDestroy {

  // ── Inputs ──
  slides = input<BannerSlide[]>([]);
  intervalMs = input<number>(4000);

  // ── State ──
  activeIndex = signal(0);
  isTransitioning = signal(false);

  private timer: any = null;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide(): void {
    this.timer = setInterval(() => {
      this.nextSlide();
    }, this.intervalMs());
  }

  stopAutoSlide(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  nextSlide(): void {
    const total = this.slides().length;
    if (total === 0) return;
    this.isTransitioning.set(true);
    setTimeout(() => {
      this.activeIndex.update(i => (i + 1) % total);
      this.isTransitioning.set(false);
    }, 500);
  }

  goToSlide(index: number): void {
    if (index === this.activeIndex()) return;
    this.stopAutoSlide();
    this.isTransitioning.set(true);
    setTimeout(() => {
      this.activeIndex.set(index);
      this.isTransitioning.set(false);
      this.startAutoSlide();
    }, 500);
  }

  onCtaClick(): void {
    console.log('CTA clicked on slide:', this.activeIndex());
  }
}
