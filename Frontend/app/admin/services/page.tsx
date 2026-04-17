'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  PencilLine,
  Plus,
  RefreshCcw,
  Save,
  ShieldAlert,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Service = {
  _id: string;
  title: string;
  description: string;
  icon: 'Dumbbell' | 'Flame' | 'HeartPulse';
  image?: string;
  shortText?: string;
  highlights?: string[];
  order: number;
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = {
  status?: string;
  message?: string;
  data?: T | T[];
};

type ServiceForm = {
  title: string;
  description: string;
  icon: 'Dumbbell' | 'Flame' | 'HeartPulse';
  image: string;
  shortText: string;
  highlightsText: string;
  order: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gym-managment-two.vercel.app/api/v1';
const ICON_OPTIONS: Array<ServiceForm['icon']> = ['Dumbbell', 'Flame', 'HeartPulse'];

const emptyForm: ServiceForm = {
  title: '',
  description: '',
  icon: 'Dumbbell',
  image: '',
  shortText: '',
  highlightsText: '',
  order: '0',
};

const formatDateTime = (value?: string) => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'N/A';
  return parsed.toLocaleString();
};

const parseHighlights = (value: string) =>
  value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 6);

const toFormState = (service: Service): ServiceForm => ({
  title: service.title || '',
  description: service.description || '',
  icon: service.icon || 'Dumbbell',
  image: service.image || '',
  shortText: service.shortText || '',
  highlightsText: Array.isArray(service.highlights) ? service.highlights.join('\n') : '',
  order: String(service.order ?? 0),
});

async function parseApiError(res: Response) {
  try {
    const payload = (await res.json()) as ApiResponse<unknown>;
    return payload.message || 'Request failed';
  } catch {
    return 'Request failed';
  }
}

