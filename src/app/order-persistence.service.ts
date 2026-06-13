import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { ConfirmedOrder } from './order-state.service';

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class OrderPersistenceService {
  private readonly ordersStorageKey = 'confirmedOrders';
  private readonly lastOrderStorageKey = 'lastConfirmedOrder';

  private getDatabase() {
    const app = getApps().length
      ? getApp()
      : initializeApp(environment.firebase);

    return getFirestore(app);
  }

  async loadConfirmedOrders(): Promise<ConfirmedOrder[]> {
    try {
      const database = this.getDatabase();
      const ordersRef = collection(database, 'orders');
      const ordersQuery = query(ordersRef, orderBy('createdAtIso', 'desc'));
      const snapshot = await getDocs(ordersQuery);

      return snapshot.docs.map((documentSnapshot) => {
        return documentSnapshot.data() as ConfirmedOrder;
      });
    } catch (error) {
      console.error('Erro ao carregar pedidos do Firestore:', error);

      const rawOrders = localStorage.getItem(this.ordersStorageKey);
      if (!rawOrders) return [];

      try {
        return JSON.parse(rawOrders) as ConfirmedOrder[];
      } catch {
        return [];
      }
    }
  }

  async saveConfirmedOrders(orders: ConfirmedOrder[]): Promise<void> {
    try {
      const database = this.getDatabase();
      const ordersRef = collection(database, 'orders');
      const existingOrders = await getDocs(ordersRef);

      await Promise.all(
        existingOrders.docs.map((orderDocument) =>
          deleteDoc(orderDocument.ref)
        )
      );

      await Promise.all(
        orders.map((order) =>
          setDoc(doc(database, 'orders', order.code), order)
        )
      );

      const latestOrder = orders[0] ?? null;

      if (latestOrder) {
        localStorage.setItem(this.lastOrderStorageKey, JSON.stringify(latestOrder));
      } else {
        localStorage.removeItem(this.lastOrderStorageKey);
      }
    } catch (error) {
      console.error('Erro ao salvar pedidos no Firestore:', error);

      localStorage.setItem(this.ordersStorageKey, JSON.stringify(orders));

      const latestOrder = orders[0] ?? null;

      if (latestOrder) {
        localStorage.setItem(this.lastOrderStorageKey, JSON.stringify(latestOrder));
      } else {
        localStorage.removeItem(this.lastOrderStorageKey);
      }
    }
  }

  async saveConfirmedOrder(order: ConfirmedOrder): Promise<void> {
    try {
      const database = this.getDatabase();

      await setDoc(doc(database, 'orders', order.code), order);

      localStorage.setItem(this.lastOrderStorageKey, JSON.stringify(order));
    } catch (error) {
      console.error('Erro ao salvar pedido no Firestore:', error);

      const currentOrders = await this.loadConfirmedOrders();
      const nextOrders = [
        order,
        ...currentOrders.filter((item) => item.code !== order.code),
      ];

      localStorage.setItem(this.ordersStorageKey, JSON.stringify(nextOrders));
      localStorage.setItem(this.lastOrderStorageKey, JSON.stringify(order));
    }
  }

  async loadLastConfirmedOrder(): Promise<ConfirmedOrder | null> {
    const orders = await this.loadConfirmedOrders();
    return orders[0] ?? null;
  }
}