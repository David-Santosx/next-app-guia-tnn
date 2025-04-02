"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2, Pencil, Plus, ImageIcon, Filter, RefreshCw, AlertCircle, MapPin, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  uploadedBy: {
    id: string;
    name: string;
  };
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

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

  const fetchPhotos = async (categoryFilter?: string) => {
    setIsRefreshing(true);
    try {
      const url = categoryFilter && categoryFilter !== "all" 
        ? `/api/photos?category=${categoryFilter}&admin=true` 
        : '/api/photos?admin=true';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      
      const data = await response.json();
      setPhotos(data.photos);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching photos:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // Debug log to check date formats
    console.log("Photos data:", photos);
  }, []);

  useEffect(() => {
    if (category !== "all") {
      fetchPhotos(category);
    } else {
      fetchPhotos();
    }
  }, [category]);

  async function deletePhoto(id: string) {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }
      
      // Remove the deleted photo from the state
      setPhotos(photos.filter(photo => photo.id !== id));
      setPhotoToDelete(null);
    } catch (err) {
      console.error('Error deleting photo:', err);
    } finally {
      setIsDeleting(false);
    }
  }

  // Get unique categories for filter
  const categories = ["all", ...new Set(photos.map(photo => photo.category))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-white">Fotos</h1>
        <p className="text-slate-400">Gerencie as fotos do site</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.filter(cat => cat !== "all").map((cat) => (
                <SelectItem key={cat} value={cat}>{translateCategory(cat)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
            onClick={() => fetchPhotos(category !== "all" ? category : undefined)}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        <Link href="/dashboard/fotos/add">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Foto
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-300">
          <AlertTitle className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Erro ao carregar fotos
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button 
            variant="outline" 
            onClick={() => fetchPhotos()}
            className="mt-2 border-red-800 hover:bg-red-900/30"
          >
            Tentar novamente
          </Button>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-slate-900 border-slate-800 overflow-hidden">
              <div className="h-48 bg-slate-800 animate-pulse"></div>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 bg-slate-800 mb-2" />
                <Skeleton className="h-4 w-1/2 bg-slate-800" />
                <div className="flex justify-between items-center mt-4">
                  <Skeleton className="h-4 w-20 bg-slate-800" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8 rounded-md bg-slate-800" />
                    <Skeleton className="h-8 w-8 rounded-md bg-slate-800" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-10 border border-dashed border-slate-700 rounded-lg">
          <ImageIcon className="h-12 w-12 mx-auto text-slate-500 mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">Nenhuma foto encontrada</h3>
          <p className="text-slate-400 mb-4">
            {category !== "all" 
              ? `Não há fotos na categoria "${translateCategory(category)}".` 
              : "Comece adicionando fotos para exibir no site."}
          </p>
          {category !== "all" ? (
            <Button variant="outline" onClick={() => setCategory("all")} className="mr-2">
              Ver todas as categorias
            </Button>
          ) : null}
          <Link href="/dashboard/fotos/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Foto
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <Card key={photo.id} className="bg-slate-900 border-slate-800 overflow-hidden">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={photo.url}
                  alt={photo.title}
                  fill
                  className="object-cover transition-opacity group-hover:opacity-80"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {!photo.isPublished && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-yellow-900/60 text-yellow-300 border-yellow-800">
                      Não publicada
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-1 truncate">{photo.title}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="text-xs bg-slate-800 text-slate-300 border-slate-700">
                    {translateCategory(photo.category)}
                  </Badge>
                  {!photo.isPublished && (
                    <Badge variant="outline" className="text-xs bg-yellow-900/30 text-yellow-300 border-yellow-900">
                      Não publicada
                    </Badge>
                  )}
                </div>
                {photo.description && (
                  <p className="text-sm text-slate-400 line-clamp-2 mb-2">{photo.description}</p>
                )}
                {photo.location && (
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                    <MapPin className="h-3 w-3" /> {photo.location}
                  </p>
                )}
                {photo.photographer && (
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Camera className="h-3 w-3" /> Foto: {photo.photographer}
                  </p>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-slate-800 mt-2">
                <span className="text-xs text-slate-500">
                  {photo.createdAt && !isNaN(new Date(photo.createdAt).getTime()) 
                    ? new Date(photo.createdAt).toLocaleDateString('pt-BR') 
                    : 'Data desconhecida'}
                </span>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-slate-400 hover:text-blue-400 hover:bg-slate-800"
                    onClick={() => router.push(`/dashboard/fotos/edit/${photo.id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-400 hover:bg-slate-800"
                    onClick={() => setPhotoToDelete(photo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!photoToDelete} onOpenChange={(open) => !open && setPhotoToDelete(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription className="text-slate-400">
              Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setPhotoToDelete(null)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => photoToDelete && deletePhoto(photoToDelete)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
