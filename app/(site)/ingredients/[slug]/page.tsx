import { notFound } from "next/navigation";

import IngredientDetailHero from "@/components/ingredients/IngredientDetailHero";
import IngredientDetails from "@/components/ingredients/IngredientDetails";
import IngredientProducts from "@/components/ingredients/IngredientProducts";
import IngredientTraceability from "@/components/ingredients/IngredientTraceability";

import { ingredients } from "@/data/ingredients";
import { products } from "@/data/products";

type IngredientPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return ingredients.map((ingredient) => ({
    slug: ingredient.slug,
  }));
}

export async function generateMetadata({
  params,
}: IngredientPageProps) {
  const { slug } = await params;

  const ingredient = ingredients.find(
    (item) => item.slug === slug,
  );

  if (!ingredient) {
    return {
      title: "Ingredient | The Rook & Reed Juicery",
    };
  }

  return {
    title: `${ingredient.name} | The Rook & Reed Juicery`,
    description: ingredient.description,
  };
}

export default async function IngredientPage({
  params,
}: IngredientPageProps) {
  const { slug } = await params;

  const ingredient = ingredients.find(
    (item) => item.slug === slug,
  );

  if (!ingredient) {
    notFound();
  }

  /*
   * Find every product containing this ingredient.
   *
   * Your products.ts stores ingredients as objects,
   * so we compare ingredient.name rather than comparing
   * the objects themselves.
   */
  const relatedProducts = products.filter((product) =>
    product.ingredients.some(
      (item) =>
        item.name.toLowerCase() === ingredient.name.toLowerCase(),
    ),
  );

  return (
    <main>
      <IngredientDetailHero ingredient={ingredient} />

      <IngredientDetails ingredient={ingredient} />

      <IngredientProducts products={relatedProducts} />

      <IngredientTraceability ingredient={ingredient} />
    </main>
  );
}