import ProductDetailSupabase from "@/components/menu/ProductDetailSupabase";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  return <ProductDetailSupabase slug={slug} />;
}
