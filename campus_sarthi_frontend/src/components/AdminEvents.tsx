import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Trash2, Edit, Image as ImageIcon, Save, X } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useToast } from '../context/ToastContext';

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

export default function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form, setForm] = useState({ title: '', description: '', date: '' });
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getAdminEvents();
      setEvents(res.data as any);
    } catch (err) {
      console.error('Failed to fetch events:', err);
      showToast('Failed to fetch events', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editingEvent) {
        await adminApi.updateEvent(editingEvent.id, form);
        showToast('Event updated successfully', 'success');
      } else {
        await adminApi.createEvent(form);
        showToast('Event created successfully', 'success');
      }
      setShowModal(false);
      setEditingEvent(null);
      setForm({ title: '', description: '', date: '' });
      fetchEvents();
    } catch (err) {
      console.error('Event save error:', err);
      showToast('Action failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await adminApi.deleteEvent(id);
      showToast('Event deleted', 'info');
      fetchEvents();
    } catch (err) {
      console.error('Delete event error:', err);
      showToast('Delete failed', 'error');
    }
  };

  const handleImageUpload = async (eventId: number, file: File) => {
    if (!file) return;
    setUploadingImage(eventId);
    const fd = new FormData();
    fd.append('image', file);
    fd.append('event', String(eventId));
    try {
      await adminApi.addEventImage(eventId, fd);
      showToast('Image uploaded successfully', 'success');
      fetchEvents();
    } catch (err) {
      console.error('Image upload error:', err);
      showToast('Upload failed — check file size/format', 'error');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await adminApi.deleteEventImage(imageId);
      showToast('Image removed', 'info');
      fetchEvents();
    } catch {
      showToast('Failed to remove image', 'error');
    }
  };

  if (isLoading) return <div className="py-12 text-center text-muted">Loading events...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-heading text-lg flex items-center gap-2">
          <Calendar size={20} className="text-primary" />
          Event Management
        </h2>
        <button
          onClick={() => {
            setEditingEvent(null);
            setForm({ title: '', description: '', date: '' });
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="card p-6 flex flex-col group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-heading text-lg">{event.title}</h3>
                {event.date && (
                  <p className="text-xs text-muted flex items-center gap-1 mt-1">
                    <Calendar size={12} /> {new Date(event.date).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingEvent(event);
                    setForm({ title: event.title, description: event.description, date: event.date });
                    setShowModal(true);
                  }}
                  className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-danger flex items-center justify-center hover:bg-danger hover:text-white transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-muted line-clamp-2 mb-6">{event.description}</p>

            <div className="mt-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Gallery ({event.images?.length ?? 0})</span>
                <label className="cursor-pointer text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  <Plus size={12} /> Add Photo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(event.id, e.target.files[0])}
                    disabled={uploadingImage === event.id}
                  />
                </label>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {(event.images ?? []).map((img) => (
                  <div key={img.id} className="relative group/img w-14 h-14 rounded-lg overflow-hidden border border-border">
                    <img src={img.image} className="w-full h-full object-cover" alt="Gallery" />
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
                {uploadingImage === event.id && (
                  <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center border border-dashed border-primary animate-pulse">
                    <ImageIcon size={16} className="text-primary" />
                  </div>
                )}
                {(!event.images || event.images.length === 0) && uploadingImage !== event.id && (
                  <div className="text-xs text-muted italic">No photos uploaded yet</div>
                )}
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted card border-dashed">
            No events found. Click "Create Event" to get started.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface">
              <h3 className="font-bold text-heading">{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-body"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Event Title *</label>
                <input
                  type="text"
                  className="form-input w-full"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. SAGAR SAMARTHYA"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  className="form-input w-full min-h-[100px] resize-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What is this event about?"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-1.5">Date</label>
                <input
                  type="date"
                  className="form-input w-full"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full btn-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Save size={18} /> {saving ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
