
"use client";

import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { clearTokens } from "@/lib/auth";
import { CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const categories = [
  { name: "All Products", icon: "✦" },
  { name: "Electronics", icon: "⌘" },
  { name: "Fashion", icon: "♧" },
  { name: "Accessories", icon: "◇" },
  { name: "Home & Living", icon: "⌂" },
];

const products = [
  {
    name: "Wireless Headphones",
    category: "Electronics",
    price: "₱1,499",
    icon: "🎧",
    color: "from-violet-900/50 to-purple-950/80",
    tag: "POPULAR",
  },
  {
    name: "Casual Sneakers",
    category: "Fashion",
    price: "₱1,899",
    icon: "👟",
    color: "from-fuchsia-900/40 to-purple-950/80",
    tag: "NEW",
  },
  {
    name: "Smart Watch",
    category: "Electronics",
    price: "₱2,499",
    icon: "⌚",
    color: "from-indigo-900/50 to-violet-950/80",
    tag: "FEATURED",
  },
  {
    name: "Everyday Backpack",
    category: "Accessories",
    price: "₱999",
    icon: "🎒",
    color: "from-purple-900/50 to-indigo-950/80",
    tag: "POPULAR",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { isChecking } = useAuthGuard({ requireAuth: true });

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08060D]">
        <p className="text-sm text-violet-400">
          Verifying session...
        </p>
      </div>
    );
  }

  const handleLogout = () => {
    clearTokens();
    router.push(CONFIG.ROUTES.LOGIN);
  };

  return (
    <main className="min-h-screen bg-[#08060D] text-white">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#100D18]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">

          <h1 className="text-2xl font-extrabold tracking-tight">
            Buy<span className="text-violet-500">Bai</span>
          </h1>

          <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
            <a href="#home" className="font-semibold text-violet-400">
              Home
            </a>
            <a href="#categories" className="transition hover:text-violet-400">
              Categories
            </a>
            <a href="#products" className="transition hover:text-violet-400">
              Products
            </a>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="rounded-xl border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500 hover:text-white"
          >
            Logout
          </Button>

        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-14 px-5 py-10 sm:px-8">

        {/* HERO SECTION */}
        <section
          id="home"
          className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-[#24123D] via-[#160E25] to-[#100D18] p-8 sm:p-12"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-violet-600/20 blur-[100px]" />

          <div className="relative z-10 max-w-2xl">

            <span className="inline-block rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-xs font-semibold tracking-widest text-violet-300">
              WELCOME TO BUYBAI
            </span>

            <h2 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
              Everything you need,
              <span className="block text-violet-400">
                all in one place.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
              Discover products, explore different categories,
              and find something you will love at BuyBai.
            </p>

            <a
              href="#products"
              className="mt-8 inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-700 to-purple-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-violet-900/30 transition hover:scale-105 hover:from-violet-600 hover:to-fuchsia-600"
            >
              Explore Products
              <span className="text-lg">→</span>
            </a>

          </div>

          <div className="pointer-events-none absolute bottom-0 right-8 hidden text-[180px] font-black text-violet-400/10 lg:block">
            B
          </div>
        </section>

        {/* CATEGORIES */}
        <section id="categories">

          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
              Browse Collections
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Shop by Category
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Find products based on what you need.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="border border-white/10 bg-[#100D18] transition duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-[#191326]"
              >
                <CardContent className="flex flex-col items-center gap-3 p-5 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-3xl text-violet-400">
                    {category.icon}
                  </div>

                  <h3 className="text-sm font-semibold text-gray-200">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section id="products">

          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
                Our Collection
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Featured Products
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Check out some of our featured items.
              </p>
            </div>

            <span className="text-sm font-medium text-violet-400">
              Explore BuyBai ✦
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {products.map((product) => (
              <Card
                key={product.name}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#100D18] transition duration-300 hover:-translate-y-2 hover:border-violet-500/50 hover:shadow-[0_10px_40px_rgba(139,92,246,0.12)]"
              >
                <CardContent className="p-0">

                  {/* PRODUCT IMAGE PLACEHOLDER */}
                  <div
                    className={`relative flex h-52 items-center justify-center bg-gradient-to-br ${product.color}`}
                  >
                    <span className="absolute left-4 top-4 rounded-full border border-violet-400/20 bg-black/30 px-3 py-1 text-[10px] font-bold tracking-wider text-violet-300">
                      {product.tag}
                    </span>

                    <span className="text-7xl transition duration-300 group-hover:scale-110">
                      {product.icon}
                    </span>
                  </div>

                  {/* PRODUCT DETAILS */}
                  <div className="space-y-3 p-5">

                    <p className="text-xs font-medium text-violet-400">
                      {product.category}
                    </p>

                    <h3 className="text-base font-bold text-white">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-lg font-extrabold text-violet-400">
                        {product.price}
                      </span>

                      <span className="text-xs text-gray-500">
                        BuyBai
                      </span>
                    </div>

                  </div>
                </CardContent>
              </Card>
            ))}

          </div>
        </section>

        {/* BOTTOM BANNER */}
        <section className="rounded-2xl border border-violet-500/20 bg-[#151020] p-7 text-center sm:p-10">
          <h2 className="text-2xl font-bold">
            Welcome to <span className="text-violet-400">BuyBai</span>
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-400">
            Your shopping experience starts here.
            Explore our collections and discover something new.
          </p>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-white/10 py-7 text-center">
          <p className="text-xl font-extrabold">
            Buy<span className="text-violet-500">Bai</span>
          </p>

          <p className="mt-3 text-xs text-gray-500">
            © 2026 BuyBai. All rights reserved.
          </p>
        </footer>

      </div>
    </main>
  );
}
