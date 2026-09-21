import IngredientsHero from "@/components/ingredients/IngredientsHero";
import IngredientExplorer from "@/components/ingredients/IngredientExplorer";
import IngredientPromise from "@/components/ingredients/IngredientPromise";
import IngredientSourcing from "@/components/ingredients/IngredientSourcing";
import { ingredients } from "@/data/ingredients";

export const metadata = {
  title: "Ingredients | The Rook & Reed Juicery",
  description:
    "Explore the ingredients behind The Rook & Reed Juicery.",
};

export default function IngredientsPage() {
  return (
    <main>
      <IngredientsHero />

      <IngredientExplorer ingredients={ingredients} />

      <IngredientPromise />

      <IngredientSourcing />
    </main>
  );
}