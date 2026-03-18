"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

type GalleryItem = {
  _id?: string
  title: string
  image: string
}

const fallbackGalleryImages: GalleryItem[] = [
  { title: "Training Session 1", image: "/images/1.jpeg" },
  { title: "Training Session 2", image: "/images/2.jpeg" },
  { title: "Training Session 3", image: "/images/3.jpeg" },
  { title: "Training Session 4", image: "/images/4.jpeg" },
  { title: "Training Session 5", image: "/images/5.jpeg" },
  { title: "Training Session 6", image: "/images/6.jpeg" },
  { title: "Training Session 7", image: "/images/7.jpeg" },
  { title: "Training Session 8", image: "/images/8.jpeg" },
  { title: "Training Session 9", image: "/images/9.jpeg" },
  { title: "Training Session 10", image: "/images/10.jpeg" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  },
}

export function Gallery() {
  const { ref, isVisible } = useScrollAnimation(0.05)
  const [images, setImages] = useState<GalleryItem[]>(fallbackGalleryImages)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadGallery = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        
        if (res.ok) {
          const payload = await res.json()
          const list = Array.isArray(payload.data) ? (payload.data as GalleryItem[]) : []
          if (!cancelled && list.length > 0) {
            setImages(list)
          }
        }
      } catch (err) {
        if (!cancelled) {
          setImages(fallbackGalleryImages)
        }
      }
    }

    void loadGallery()

    return () => {
      cancelled = true
    }
  }, [])

  const getImageSize = (index: number) => {
    const pattern = [
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
    ]
    return pattern[index % pattern.length]
  }

  return (
    <section className="relative w-full py-32 lg:py-48 bg-gradient-to-b from-secondary via-secondary to-background" ref={ref}>
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="mb-20 text-center"
        >
          <motion.span 
            className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.4em] text-primary"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            ◆ Our Gallery ◆
          </motion.span>
          <motion.h2 
            className="text-5xl md:text-6xl font-black uppercase tracking-tight text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Training <span className="text-primary">Highlights</span>
          </motion.h2>
          <motion.p 
            className="mx-auto max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Explore our dynamic collection of fitness moments, athlete achievements, and gym transformations that inspire our community.
          </motion.p>
        </motion.div>

        {images && images.length > 0 ? (
          <>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 auto-rows-[280px] gap-4 md:gap-5 w-full mb-12"
              variants={containerVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
            >
              {images.map((item, i) => (
                <motion.div
                  key={item._id || `gallery-item-${i}`}
                  variants={itemVariants}
                  className={`${getImageSize(i)} group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-200`}
                  onClick={() => setSelectedImage(item.image)}
                >
                  <Image
                    src={item.image}
                    alt={item.title || `Gallery image ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
                    quality={100}
                    priority={i < 6}
                  />
                  
                  {/* Overlay - Bottom to Top Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon and Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      whileHover={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.4 }}
                      className="mb-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/30 border-2 border-primary flex items-center justify-center backdrop-blur-md">
                        <svg className="w-7 h-7 text-primary" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                        </svg>
                      </div>
                    </motion.div>
                    <p className="text-white font-bold text-center text-sm md:text-base px-4 opacity-100">
                      {item.title}
                    </p>
                  </div>

                  {/* Border Animation */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </motion.div>
              ))}
            </motion.div>

            {/* Interactive Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-16 grid grid-cols-3 gap-4 md:gap-8 bg-primary/5 rounded-2xl p-8 md:p-12 backdrop-blur-sm border border-primary/10"
            >
              <div className="text-center">
                <motion.h3 
                  className="text-2xl md:text-4xl font-black text-primary mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {images.length}+
                </motion.h3>
                <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">Gallery Images</p>
              </div>
              <div className="text-center border-l border-r border-primary/20">
                <motion.h3 
                  className="text-2xl md:text-4xl font-black text-primary mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  100%
                </motion.h3>
                <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">Real Moments</p>
              </div>
              <div className="text-center">
                <motion.h3 
                  className="text-2xl md:text-4xl font-black text-primary mb-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  ∞
                </motion.h3>
                <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">Stories</p>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div 
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-muted-foreground">Loading gallery images...</p>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            className="relative w-full max-w-5xl max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Gallery full view"
              fill
              className="w-full h-full object-contain"
              quality={100}
              priority
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-primary hover:bg-primary/80 flex items-center justify-center transition-colors duration-300 shadow-lg"
              aria-label="Close"
            >
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
