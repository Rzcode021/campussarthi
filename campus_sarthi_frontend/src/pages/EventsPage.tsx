import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
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

const FALLBACK_EVENTS: Event[] = [
  { id: 1, title: 'SAGAR SAMARTHYA', description: 'Empowering students with industry-ready skills and technical excellence.', date: '2026-06-15', images: [] },
  { id: 2, title: 'SAGAR SETU', description: 'Bridging the gap between academia and corporate expectations.', date: '2026-07-20', images: [] },
  { id: 3, title: 'SAGAR MANTHAN', description: 'A deep dive into innovation and creative problem solving.', date: '2026-08-05', images: [] },
  { id: 4, title: 'TEDx SISTec', description: 'Ideas worth spreading at the heart of our campus.', date: '2026-09-12', images: [] },
  { id: 5, title: 'HEADSTART', description: 'The official orientation and induction program for future leaders.', date: '2026-10-01', images: [] },
  { id: 6, title: 'MBA HEADSTART', description: 'Kickstarting the journey for our management maestros.', date: '2026-10-05', images: [] },
  { id: 7, title: 'SAGAR GLORY', description: 'Celebrating academic and placement achievements.', date: '2026-11-15', images: [] },
  { id: 8, title: 'POD AI SESSION', description: 'Exploring the future of AI with industry experts.', date: '2026-12-01', images: [] },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/api/events/events/')
      .then((res) => {
        const data: Event[] = res.data;
        // If backend has no events yet, show hardcoded fallbacks
        setEvents(data.length > 0 ? data : FALLBACK_EVENTS);
      })
      .catch(() => {
        // On any error (backend down, network issue) show fallbacks
        setEvents(FALLBACK_EVENTS);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <section className="pt-12 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#60A5FA' }}>
            <ImageIcon size={12} /> Campus Highlights
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Crew <span className="text-gold-gradient">Events</span>
          </h1>
          <p className="max-w-2xl mx-auto text-neutral-500 text-lg">
            Experience the vibrant culture and professional excellence at Campus Sarthi.
          </p>
        </motion.div>
      </section>

      {/* Events Grid */}
      <section className="px-6 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-[400px] rounded-3xl animate-pulse bg-neutral-900" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {events.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}

function EventCard({ event, index }: { event: Event; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
      style={{ background: '#111' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110">
        {event.images && event.images.length > 0 ? (
          <img src={event.images[0].image} alt={event.title} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center">
            <ImageIcon size={48} className="text-neutral-700" />
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Content */}
      <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end">
        <motion.div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-3 mb-3 text-gold-gradient text-xs font-bold tracking-widest uppercase">
            <Calendar size={14} />
            {event.date ? new Date(event.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric', day: 'numeric' }) : 'Coming Soon'}
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gold-gradient transition-colors">
            {event.title}
          </h3>
          <p className="text-neutral-400 text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {event.description}
          </p>
          
          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center gap-2 text-white text-sm font-bold group/btn"
          >
            Explore Event
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-gold-gradient group-hover/btn:text-black transition-all">
              <ArrowRight size={14} />
            </span>
          </Link>
        </motion.div>
      </div>
      
      <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <Sparkles size={20} className="text-gold-gradient" />
      </div>
    </motion.div>
  );
}
