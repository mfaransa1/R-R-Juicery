"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const books = [
  {
    title: "R&R Reads",
    image: "/images/house/books-01.jpg",
  },
  {
    title: "Music History",
    image: "/images/house/books-02.jpg",
  },
  {
    title: "Chess & Strategy",
    image: "/images/house/books-03.jpg",
  },
];

export default function HouseShelf() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="rr-container py-24 sm:py-32 lg:py-40">
        <div className="mb-16 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <span className="rr-kicker">THE SHELF</span>

            <h2 className="rr-editorial mt-5 text-6xl leading-[0.85] sm:text-8xl">
              Read
              <br />
              <em>something.</em>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-black/55">
            Philosophy, biographies, African literature, music history and
            chess — selected to encourage curiosity.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {books.map((book, index) => (
            <motion.div
              key={book.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`relative overflow-hidden bg-[var(--rr-paper)] ${
                index === 1 ? "md:mt-16" : ""
              }`}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={book.image}
                  alt={book.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div className="flex items-center justify-between p-5">
                <span className="text-sm">{book.title}</span>
                <ArrowUpRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>

        <Link
          href="/journal"
          className="rr-button mt-12 inline-flex items-center gap-3"
        >
          Visit The Journal
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}