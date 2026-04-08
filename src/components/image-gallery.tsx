"use client";

import { useState } from "react";

interface GalleryImage {
  src: string;
  alt: string;
}

export function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {images.map((image, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(image)}
            className="flex-none w-[320px] md:w-[400px] aspect-[16/10] rounded-lg overflow-hidden border border-navy/10 hover:border-electric-blue/40 transition-colors snap-start bg-white"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover object-top"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm"
            >
              Fechar ✕
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <p className="text-white/60 text-sm text-center mt-3">
              {selectedImage.alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
