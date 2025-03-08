"use client";
/* eslint-disable */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";
import { motion, useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { MdBusinessCenter } from "react-icons/md";
export default function Home() {
  const aboutRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end end"],
  });

  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [pathLength, setPathLength] = useState(0.05);
  const [circleOpacity, setCircleOpacity] = useState(0.3);
  const [textScale, setTextScale] = useState(0.8);
  const [rotate, setRotate] = useState(0);
  const [horizontalProgress, setHorizontalProgress] = useState("0%");

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((v) => {
      setScrollPercentage(Math.round(v * 100));
      setPathLength(v * 0.95 + 0.05);
      setCircleOpacity(
        v <= 0.3
          ? 0.3 + (v / 0.3) * 0.7
          : v <= 0.6
          ? 1
          : 1 - ((v - 0.6) / 0.4) * 0.2
      );
      setTextScale(
        v <= 0.5 ? 0.8 + (v / 0.5) * 0.2 : 1 + ((v - 0.5) / 0.5) * 0.1
      );
      setRotate(v * 360);
      setHorizontalProgress(`${v * 100}%`);
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="container mx-auto py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 backdrop-blur-xs ">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full text-pink-900 text-5xl flex items-center justify-center">
            <MdBusinessCenter />
          </div>
          <span className="text-white text-xl font-bold">SaaS</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-white hover:text-pink-400 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-white hover:text-pink-400 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#about"
            className="text-white hover:text-pink-400 transition-colors"
          >
            About
          </Link>
          <Link
            href="/login"
            className="text-white hover:text-pink-400 transition-colors"
          >
            Login
          </Link>
        </nav>
      </header>

      <section className="relative container mx-auto py-24 text-center pt-36 overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 via-zinc-900 to-zinc-950"></div>

          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              backgroundPosition: "0 0",
            }}
          ></div>

          <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-36 -left-12 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>

          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10 rounded-lg transform rotate-12 opacity-50"></div>
          <div className="absolute bottom-1/3 right-1/3 w-20 h-20 border border-pink-500/20 rounded-full transform opacity-70"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-indigo-500/20 transform rotate-45 opacity-50"></div>
        </div>

        <h1 className="text-6xl text-zinc-200 lg:text-6xl xl:text-7xl font-bold tracking-tight m-4 relative z-10">
          Maximize Sales,{" "}
          <span
            style={{
              backgroundImage:
                "linear-gradient(to top right, #4c0d2e, #db2777, #ffffff)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Optimize Pricing{" "}
          </span>
          Across Regions!
        </h1>
        <p className="mt-8 text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto relative z-10">
          Capture 85% of the untapped market with dynamic, location-based
          pricing strategies to ensure you&apos;re always offering competitive
          rates.
        </p>
        <Button
          size="lg"
          className="text-lg p-6 bg-background/0 rounded-full border-2 hover:bg-background/0 gap-2 mt-5 relative z-10 border-pink-500/50 hover:border-pink-500 transition-colors duration-300"
        >
          Get started for free →
        </Button>
      </section>

      {/* About Section with Creative Scroll Progress */}
      <section
        id="about"
        ref={aboutRef}
        className="relative container mx-auto py-24 min-h-[100vh] flex flex-col items-center justify-center mr-4"
      >
        <div className="fixed top-1/2 -translate-y-1/2 left-8 md:left-16 z-10 hidden md:flex flex-col items-center gap-3">
          <div className="relative h-64 w-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute bottom-0 w-full bg-gradient-to-t from-pink-700 via-pink-600 to-zinc-500"
              style={{
                height: horizontalProgress,
                filter: "drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))",
              }}
            />
          </div>
        </div>

        {/* Content with animated sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              About SaaS
            </h2>
            <p className="text-lg text-zinc-400">
              Founded in 2023, SaaS has revolutionized how businesses approach
              regional pricing strategies. Our platform uses advanced AI
              algorithms to analyze market conditions and consumer behavior
              across different regions.
            </p>
            <p className="text-lg text-zinc-400">
              With SaaS, businesses have seen an average increase of 32% in
              conversion rates and 28% in revenue within the first three months.
            </p>
            <div className="pt-4">
              <Button
                size="lg"
                className="text-lg p-6 bg-background/0 rounded-full border-2 hover:bg-background/0 gap-2 relative z-10 border-pink-500/50 hover:border-pink-500 transition-colors duration-300"
              >
                {" "}
                Learn more about our story
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="relative h-[400px] w-full rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-zinc-950 rounded-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/static/image.png"
                  alt="SaaS Dashboard"
                  width={800}
                  height={700}
                  className="rounded-lg shadow-2xl"
                />
              </div>

              {/* Animated dots */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-pink-300/50 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: circleOpacity,
                    scale: textScale,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mt-24 w-full">
          <h3 className="text-2xl font-bold text-white text-center mb-12">
            Our Impact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                value: "85%",
                label: "Market Capture",
                color: "from-pink-600 to-pink-400",
              },
              {
                value: "32%",
                label: "Conversion Increase",
                color: "from-pink-600 to-pink-400",
              },
              {
                value: "28%",
                label: "Revenue Growth",
                color: "from-pink-600 to-pink-400",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`}
                  style={{
                    scale:
                      scrollPercentage >= 60 && scrollPercentage <= 80
                        ? scrollPercentage >= 70
                          ? 1.1
                          : 0.9
                        : 1,
                  }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-zinc-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="container mx-auto py-24">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-4">
          Pricing software which pays for itself{" "}
          <span className="text-pink-500">20x</span> over
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {/* Free Plan */}
          <PricingCard
            title="Free"
            price="₹0"
            visits="5K pricing page visits/mo"
            features={["1 product", "SaaS discounts", "Advanced analytics"]}
            color="text-pink-500"
          />

          {/* Basic Plan */}
          <PricingCard
            title="Basic"
            price="₹1900"
            visits="10K pricing page visits/mo"
            features={[
              "5 products",
              "SaaS discounts",
              "Advanced analytics",
              "Remove Easy SaaS branding",
            ]}
            color="text-pink-500"
            gradient="bg-gradient-to-br from-white/5 to-pink-500/10"
          />

          {/* Standard Plan */}
          <PricingCard
            title="Standard"
            price="₹4900"
            visits="100K pricing page visits/mo"
            features={[
              "30 products",
              "SaaS discounts",
              "Advanced analytics",
              "Remove Easy SaaS branding",
              "Banner customization",
            ]}
            color="text-pink-500"
            popular={true}
            gradient="bg-gradient-to-br from-white/5 to-pink-500/20"
          />

          {/* Premium Plan */}
          <PricingCard
            title="Premium"
            price="₹9900"
            visits="1M pricing page visits/mo"
            features={[
              "50 products",
              "SaaS discounts",
              "Advanced analytics",
              "Remove Easy SaaS branding",
              "Banner customization",
            ]}
            color="text-pink-500"
            gradient="bg-gradient-to-br from-white/5 to-pink-500/10"
          />
        </div>
      </section>

      <footer className="bg-[#030712] py-12 text-white mt-16">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 px-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full text-pink-900 text-5xl flex items-center justify-center">
                <MdBusinessCenter />
              </div>
              <span className="text-white text-lg font-bold">SaaS</span>
            </div>
            <p className="text-zinc-400 max-w-md">
              Optimize your pricing strategy across different regions and
              capture untapped markets with our dynamic, location-based pricing
              platform.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              {["Features", "Pricing", "Integrations", "FAQ"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-zinc-400 hover:text-pink-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {["About", "Careers", "Blog", "Legal"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-zinc-400 hover:text-pink-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              {["Contact", "Twitter", "LinkedIn", "GitHub"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-zinc-400 hover:text-pink-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container mx-auto mt-12 pt-6 border-t border-zinc-800">
          <p className="text-zinc-500 text-sm text-center">
            © {new Date().getFullYear()} SaaS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

interface PricingCardProps {
  title: string;
  price: string;
  visits: string;
  features: string[];
  color: string;
  popular?: boolean;
  gradient?: string;
}

function PricingCard({
  title,
  price,
  visits,
  features,
  popular,
}: PricingCardProps) {
  return (
    <Card
      className={`relative border-0 bg-white/5 backdrop-blur-sm text-white overflow-hidden transition duration-300 transform 
      ${
        popular
          ? "shadow-lg shadow-pink-500/50 ring-1 ring-pink-500 scale-105"
          : ""
      } 
      hover:scale-105`}
    >
      {popular && (
        <div className="absolute -right-12 top-8 rotate-45 bg-pink-600 text-white px-12 py-1 text-sm font-medium">
          Most popular
        </div>
      )}
      <CardHeader>
        <h3 className="text-pink-500 text-xl font-medium">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-3xl font-bold">
            {price}{" "}
            <span className="text-lg font-normal text-zinc-400">/mo</span>
          </p>
          <p className="text-sm text-zinc-400 mt-1">{visits}</p>
        </div>
        <Button className="w-full bg-black hover:bg-zinc-900 text-white">
          Get Started
        </Button>
        <ul className="mt-6 space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-pink-500 shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
