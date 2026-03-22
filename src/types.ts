import type { Node, Edge } from 'reactflow';

export const Item = {
  IronOre: 'IronOre',
  Coal: 'Coal',
  Steel: 'Steel',
} as const;

export type Item = typeof Item[keyof typeof Item];

export interface Recipe {
  id: string;
  name: string;
  inputs: Partial<Record<Item, number>>;
  outputs: Partial<Record<Item, number>>;
  ticks: number;
}

export interface FactoryNodeData {
  recipeName: string;
  progress: number;
  maxTicks: number;
  inputSummary: Partial<Record<Item, number>>;
  outputSummary: Partial<Record<Item, number>>;
}

export type FactoryNode = Node<FactoryNodeData>;
export type GameNodes = FactoryNode[];
export type GameEdges = Edge[];