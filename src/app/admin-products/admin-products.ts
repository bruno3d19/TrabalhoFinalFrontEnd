import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ProductAnalytics {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
  profit: number;
  views: number;
  conversionRate: number;
}

interface CategoryData { name: string; value: number; }

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {
  activeTab = 'overview';

  productAnalytics:       ProductAnalytics[] = [];
  topSellingProducts:     ProductAnalytics[] = [];
  mostProfitableProducts: ProductAnalytics[] = [];
  lowPerformingProducts:  ProductAnalytics[] = [];
  categoryData:           CategoryData[]     = [];

  chartColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  get totalUnitsSold(): number { return this.productAnalytics.reduce((s, p) => s + p.quantitySold, 0); }
  get totalRevenue():   number { return this.productAnalytics.reduce((s, p) => s + p.revenue, 0); }

  constructor(private router: Router) {}

  ngOnInit(): void { this.loadData(); }

  goBack(): void { this.router.navigate(['/admin']); }

  getBarPct(qty: number): number {
    const max = Math.max(...this.productAnalytics.map(p => p.quantitySold), 1);
    return (qty / max) * 100;
  }

  getCatPct(value: number): number {
    const total = this.categoryData.reduce((s, c) => s + c.value, 0);
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  getMargin(p: ProductAnalytics): string {
    return p.revenue > 0 ? ((p.profit / p.revenue) * 100).toFixed(1) : '0';
  }

  private loadData(): void {
    this.productAnalytics = [
      { productId: '1', productName: 'X-Burguer Especial',  quantitySold: 142, revenue: 2556, profit: 890,  views: 430, conversionRate: 33.0 },
      { productId: '2', productName: 'Pizza Margherita',    quantitySold: 98,  revenue: 1960, profit: 720,  views: 310, conversionRate: 31.6 },
      { productId: '3', productName: 'Batata Frita Grande', quantitySold: 87,  revenue: 783,  profit: 350,  views: 280, conversionRate: 31.1 },
      { productId: '4', productName: 'Hot Dog Tradicional', quantitySold: 54,  revenue: 810,  profit: 270,  views: 200, conversionRate: 27.0 },
      { productId: '5', productName: 'Refrigerante 350ml',  quantitySold: 201, revenue: 1005, profit: 400,  views: 520, conversionRate: 38.7 },
      { productId: '6', productName: 'Sorvete de Creme',    quantitySold: 22,  revenue: 330,  profit: 110,  views: 310, conversionRate: 7.1  },
    ];

    this.topSellingProducts = [...this.productAnalytics].sort((a, b) => b.quantitySold - a.quantitySold);
    this.mostProfitableProducts = [...this.productAnalytics].sort((a, b) => b.profit - a.profit);
    this.lowPerformingProducts = this.productAnalytics.filter(p => p.conversionRate < 10);

    // Category aggregation (simple keyword-based)
    const categoryMap = new Map<string, number>();
    for (const p of this.productAnalytics) {
      const cat = p.productName.toLowerCase().includes('burger') || p.productName.toLowerCase().includes('burguer') ? 'Burgers'
                : p.productName.toLowerCase().includes('pizza') ? 'Pizzas'
                : p.productName.toLowerCase().includes('batata') ? 'Acompanhamentos'
                : p.productName.toLowerCase().includes('hot dog') ? 'Lanches'
                : p.productName.toLowerCase().includes('refrigerante') ? 'Bebidas'
                : 'Sobremesas';
      categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + p.quantitySold);
    }
    this.categoryData = [...categoryMap.entries()].map(([name, value]) => ({ name, value }));
  }
}
