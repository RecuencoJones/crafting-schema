export enum Quality {
  GREEN,
  BLUE,
  PURPLE
}

export type Ingredient = Product | Material;

export type IngredientCount = {
  item: Ingredient,
  count: number;
};

export type Material = {
  name: string;
  type: string;
  grade?: number;
  quality: Quality;
  from: Array<string>;
};

export type Product = {
  name: string;
  type: string;
  level?: number;
  grade?: number;
  quality: Quality;
  recipe: Array<IngredientCount>;
};
