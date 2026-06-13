import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
}

interface HistoricalDataItem {
  date: Date;
  revenue: number;
  orders: number;
}

interface ProductAnalytics {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
  profit: number;
  views: number;
  conversionRate: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  dateRange: 'today' | 'week' | 'month' = 'month';

  // Financial KPIs
  totalRevenue = 0;
  totalOrders = 0;
  avgTicket = 0;
  netProfit = 0;
  profitMargin = 0;
  revenueGrowth = 0;
  ordersGrowth = 0;

  // Customers
  customersCount = 0;
  vipCount = 0;
  recurringCount = 0;

  // Data
  historicalData: HistoricalDataItem[] = [];
  topSellingProducts: ProductAnalytics[] = [];
  alerts: Alert[] = [];

  private maxRevenue = 1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  setDateRange(range: 'today' | 'week' | 'month'): void {
    this.dateRange = range;
    this.loadMockData();
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  absValue(n: number): number {
    return Math.abs(n);
  }

  getBarHeight(revenue: number): number {
    return this.maxRevenue > 0 ? (revenue / this.maxRevenue) * 100 : 0;
  }

  private loadMockData(): void {
    // Generate mock historical data (last 30 days)
    const today = new Date();
    this.historicalData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (29 - i));
      const revenue = Math.random() * 800 + 200;
      return { date, revenue, orders: Math.floor(Math.random() * 20 + 5) };
    });

    this.maxRevenue = Math.max(...this.historicalData.map(d => d.revenue));

    // Aggregate based on range
    let filteredData = this.historicalData;
    if (this.dateRange === 'today') filteredData = this.historicalData.slice(-1);
    if (this.dateRange === 'week') filteredData = this.historicalData.slice(-7);

    this.totalRevenue = filteredData.reduce((s, d) => s + d.revenue, 0);
    this.totalOrders = filteredData.reduce((s, d) => s + d.orders, 0);
    this.avgTicket = this.totalOrders > 0 ? this.totalRevenue / this.totalOrders : 0;
    this.netProfit = this.totalRevenue * 0.3;
    this.profitMargin = 30;
    this.ordersGrowth = 8.5;
    this.revenueGrowth = 12.3;

    // Customers
    this.customersCount = Math.floor(this.totalOrders * 0.75);
    this.vipCount = Math.floor(this.customersCount * 0.1);
    this.recurringCount = Math.floor(this.customersCount * 0.4);

    // Top products
    this.topSellingProducts = [
      { productId: '1', productName: 'X-Burguer Especial', quantitySold: 142, revenue: 2556, profit: 890, views: 430, conversionRate: 33 },
      { productId: '2', productName: 'Pizza Margherita', quantitySold: 98, revenue: 1960, profit: 720, views: 310, conversionRate: 31.6 },
      { productId: '3', productName: 'Batata Frita Grande', quantitySold: 87, revenue: 783, profit: 350, views: 280, conversionRate: 31.1 },
    ];

    // Alerts
    this.alerts = this.totalRevenue > 3000
      ? []
      : [{ id: '1', type: 'warning', title: 'Receita abaixo da média', description: 'As vendas estão abaixo do esperado para o período.' }];
  }
}
