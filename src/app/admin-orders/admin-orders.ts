import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface DayData   { day: string; orders: number; revenue: number; }
interface HourData  { hour: number; orders: number; }
interface StatusRow { label: string; count: number; color: string; }

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  deliveredOrders  = 0;
  preparingOrders  = 0;
  pendingOrders    = 0;
  deliveringOrders = 0;
  avgPreparationTime = 0;

  totalOrders = 0;

  ordersByDay: DayData[]  = [];
  peakHours:   HourData[] = [];

  get deliveredPct(): string {
    return this.totalOrders > 0
      ? ((this.deliveredOrders / this.totalOrders) * 100).toFixed(0)
      : '0';
  }

  get maxDayOrders():   number { return Math.max(...this.ordersByDay.map(d => d.orders), 1); }
  get maxDayRevenue():  number { return Math.max(...this.ordersByDay.map(d => d.revenue), 1); }
  get maxHourOrders():  number { return Math.max(...this.peakHours.map(h => h.orders), 1); }

  get lowDemandHours(): HourData[] {
    return this.peakHours.filter(h => h.orders < 3).slice(0, 5);
  }

  get topHours(): HourData[] {
    return [...this.peakHours].sort((a, b) => b.orders - a.orders).slice(0, 5);
  }

  statusData: StatusRow[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadMockData();
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  scaleBar(value: number, max: number, maxPx: number): number {
    return max > 0 ? Math.max((value / max) * maxPx, 4) : 4;
  }

  getPct(count: number): string {
    return this.totalOrders > 0
      ? ((count / this.totalOrders) * 100).toFixed(0)
      : '0';
  }

  private loadMockData(): void {
    this.deliveredOrders  = 87;
    this.preparingOrders  = 4;
    this.pendingOrders    = 2;
    this.deliveringOrders = 6;
    this.avgPreparationTime = 18;
    this.totalOrders = this.deliveredOrders + this.preparingOrders + this.pendingOrders + this.deliveringOrders;

    this.ordersByDay = [
      { day: 'Seg', orders: 12, revenue: 640 },
      { day: 'Ter', orders: 9,  revenue: 480 },
      { day: 'Qua', orders: 15, revenue: 810 },
      { day: 'Qui', orders: 11, revenue: 595 },
      { day: 'Sex', orders: 22, revenue: 1190 },
      { day: 'Sáb', orders: 28, revenue: 1540 },
      { day: 'Dom', orders: 19, revenue: 1020 },
    ];

    this.peakHours = [
      { hour: 10, orders: 2 }, { hour: 11, orders: 4 }, { hour: 12, orders: 12 },
      { hour: 13, orders: 14 }, { hour: 14, orders: 7 }, { hour: 15, orders: 3 },
      { hour: 16, orders: 2 }, { hour: 17, orders: 5 }, { hour: 18, orders: 10 },
      { hour: 19, orders: 15 }, { hour: 20, orders: 18 }, { hour: 21, orders: 13 },
      { hour: 22, orders: 8 },
    ];

    this.statusData = [
      { label: 'Entregues',   count: this.deliveredOrders,  color: 'green'  },
      { label: 'Em Entrega',  count: this.deliveringOrders, color: 'blue'   },
      { label: 'Em Preparo',  count: this.preparingOrders,  color: 'purple' },
      { label: 'Pendentes',   count: this.pendingOrders,    color: 'amber'  },
    ];
  }
}
