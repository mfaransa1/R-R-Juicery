import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { journalPosts } from "@/data/journal";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return journalPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function JournalDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const post = journalPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-[#f5f1e8] text-[#111]">
      <section className="mx-auto max-w-[1440px] px-5 pb-20 pt-32 sm:px-8 lg:px-14 lg:pt-40">
        <Link
          href="/journal"
          className="text-[10px] font-semibold uppercase tracking-[0.2em] text-black/45 hover:text-black"
        >
          ← Back to Journal
        </Link>

        <div className="mt-12 max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
            {post.category}
          </p>

          <h1 className="mt-6 font-serif text-[clamp(4rem,9vw,9rem)] leading-[0.78] tracking-[-0.065em]">
            {post.title}
          </h1>

          <div className="mt-8 flex gap-4 text-[10px] uppercase tracking-[0.2em] text-black/35">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        <div className="relative mt-16 aspect-[16/8] overflow-hidden bg-[#d8d2c7]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </section>

      <article className="bg-white px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-xl leading-[1.8] text-black/70 sm:text-2xl">
            {post.excerpt}
          </p>

          <div className="my-14 h-px bg-black/10" />

          <p className="text-base leading-[1.9] text-black/65">
            ARTICLE CONTENT — REQUIRED INPUT
          </p>

          <p className="mt-8 text-base leading-[1.9] text-black/65">
            The journal structure is ready for the final editorial
            copy, photography, author information and publication
            dates to be added.
          </p>
        </div>
      </article>

      <section className="bg-[#111] px-5 py-20 text-white sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">
              R&R JOURNAL
            </p>

            <h2 className="mt-3 font-serif text-4xl tracking-[-0.04em]">
              Keep reading.
            </h2>
          </div>

          <Link
            href="/journal"
            className="w-fit border border-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition hover:bg-white hover:text-black"
          >
            All stories
          </Link>
        </div>
      </section>
    </main>
  );
}