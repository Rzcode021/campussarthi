import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Building2, FileText, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { Bookmark as BookmarkType } from '../store/useAppStore';

export default function BookmarksPage() {
  const bookmarks = useAppStore((state) => state.bookmarks);
  const removeBookmark = useAppStore((state) => state.removeBookmark);

  const handleRemove = (id: string) => {
    removeBookmark(id);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <header className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
              <Bookmark size={20} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-extrabold text-white">Your Bookmarks</h1>
          </div>
          <p className="text-neutral-500 text-sm ml-13">Saved companies, questions, and resources for quick access.</p>
        </motion.div>
      </header>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {bookmarks.map((bookmark) => (
              <BookmarkCard key={bookmark.id} bookmark={bookmark} onRemove={() => handleRemove(bookmark.id)} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 rounded-[2rem] border border-dashed border-neutral-800"
        >
          <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center mx-auto mb-6 text-neutral-700">
            <Bookmark size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No bookmarks yet</h2>
          <p className="text-neutral-500 mb-8 max-w-xs mx-auto">Start saving companies and resources to see them here.</p>
          <Link to="/companies" className="btn-gold px-8 py-3">Browse Companies</Link>
        </motion.div>
      )}
    </div>
  );
}

function BookmarkCard({ bookmark, onRemove }: { bookmark: BookmarkType; onRemove: () => void }) {
  const { type, title, url } = bookmark;
  
  const icon = type === 'company' ? <Building2 size={20} /> : <FileText size={20} />;
  const accentColor = type === 'company' ? '#818CF8' : '#10B981';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -5 }}
      className="p-6 rounded-3xl border border-white/5 bg-[#141B2D] relative group overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.preventDefault(); onRemove(); }}
          className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div 
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: `${accentColor}15`, color: accentColor, border: `1px solid ${accentColor}30` }}
      >
        {icon}
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            {type}
          </span>
          <Sparkles size={10} className="text-gold-gradient" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 truncate">
          {title}
        </h3>
      </div>

      <Link 
        to={url}
        className="flex items-center justify-between group/link"
      >
        <span className="text-sm font-bold text-white group-hover/link:text-gold-gradient transition-colors">View Details</span>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/link:bg-gold-gradient group-hover/link:text-black transition-all">
          <ArrowRight size={16} />
        </div>
      </Link>
    </motion.div>
  );
}
