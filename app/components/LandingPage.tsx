"use client";

import Link from "next/link";
import Image from "next/image";
import TrueFocus from "./TrueFocus";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black relative">
      <div className="absolute top-24 right-8">
        <Image
          src="https://trendspider.com/blog/wp-content/uploads/2024/10/meta-logo.jpg"
          alt="Meta Logo"
          width={400}
          height={200}
          className="object-contain"
        />
      </div>

      <div className="absolute bottom-24 left-8">
        <Image
          src="https://trendspider.com/blog/wp-content/uploads/2024/10/meta-logo.jpg"
          alt="Meta Logo"
          width={400}
          height={200}
          className="object-contain"
        />
      </div>

      <div className="text-center space-y-8 max-w-3xl px-8">
        <TrueFocus
          sentence="Cosmic Nexus"
          manualMode={false}
          blurAmount={5}
          borderColor="#C0C0C0"
          glowColor="rgba(192,192,192,0.6)"
          activeColor="#EBF73F"
          animationDuration={2}
          pauseBetweenAnimations={1}
        />
        <p className="text-xl text-[#C0C0C0] leading-relaxed">
          An immersive AI-powered exploration experience. Journey through procedurally generated realms, interact with intelligent NPCs, discover artifacts, and experience AI-generated environments, soundscapes, and narratives.
        </p>
        <Link
          href="/app"
          className="inline-block bg-[#EBF73F] hover:bg-[#141414] text-black hover:text-white font-bold text-xl py-5 px-12 transition duration-200 shadow-lg relative"
        >
          <span className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white"></span>
          <span className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white"></span>
          <span className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white"></span>
          <span className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white"></span>
          Get Started
        </Link>
      </div>
    </div>
  );
}


