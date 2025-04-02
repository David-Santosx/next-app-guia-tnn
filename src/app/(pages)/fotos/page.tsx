"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, MapPin, X, Calendar, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface Photo {
  id: string;
  title: string;
  description: string | null;
  category: string;
  location: string | null;
  url: string;
  photographer: string | null;
  uploadedAt: string;
}

export default function FotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  // Function to translate categories to Portuguese
  const translateCategory = (category: string): string => {
    const translations: Record<string, string> = {
      'general': 'Geral',
      'landscape': 'Paisagem',
      'city': 'Cidade',
      'event': 'Eventos',
      'people': 'Pessoas',
      'architecture': 'Arquitetura',
      'nature': 'Natureza',
    };
    
    return translations[category.toLowerCase()] || category;
  };

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch('/api/photos');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar as fotos');
        }
        
        const data = await response.json();
        setPhotos(data.photos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro ao carregar as fotos');
        console.error('Error fetching photos:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPhotos();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Galeria de Fotos</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore as belezas e momentos especiais de Terra Nova do Norte através da nossa galeria de fotos.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-2 text-sm"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200 animate-pulse"></div>
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 bg-gray-200 mb-2" />
                <Skeleton className="h-4 w-1/2 bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Nenhuma foto encontrada</h3>
          <p className="text-gray-500 mb-4">
            Estamos trabalhando para adicionar fotos à nossa galeria.
          </p>
        </div>
      ) : (
        // Bento grid layout for the photo gallery
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[250px]">
          {photos.map((photo, index) => {
            // Determine the size of each card based on its position
            // This creates the bento grid effect with varying sizes
            const isLarge = index % 5 === 0; // Every 5th item is large
            const isMedium = index % 7 === 3; // Every 7th item (starting at 3) is medium
            
            const sizeClasses = isLarge 
              ? "md:col-span-2 md:row-span-2" 
              : isMedium 
                ? "md:col-span-2 md:row-span-1" 
                : "col-span-1 row-span-1";
            
            return (
              <div 
                key={photo.id} 
                className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ${sizeClasses}`}
              >
                <div 
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold mb-1 line-clamp-1">{photo.title}</h3>
                    <div className="flex flex-wrap gap-1 mb-1">
                      <Badge variant="outline" className="text-xs bg-white/20 text-white border-none">
                        {translateCategory(photo.category)}
                      </Badge>
                    </div>
                    {photo.location && (
                      <p className="flex items-center gap-1 text-xs text-white/80">
                        <MapPin className="h-3 w-3" /> {photo.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-gray-500">
          Tem fotos interessantes da cidade? Entre em contato conosco para compartilhar!
        </p>
      </div>

      {/* Photo Modal with Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-6xl p-0 overflow-hidden bg-white rounded-xl sm:pt-0 pt-10">
          <div className="fixed top-4 right-4 z-[100] sm:absolute">
            <DialogClose className="rounded-full bg-white/90 p-2 shadow-md hover:bg-white transition-colors">
              <X className="h-5 w-5 text-gray-700" />
            </DialogClose>
          </div>
          
          {selectedPhoto && (
            <div className="flex flex-col">
              <div className="relative h-[450px] w-full">
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <DialogTitle className="text-2xl font-bold mb-2 drop-shadow-md">{selectedPhoto.title}</DialogTitle>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className="bg-brand-primary border-none text-white">
                      {translateCategory(selectedPhoto.category)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {selectedPhoto.description && (
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                      <Info className="h-4 w-4 text-brand-primary" /> Descrição
                    </h3>
                    <p className="text-gray-700">{selectedPhoto.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedPhoto.location && (
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <MapPin className="h-5 w-5 text-brand-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-800">Localização</h3>
                        <p className="text-gray-600">{selectedPhoto.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedPhoto.photographer && (
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                      <Camera className="h-5 w-5 text-brand-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-800">Fotógrafo</h3>
                        <p className="text-gray-600">{selectedPhoto.photographer}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <Calendar className="h-5 w-5 text-brand-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-800">Data</h3>
                      <p className="text-gray-600">
                        {new Date(selectedPhoto.uploadedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}