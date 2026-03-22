import { Item } from '../types';

export class Inventory {
  private contents: Partial<Record<Item, number>> = {};

  add(item: Item, quantity: number): void {
    if (quantity <= 0) return;
    this.contents[item] = (this.contents[item] ?? 0) + quantity;
  }

  remove(item: Item, quantity: number): boolean {
    const available = this.get(item);
    if (available < quantity) return false;
    this.contents[item] = available - quantity;
    if (this.contents[item] === 0) delete this.contents[item];
    return true;
  }

  transfer(to: Inventory, item: Item, quantity: number): boolean {
    return this.remove(item, quantity) && (to.add(item, quantity), true);
  }

  get(item: Item): number {
    return this.contents[item] ?? 0;
  }

  has(item: Item, quantity: number): boolean {
    return this.get(item) >= quantity;
  }

  clear(): void {
    this.contents = {};
  }

  toSummary(): Partial<Record<Item, number>> {
    return { ...this.contents };
  }
}