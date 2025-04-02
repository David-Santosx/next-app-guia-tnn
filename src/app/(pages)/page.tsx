"use client";

import FormSuggestion from "@/components/app/form-suggestion";
import SlideAdRectangular from "@/components/app/slide-ad-rectangular";
import LatestPhotosCarousel from "@/components/app/latest-photos-carousel";
import Image from "next/image";
import { useEffect, useState } from "react";
import QuickNavCards from "@/components/app/quick-nav-cards";

function TypewriterText({
  text,
  delay = 50,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, delay, text]);

  return (
    <div className={className}>
      {displayText}
      {!isComplete && <span className="animate-pulse">|</span>}
    </div>
  );
}

function HomeSection() {
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), 2500);
    const buttonTimer = setTimeout(() => setShowButton(true), 5000);

    return () => {
      clearTimeout(subtitleTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <section className="w-full flex flex-col items-center space-y-12">
      {/* Hero section with background image */}
      <div className="w-full relative">
        <div className="relative w-full h-[600px] md:h-[600px] sm:h-[500px]">
          <Image
            src="https://portalmatogrosso.com.br/wp-content/uploads/restore/2020/04/14/cccbff3632361cab2f28c6ca67d3e697.jpg"
            alt="Vista panorâmica de Terra Nova do Norte"
            fill
            className="object-cover brightness-[0.45] rounded-md"
            sizes="100vw"
            priority
          />
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
          <div className="text-center max-w-4xl">
            <h3 className="text-brand-primary font-extrabold text-2xl sm:text-3xl md:text-4xl mb-2 drop-shadow-md h-12">
              {showSubtitle && (
                <TypewriterText text="Conheça nossa cidade" delay={80} />
              )}
            </h3>
            <h1 className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl mb-6 drop-shadow-lg h-20">
              <TypewriterText text="Terra Nova do Norte" delay={120} />
            </h1>

            <div className="w-24 h-1 bg-brand-primary mx-auto mb-8 rounded-full"></div>

            <p className="text-white text-lg md:text-xl leading-relaxed max-w-3xl mx-auto drop-shadow-md">
              Bem-vindo a Terra Nova do Norte, uma joia escondida no coração de
              Mato Grosso. Fundada em 1986, nossa cidade encanta visitantes com
              sua rica história de colonização sulista, belas paisagens naturais
              e uma comunidade acolhedora que preserva suas tradições com
              orgulho.
            </p>

            <div
              className={`mt-8 transition-opacity duration-700 ${
                showButton ? "opacity-100" : "opacity-0"
              }`}
            >
              <button className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg">
                Conheça mais
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Localização</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-6">
          Terra Nova do Norte está localizada na região norte do estado de Mato
          Grosso, a aproximadamente 630 km da capital Cuiabá. Confira no mapa
          abaixo a localização exata e planeje sua visita à nossa cidade.
        </p>
      </div>

      {/* Map section - full width */}
      <div className="w-full -mx-4 md:mx-0">
        <iframe
          className="w-full h-[400px]"
          width="100%"
          height="400"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=Terra%20Nova%20do%20Norte+(Terra%20Nova%20do%20Norte)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
        >
          <a href="https://www.gps.ie/collections/drones/">drone quadcopter</a>
        </iframe>
      </div>

      <div className="w-full px-4">
        <QuickNavCards />
      </div>

      <div className="w-full px-4">
        <LatestPhotosCarousel />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row items-start w-full mt-8 px-0 md:px-4 space-y-8 md:space-y-0 md:space-x-8">
      <div className="w-full md:w-3/4">
        <HomeSection />
      </div>
      <div className="w-full md:w-1/4 space-y-5 flex flex-col items-center justify-start border p-3 rounded-md mx-auto md:mx-0 max-w-[90%] md:max-w-full">
        <FormSuggestion />
        <SlideAdRectangular />
      </div>
    </main>
  );
}
