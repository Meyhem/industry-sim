import type { GameEdges, GameNodes } from '../types';
import { Factory } from '../models/Factory';
import { RECIPES } from '../data/recipes';
import type { XYPosition } from 'reactflow';

export class Game {
  private factories = new Map<string, Factory>();
  public readonly recipes = RECIPES;

  constructor() {}

  addFactory(id: string, recipeId: string, position: XYPosition): Factory | null {
    const recipe = this.recipes.find(r => r.id === recipeId);
    if (!recipe) return null;
    const factory = new Factory(recipe);
    factory.setPosition(position);
    this.factories.set(id, factory);
    return factory;
  }

  tick(): void {
    this.factories.forEach(factory => factory.tick());
    // Future: pipe transfers
  }

  getNodes(): GameNodes {
    return Array.from(this.factories.entries()).map(([id, factory]) => ({
      id,
      type: 'factory',
      position: factory.position,
      data: factory.getNodeData(),
    }));
  }

  getEdges(): GameEdges {
    return []; // Stub for pipes
  }

  getFactory(id: string): Factory | undefined {
    return this.factories.get(id);
  }
}