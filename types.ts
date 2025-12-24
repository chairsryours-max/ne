
export enum ViewType {
  HOME = 'home',
  WEDDING = 'wedding',
  TRADESHOW = 'tradeshow',
  PLAN = 'plan'
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export interface PlanningData {
  tablesNeeded: number;
  chairsNeeded: number;
  visualCount: number;
  capacityPerTable: number;
  isRound: boolean;
}

export interface AIAdvice {
  recommendations: string[];
  layoutStrategy: string;
  suggestedAddons: string[];
  proTip: string;
}

export interface LocationInfo {
  name: string;
  description: string;
}
