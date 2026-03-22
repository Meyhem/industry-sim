import type { Recipe, FactoryNodeData } from '../types';
import type { XYPosition } from 'reactflow';
import { Item } from '../types';
import { Inventory } from './Inventory';

export class Factory {
  recipe: Recipe;
  inputInventory = new Inventory();
  outputInventory = new Inventory();
  progress: number = 0;
  position: XYPosition = { x: 0, y: 0 };

  constructor(recipe: Recipe) {
    this.recipe = recipe;
  }

  tick(): void {
    if (this.progress === 0) {
      if (this.canProduce()) {
        this.consumeInputs();
        this.progress = this.recipe.ticks;
      }
    } else {
      this.progress--;
      if (this.progress === 0) {
        this.produceOutputs();
      }
    }
  }

  setPosition(pos: XYPosition): void {
    this.position = pos;
  }

  getNodeData(): FactoryNodeData {
    return {
      recipeName: this.recipe.name,
      progress: this.progress,
      inputSummary: this.inputInventory.toSummary(),
      outputSummary: this.outputInventory.toSummary(),
    };
  }

  private canProduce(): boolean {
    for (const [item, qty] of Object.entries(this.recipe.inputs)) {
      if (!this.inputInventory.has(item as Item, qty)) return false;
    }
    return true;
  }

  private consumeInputs(): void {
    for (const [itemKey, qty] of Object.entries(this.recipe.inputs)) {
      const item = itemKey as Item;
      this.inputInventory.remove(item, qty);
    }
  }

  private produceOutputs(): void {
    for (const [itemKey, qty] of Object.entries(this.recipe.outputs)) {
      const item = itemKey as Item;
      this.outputInventory.add(item, qty);
    }
  }
}