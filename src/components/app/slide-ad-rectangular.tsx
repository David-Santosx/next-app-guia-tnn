import Image from "next/image";

export default function SlideAdRectangular() {
  return (
    <div className="w-full rounded-md overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: "6/5" }}>
        <Image
          src="https://fakeimg.pl/300x250?text=Publicidade&font=bebas"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 300px"
          className="object-cover"
          alt="Imagem de propaganda retangular"
        />
      </div>
    </div>
  );
}
