import type { Recipe } from '../types';
import { Item } from '../types';

export const RECIPES: Recipe[] = [
  {
    id: 'mine-iron',
    name: 'Iron Mine',
    inputs: {},
    outputs: { [Item.IronOre]: 1000 },
    ticks: 10,
  },
  {
    id: 'mine-coal',
    name: 'Coal Mine',
    inputs: {},
    outputs: { [Item.Coal]: 1000 },
    ticks: 10,
  },
  {
    id: 'smelt-steel',
    name: 'Steel Smelter',
    inputs: { [Item.IronOre]: 1000, [Item.Coal]: 500 },
    outputs: { [Item.Steel]: 800 },
    ticks: 20,
  },
];