export default function AdminServicesPage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [editingId, setEditingId] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isEditMode = editingId.length > 0;

  useEffect(() => {
    if (authLoading) return;
    if (!token) router.push('/login');
  }, [authLoading, token, router]);

  useEffect(() => {
    if (authLoading || !token || !user || user.role !== 'admin') return;

    let active = true;

    const loadServices = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`${API_URL}/services/admin/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          const message = await parseApiError(res);
          throw new Error(message);
        }

        const payload = (await res.json()) as ApiResponse<Service>;
        const list = Array.isArray(payload.data) ? payload.data : [];
        if (active) {
          setServices(list);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load services');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadServices();

    return () => {
      active = false;
    };
  }, [authLoading, token, user?._id, user?.role, reloadCount]);

  const sortedServices = useMemo(
    () =>
      [...services].sort((a, b) => {
        if (a.order === b.order) {
          return a.title.localeCompare(b.title);
        }
        return a.order - b.order;
      }),
    [services]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId('');
  };

  const validateForm = () => {
    if (form.title.trim().length < 3) return 'Title must be at least 3 characters long';
    if (form.description.trim().length < 10) return 'Description must be at least 10 characters long';
    if (!ICON_OPTIONS.includes(form.icon)) return 'Choose a valid icon';
    if (!Number.isFinite(Number(form.order))) return 'Order must be a valid number';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user || user.role !== 'admin') return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        icon: form.icon,
        image: form.image.trim(),
        shortText: form.shortText.trim(),
        highlights: parseHighlights(form.highlightsText),
        order: Number(form.order),
      };

      const endpoint = isEditMode ? `${API_URL}/services/${editingId}` : `${API_URL}/services`;
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const message = await parseApiError(res);
        throw new Error(message);
      }

      setSuccess(isEditMode ? 'Service updated successfully' : 'Service created successfully');
      // notify other components (e.g. public services page) that list changed
      window.dispatchEvent(new Event('servicesModified'));
      resetForm();
      setReloadCount((current) => current + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setError('');
    setSuccess('');
    setEditingId(service._id);
    setForm(toFormState(service));
  };

  const handleDelete = async (service: Service) => {
    if (!token || !user || user.role !== 'admin') return;

    const shouldDelete = window.confirm(`Delete "${service.title}"? This action cannot be undone.`);
    if (!shouldDelete) return;

    setDeletingId(service._id);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/services/${service._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const message = await parseApiError(res);
        throw new Error(message);
      }

      setSuccess('Service deleted successfully');
      window.dispatchEvent(new Event('servicesModified'));
      setReloadCount((current) => current + 1);
      if (editingId === service._id) {
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service');
    } finally {
      setDeletingId('');
    }
  };

  if (authLoading || loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-secondary py-24">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-primary" size={36} />
          <p className="mt-4 text-sm text-muted-foreground">Loading service manager...</p>
        </div>
      </section>
    );
  }

  if (!token) return null;

  if (!user || user.role !== 'admin') {
    return (
      <section className="flex min-h-screen items-center justify-center bg-secondary py-24">
        <div className="w-full max-w-lg border border-border bg-card p-8 text-center">
          <ShieldAlert size={34} className="mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold uppercase tracking-tight text-foreground">Access Restricted</h1>
          <p className="mt-2 text-sm text-muted-foreground">Only admin users can manage services.</p>
          <Link href="/" className="mt-6 inline-flex text-xs font-semibold uppercase tracking-wider text-primary hover:underline">
            Back To Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-secondary py-24">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.2, 0.35, 0.2], scale: [1, 1.06, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border border-border bg-card p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Admin Services</p>
            <h1 className="mt-2 text-3xl font-bold uppercase tracking-tight text-foreground">Service CRUD Manager</h1>
            <p className="mt-2 text-sm text-muted-foreground">Create, update, and delete services with live MongoDB persistence.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setReloadCount((current) => current + 1)}
              className="inline-flex items-center gap-2 border border-border bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
            >
              <RefreshCcw size={14} />
              Refresh
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 border border-border bg-secondary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
            >
              <ArrowLeft size={14} />
              Back To Admin
            </Link>
          </div>
        </div>

        {(error || success) && (
          <div className={`mb-6 border px-4 py-3 text-sm ${error ? 'border-red-500/40 bg-red-500/10 text-red-300' : 'border-green-500/40 bg-green-500/10 text-green-300'}`}>
            {error || success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.3fr]">
          <div className="border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase tracking-wide text-foreground">
                {isEditMode ? 'Update Service' : 'Add New Service'}
              </h2>
              {isEditMode && (
                <button
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
                >
                  <XCircle size={14} />
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                  className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="Personal Training"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                  rows={4}
                  className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="Write service details..."
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Icon</label>
                  <select
                    value={form.icon}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        icon: e.target.value as ServiceForm['icon'],
                      }))
                    }
                    className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((current) => ({ ...current, order: e.target.value }))}
                    className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Image URL / Path</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm((current) => ({ ...current, image: e.target.value }))}
                  className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="/images/personal-training.jpg"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Short Text</label>
                <input
                  value={form.shortText}
                  onChange={(e) => setForm((current) => ({ ...current, shortText: e.target.value }))}
                  className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="Strength and resistance coaching"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Highlights</label>
                <textarea
                  value={form.highlightsText}
                  onChange={(e) => setForm((current) => ({ ...current, highlightsText: e.target.value }))}
                  rows={4}
                  className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder={'One per line or comma separated\n1-on-1 Coaching\nProgram Tracking'}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80 disabled:opacity-70"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : isEditMode ? <Save size={14} /> : <Plus size={14} />}
                {isEditMode ? 'Update Service' : 'Create Service'}
              </button>
            </form>
          </div>

          <div className="border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase tracking-wide text-foreground">Current Services</h2>
              <span className="border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {sortedServices.length} Total
              </span>
            </div>

            {sortedServices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No services yet. Add your first service from the form.</p>
            ) : (
              <div className="space-y-3">
                {sortedServices.map((service) => (
                  <article key={service._id} className="border border-border bg-secondary p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">{service.title}</h3>
                        <p className="mt-1 text-xs uppercase tracking-wider text-primary">
                          {service.icon} | order {service.order}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="inline-flex items-center gap-1 border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
                        >
                          <PencilLine size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service)}
                          disabled={deletingId === service._id}
                          className="inline-flex items-center gap-1 border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-red-300 hover:bg-red-500/20 disabled:opacity-60"
                        >
                          {deletingId === service._id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">{service.description}</p>
                    {!!service.shortText && <p className="mt-2 text-xs text-primary">{service.shortText}</p>}

                    {Array.isArray(service.highlights) && service.highlights.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {service.highlights.map((item) => (
                          <span
                            key={`${service._id}-${item}`}
                            className="border border-border bg-card px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                      Updated: {formatDateTime(service.updatedAt)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
