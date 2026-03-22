import type { GameEdges, GameNodes } from '../types';
import { Factory } from '../models/Factory';
import { RECIPES } from '../data/recipes';
import type { XYPosition, Connection, Edge } from 'reactflow';
import { Item } from '../types';

export class Game {
  private factories = new Map<string, Factory>();
  private edges: GameEdges = [];
  public readonly recipes = RECIPES;

  constructor() {}

  addEdge(connection: Connection): void {
    const edge: Edge = {
      id: `${connection.source}-${connection.target}`,
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle || undefined,
      targetHandle: connection.targetHandle || undefined,
      type: 'default',
    };
    this.edges.push(edge);
  }

  removeEdge(id: string): void {
    this.edges = this.edges.filter(e => e.id !== id);
  }

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
    // Pipe transfers: push outputs to connected inputs
    for (const edge of this.edges) {
      const sourceFactory = this.getFactory(edge.source);
      const targetFactory = this.getFactory(edge.target);
      if (sourceFactory && targetFactory) {
        // Transfer all available items from source output to target input
        for (const item of Object.values(Item) as Item[]) {
          const available = sourceFactory.outputInventory.get(item);
          if (available > 0) {
            sourceFactory.outputInventory.transfer(targetFactory.inputInventory, item, available);
          }
        }
      }
    }
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
    return this.edges;
  }

  getFactory(id: string): Factory | undefined {
    return this.factories.get(id);
  }
}