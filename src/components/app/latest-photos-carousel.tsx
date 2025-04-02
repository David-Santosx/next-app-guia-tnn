"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

interface Photo {
  id: string;
  title: string;
  description: string | null;
  category: string;
  location: string | null;
  url: string;
  createdAt: string;
  isPublished: boolean;
  photographer: string | null;
}

export default function LatestPhotosCarousel() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setApi] = useState<CarouselApi>();
  
  const plugin = useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  useEffect(() => {
    const fetchLatestPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/photos?limit=3');
        
        if (!response.ok) {
          throw new Error('Failed to fetch photos');
        }
        
        const data = await response.json();
        setPhotos(data.photos);
      } catch (err) {
        setError('Não foi possível carregar as fotos recentes');
        console.error('Error fetching latest photos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPhotos();
  }, []);

  const translateCategory = (category: string): string => {
    const translations: Record<string, string> = {
      'general': 'Geral',
      'landscape': 'Paisagem',
      'city': 'Cidade',
      'event': 'Eventos',
      'people': 'Pessoas',
      'architecture': 'Arquitetura',
      'nature': 'Natureza',
      'history': 'História',
      'culture': 'Cultura',
    };
    
    return translations[category] || category;
  };

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p>Nenhuma foto disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Últimas Fotos</h2>
      
      <Carousel 
        className="w-full"
        plugins={[plugin.current]}
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
      >
        <CarouselContent>
          {photos.map((photo) => (
            <CarouselItem 
              key={photo.id} 
              className="md:basis-1/2 lg:basis-1/3"
            >
              <div>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={photo.url}
                        alt={photo.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-2 right-2 bg-brand-primary text-white text-xs px-2 py-1 rounded-full">
                        {translateCategory(photo.category)}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold line-clamp-1">{photo.title}</h3>
                      {photo.location && (
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="line-clamp-1">{photo.location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}