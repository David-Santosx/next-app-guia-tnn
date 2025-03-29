import FormSuggestion from "@/components/app/form-suggestion";
import HighlightCarousel from "@/components/app/highlight-carousel";
import SlideAdRectangular from "@/components/app/slide-ad-rectangular";

function HomeSection() {
  return (
    <section className="w-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row w-full justify-between items-center sm:items-start gap-4 sm:gap-0">
        <div className="flex flex-col text-center sm:text-left">
          <h3 className="text-brand-secondary font-extrabold text-2xl sm:text-3xl md:text-4xl">
            Conheça nossa cidade
          </h3>
          <h1 className="text-brand-primary font-extrabold text-4xl sm:text-5xl md:text-6xl">
            Terra Nova do Norte
          </h1>
        </div>
      </div>
      <p className="text-gray-700 text-lg text-center sm:text-start md:text-xl leading-relaxed">
        Bem-vindo a Terra Nova do Norte, uma joia escondida no coração de Mato
        Grosso. Fundada em 1986, nossa cidade encanta visitantes com sua rica
        história de colonização sulista, belas paisagens naturais e uma
        comunidade acolhedora que preserva suas tradições com orgulho. Com
        aproximadamente 11 mil habitantes, somos conhecidos pela hospitalidade e
        pelo espírito empreendedor que impulsiona nosso desenvolvimento.
      </p>
      
      <div className="mt-8">
        <HighlightCarousel />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="flex flex-col md:flex-row items-center md:items-start w-full md:justify-between mt-5 md:mt-10 md:space-x-5 space-y-8 md:space-y-0">
      <div className="w-full">
        <HomeSection />
      </div>
      <div className="w-full md:w-1/3 lg:w-1/4 space-y-5 flex flex-col items-center justify-center border p-3 rounded-md">
        <FormSuggestion />
        <SlideAdRectangular />
      </div>
    </main>
  );
}
