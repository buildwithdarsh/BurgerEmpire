import type { CatalogItem, CatalogOptionGroup, CatalogSizeVariation, NutritionData } from '@buildwithdarsh/sdk';

export type DietType = 'veg' | 'nonveg' | 'egg';

/**
 * UI-facing menu item shape — derived from CatalogItem via catalogItemToMenuItem().
 * This is an adapter type: CatalogItem has flat variants[], while MenuItem splits
 * into classic/healthy sub-objects for the dual-mode BurgerEmpire UI.
 */
export interface MenuItem {
  id: string;
  category: string;
  categorySlug: string;
  diet: DietType;
  image?: string;
  healthyImage?: string;
  classic: {
    name: string;
    description: string;
    price: number;
    calories: number;
  };
  healthy: {
    name: string;
    description: string;
    price: number;
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
    swaps: string[];
  };
  isBestseller?: boolean;
  isNew?: boolean;
  slug: string;
  inStock: boolean;
  sizeVariations: CatalogSizeVariation[];
  optionGroups: CatalogOptionGroup[];
}

export function catalogItemToMenuItem(item: CatalogItem, categoryName?: string): MenuItem {
  const classicVariant = item.variants.find((v) => v.variantType === 'classic') ?? item.variants[0];
  const healthyVariant = item.variants.find((v) => v.variantType === 'healthy');
  const classicNutrition: NutritionData = classicVariant?.nutritionData ?? {};
  const healthyNutrition: NutritionData = healthyVariant?.nutritionData ?? classicNutrition;

  return {
    id: item.id,
    slug: item.slug,
    category: categoryName ?? '',
    categorySlug: item.categoryId,
    diet: (item.dietType as DietType) ?? 'veg',
    image: classicVariant?.imageUrl ?? undefined,
    healthyImage: healthyVariant?.imageUrl ?? classicVariant?.imageUrl ?? undefined,
    inStock: item.inStock,
    isBestseller: item.isFeatured,
    isNew: item.isNew,
    classic: {
      name: classicVariant?.name ?? item.slug,
      description: classicVariant?.description ?? '',
      price: Number(classicVariant?.price ?? 0),
      calories: Number(classicNutrition['calories'] ?? 0),
    },
    healthy: {
      name: healthyVariant?.name ?? classicVariant?.name ?? item.slug,
      description: healthyVariant?.description ?? '',
      price: Number(healthyVariant?.price ?? classicVariant?.price ?? 0),
      calories: Number(healthyNutrition['calories'] ?? 0),
      protein: Number(healthyNutrition['protein'] ?? 0),
      fats: Number(healthyNutrition['fats'] ?? 0),
      carbs: Number(healthyNutrition['carbs'] ?? 0),
      swaps: (Array.isArray(healthyNutrition['swaps']) ? healthyNutrition['swaps'] : []) as string[],
    },
    sizeVariations: item.sizeVariations,
    optionGroups: item.optionGroups,
  };
}
