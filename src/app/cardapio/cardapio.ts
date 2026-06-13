import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderStateService } from '../order-state.service';

type Category =
  | 'burgers'
  | 'pizzas'
  | 'lanches'
  | 'acompanhamentos'
  | 'bebidas'
  | 'sobremesas';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  category: Category;
  available: boolean;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

@Component({
  selector: 'app-cardapio',
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './cardapio.html',
  styleUrl: './cardapio.css',
})
export class Cardapio {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly orderState = inject(OrderStateService);

  readonly categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'burgers', label: 'Burgers' },
    { id: 'pizzas', label: 'Pizzas' },
    { id: 'lanches', label: 'Lanches' },
    { id: 'acompanhamentos', label: 'Acompanhamentos' },
    { id: 'bebidas', label: 'Bebidas' },
    { id: 'sobremesas', label: 'Sobremesas' },
  ] as const;

  protected readonly isManagementView = computed(
    () => this.route.snapshot.queryParamMap.get('modo') === 'gerenciar'
  );

  protected readonly categoryLabelMap: Record<Category, string> = {
    burgers: 'Burgers',
    pizzas: 'Pizzas',
    lanches: 'Lanches',
    acompanhamentos: 'Acompanhamentos',
    bebidas: 'Bebidas',
    sobremesas: 'Sobremesas',
  };

  activeCategory: (typeof this.categories)[number]['id'] = 'todos';
  protected showProductForm = false;
  protected editingProductId: number | null = null;
  protected productForm = {
    name: '',
    description: '',
    image: '',
    price: 0,
    category: 'burgers' as Category,
  };

  private readonly menuItems = signal<MenuItem[]>([
    {
      id: 1,
      name: 'Burger Classico',
      description: 'Hamburguer artesanal, queijo, alface, tomate e molho especial',
      image:
        'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=900&q=80',
      price: 25.9,
      category: 'burgers',
      available: true,
    },
    {
      id: 2,
      name: 'Pizza Margherita',
      description: 'Molho de tomate, mussarela, manjericao fresco e azeite',
      image:
        'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=900&q=80',
      price: 42.9,
      category: 'pizzas',
      available: true,
    },
    {
      id: 3,
      name: 'Batata Frita',
      description: 'Batatas crocantes servidas com molho especial',
      image:
        'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80',
      price: 12.9,
      category: 'acompanhamentos',
      available: true,
    },
    {
      id: 4,
      name: 'Hot Dog Especial',
      description: 'Salsicha premium, queijo, batata palha, milho e molhos',
      image:
        'https://www.estadao.com.br/resizer/Vpub1CyIvHykWBkzG-_fOlOY9VI=/arc-anglerfish-arc2-prod-estadao/public/BDQY6KP3BFBERM5DKBHXUUELZ4.jpg',
      price: 17.9,
      category: 'lanches',
      available: true,
    },
    {
      id: 5,
      name: 'Refrigerante 2L',
      description: 'Refrigerante gelado de 2 litros',
      image:
        'https://wallpapers.com/images/hd/coca-cola-931-x-1392-picture-27hdq23tvf06e5q4.jpg',
      price: 11.9,
      category: 'bebidas',
      available: true,
    },
    {
      id: 6,
      name: 'Sorvete Premium',
      description: 'Sorvete artesanal de 500ml, diversos sabores',
      image:
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80',
      price: 19.9,
      category: 'sobremesas',
      available: true,
    },
  ]);

  cart: CartItem[] = [];

  get filteredItems(): MenuItem[] {
    const items = this.menuItems();
    return this.activeCategory === 'todos'
      ? items
      : items.filter((item) => item.category === this.activeCategory);
  }

  get cartCount(): number {
    return this.cart.reduce((sum, cartItem) => sum + cartItem.quantity, 0);
  }

  get totalPrice(): number {
    return this.cart.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0);
  }

  setCategory(category: (typeof this.categories)[number]['id']) {
    this.activeCategory = category;
  }

  addToCart(item: MenuItem) {
    if (!item.available) return;
    const existing = this.cart.find((cartItem) => cartItem.item.id === item.id);
    if (existing) {
      existing.quantity += 1;
      this.cart = [...this.cart];
      return;
    }
    this.cart = [...this.cart, { item, quantity: 1 }];
  }

  increaseQuantity(itemId: number) {
    this.cart = this.cart.map((cartItem) =>
      cartItem.item.id === itemId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
    );
  }

  decreaseQuantity(itemId: number) {
    this.cart = this.cart
      .map((cartItem) =>
        cartItem.item.id === itemId
          ? { ...cartItem, quantity: Math.max(cartItem.quantity - 1, 0) }
          : cartItem
      )
      .filter((cartItem) => cartItem.quantity > 0);
  }

  removeFromCart(itemId: number) {
    this.cart = this.cart.filter((cartItem) => cartItem.item.id !== itemId);
  }

  finalizeOrder() {
    this.orderState.setItems(
      this.cart.map((cartItem) => ({
        id: cartItem.item.id,
        name: cartItem.item.name,
        image: cartItem.item.image,
        price: cartItem.item.price,
        quantity: cartItem.quantity,
      }))
    );
    this.router.navigateByUrl('/finalizar-pedido');
  }

  goToCheckout() {
    this.finalizeOrder();
  }

  goToProfile() {
    this.router.navigateByUrl('/cliente/perfil');
  }

  goHome() {
    if (this.isManagementView()) {
      this.router.navigateByUrl('/cozinha');
      return;
    }
    this.router.navigateByUrl('/');
  }

  trackByCategory(index: number, category: (typeof this.categories)[number]) {
    return category.id;
  }

  trackByProduct(index: number, item: MenuItem) {
    return item.id;
  }

  trackByCartItem(index: number, cartItem: CartItem) {
    return cartItem.item.id;
  }

  protected openAddProductForm() {
    this.editingProductId = null;
    this.productForm = {
      name: '',
      description: '',
      image: '',
      price: 0,
      category: 'burgers',
    };
    this.showProductForm = true;
  }

  protected editProduct(item: MenuItem) {
    this.editingProductId = item.id;
    this.productForm = {
      name: item.name,
      description: item.description,
      image: item.image,
      price: item.price,
      category: item.category,
    };
    this.showProductForm = true;
  }

  protected cancelProductForm() {
    this.showProductForm = false;
    this.editingProductId = null;
  }

  protected submitProductForm() {
    const name = this.productForm.name.trim();
    const description = this.productForm.description.trim();
    const image = this.productForm.image.trim();
    const price = Number(this.productForm.price);
    if (!name || !description || !image || Number.isNaN(price) || price <= 0) return;

    if (this.editingProductId) {
      this.menuItems.update((items) =>
        items.map((item) =>
          item.id === this.editingProductId
            ? {
                ...item,
                name,
                description,
                image,
                price,
                category: this.productForm.category,
              }
            : item
        )
      );
    } else {
      const nextId = this.menuItems().reduce((max, item) => Math.max(max, item.id), 0) + 1;
      this.menuItems.update((items) => [
        {
          id: nextId,
          name,
          description,
          image,
          price,
          category: this.productForm.category,
          available: true,
        },
        ...items,
      ]);
    }

    this.showProductForm = false;
    this.editingProductId = null;
  }

  protected toggleAvailability(itemId: number) {
    this.menuItems.update((items) =>
      items.map((item) => (item.id === itemId ? { ...item, available: !item.available } : item))
    );
    this.cart = this.cart.filter((cartItem) => {
      const currentItem = this.menuItems().find((item) => item.id === cartItem.item.id);
      return !!currentItem?.available;
    });
  }

  protected productFormTitle(): string {
    return this.editingProductId ? 'Editar Produto' : 'Adicionar Produto';
  }

  protected productActionLabel(item: MenuItem): string {
    return item.available ? 'Indisponivel' : 'Disponivel';
  }
}
