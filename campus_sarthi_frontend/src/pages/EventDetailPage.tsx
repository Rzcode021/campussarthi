import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, Share2, Sparkles, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

interface EventImage {
  id: number;
  image: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  images: EventImage[];
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    api.get(`/api/events/events/${id}/`)
      .then((res) => setEvent(res.data))
      .catch(() => setEvent(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-white">
        <ImageIcon size={48} className="opacity-20" />
        <h2 className="text-xl font-bold">Event not found</h2>
        <Link to="/events" className="text-sm text-neutral-400 hover:text-white">← Back to Events</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <Link to="/events" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors py-8">
          <ChevronLeft size={18} /> Back to Events
        </Link>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-center gap-3 text-gold-gradient font-bold text-sm tracking-widest uppercase mb-6">
              <Calendar size={16} />
              {event.date
                ? new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                : 'Coming Soon'}
            </div>
            <h1 className="text-5xl font-extrabold text-white mb-8 leading-tight">
              {event.title}
            </h1>
            <p className="text-neutral-400 text-lg leading-relaxed mb-10">
              {event.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                className="btn-gold px-8 py-3 flex items-center gap-2"
                onClick={() => navigator.share?.({ title: event.title, text: event.description })}
              >
                <Share2 size={16} /> Share Event
              </button>
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-neutral-400">
                <Sparkles size={16} className="text-gold-gradient" /> Managed by Placement Crew
              </div>
            </div>
          </motion.div>

          {/* Main Display / Gallery Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative rounded-[2.5rem] overflow-hidden border border-white/5 aspect-[4/5] bg-neutral-900"
          >
            {activeImage || event.images[0]?.image ? (
              <img
                src={activeImage || event.images[0]?.image}
                className="w-full h-full object-cover"
                alt={event.title}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-700">
                <ImageIcon size={64} className="mb-4" />
                <span className="font-medium">No Images Available</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-white">Event Gallery</h2>
            <span className="text-neutral-500 text-sm">Showing {event.images?.length ?? 0} captures</span>
          </div>

          {event.images && event.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {event.images.map((img: EventImage, idx: number) => (
                <motion.div
                  key={img.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => setActiveImage(img.image)}
                  className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border transition-all ${
                    activeImage === img.image ? 'border-yellow-400 ring-2 ring-yellow-400/30' : 'border-white/5'
                  }`}
                >
                  <img src={img.image} alt={`Capture ${idx + 1}`} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-neutral-800 py-20 flex flex-col items-center justify-center text-neutral-600">
              <ImageIcon size={40} className="mb-3 opacity-20" />
              <p>Image captures will be available soon</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
