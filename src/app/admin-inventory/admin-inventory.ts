import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  cost: number;
  lowStockThreshold: number;
  emoji: string;
}

@Component({
  selector: 'app-admin-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-inventory.html',
  styleUrl: './admin-inventory.css',
})
export class AdminInventory implements OnInit {
  searchTerm = '';
  adjustingId: string | null = null;
  stockChange = 0;

  products: Product[] = [];

  get filteredProducts(): Product[] {
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
    );
  }

  get lowStockProducts(): Product[] {
    return this.products.filter(p => p.stock < p.lowStockThreshold);
  }

  get totalProducts(): number { return this.products.length; }

  get productsInStock(): number {
    return this.products.filter(p => p.stock > 0).length;
  }

  get totalInventoryValue(): number {
    return this.products.reduce((sum, p) => sum + p.stock * p.cost, 0);
  }

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }

  adjustStock(id: string, change: number): void {
    const p = this.products.find(p => p.id === id);
    if (p) {
      p.stock = Math.max(0, p.stock + change);
      this.showToast(change > 0 ? `+${change} unidade(s) adicionada(s)` : `${change} unidade(s) removida(s)`);
    }
  }

  startAdjust(id: string): void {
    this.adjustingId = id;
    this.stockChange = 10;
  }

  saveAdjustment(id: string): void {
    if (this.stockChange !== 0) this.adjustStock(id, this.stockChange);
    this.cancelAdjust();
  }

  cancelAdjust(): void {
    this.adjustingId = null;
    this.stockChange = 0;
  }

  quickRestock(id: string): void {
    const p = this.products.find(p => p.id === id);
    if (p) {
      p.stock += p.lowStockThreshold;
      this.showToast(`Estoque de ${p.name} reposto!`);
    }
  }

  getStatusLabel(product: Product): string {
    if (product.stock === 0) return 'Sem estoque';
    if (product.stock < product.lowStockThreshold) return 'Estoque baixo';
    return 'Em estoque';
  }

  getStatusClass(product: Product): string {
    if (product.stock === 0) return 'badge-danger';
    if (product.stock < product.lowStockThreshold) return 'badge-warning';
    return 'badge-success';
  }

  private showToast(msg: string): void {
    // Integrate with your toast service if available
    console.log('[Toast]', msg);
  }

  private loadProducts(): void {
    this.products = [
      { id: '1', name: 'X-Burguer Especial',  category: 'Burgers',       stock: 24, cost: 12.50, lowStockThreshold: 10, emoji: '🍔' },
      { id: '2', name: 'Pizza Margherita',     category: 'Pizzas',        stock: 8,  cost: 18.00, lowStockThreshold: 10, emoji: '🍕' },
      { id: '3', name: 'Batata Frita Grande',  category: 'Acompanhamentos',stock: 3, cost: 4.00,  lowStockThreshold: 15, emoji: '🍟' },
      { id: '4', name: 'Hot Dog Tradicional',  category: 'Lanches',       stock: 30, cost: 7.50,  lowStockThreshold: 10, emoji: '🌭' },
      { id: '5', name: 'Refrigerante 350ml',   category: 'Bebidas',       stock: 60, cost: 2.50,  lowStockThreshold: 20, emoji: '🥤' },
      { id: '6', name: 'Sorvete de Creme',     category: 'Sobremesas',    stock: 5,  cost: 6.00,  lowStockThreshold: 8,  emoji: '🍦' },
    ];
  }
}
