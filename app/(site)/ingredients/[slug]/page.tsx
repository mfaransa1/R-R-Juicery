import PublicIngredientDetail from "@/components/ingredients/PublicIngredientDetail";

export const metadata = {
  title: "Ingredient | The Rook & Reed Juicery",
  description: "Explore the ingredients behind The Rook & Reed Juicery.",
};

export default async function IngredientPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PublicIngredientDetail slug={slug} />;
}
