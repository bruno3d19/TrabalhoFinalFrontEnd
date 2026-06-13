import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-area.html',
  styleUrl: './client-area.css',
})
export class AdminCustomers {
  constructor(private router: Router) {}

  searchTerm = signal('');
  activeTab = signal('all');

  customersData = signal<any[]>([]);

  recurringCustomers = computed(() =>
    this.customersData().filter((customer) => customer.totalOrders > 1)
  );

  vipCustomers = computed(() =>
    this.customersData().filter((customer) => customer.isVip)
  );

  newCustomers = computed(() =>
    this.customersData().filter((customer) => customer.totalOrders === 1)
  );

  filteredCustomers = computed(() => {
    const term = this.searchTerm().toLowerCase();

    return this.customersData().filter((customer) => {
      const name = customer.customerName?.toLowerCase() ?? '';
      const id = customer.customerId?.toLowerCase() ?? '';

      return name.includes(term) || id.includes(term);
    });
  });

  goBack() {
    this.router.navigate(['/admin']);
  }

  changeTab(tab: string) {
    this.activeTab.set(tab);
  }

  getCustomersByTab() {
    switch (this.activeTab()) {
      case 'vip':
        return this.vipCustomers();

      case 'recurring':
        return this.recurringCustomers();

      case 'new':
        return this.newCustomers();

      default:
        return this.filteredCustomers();
    }
  }
}