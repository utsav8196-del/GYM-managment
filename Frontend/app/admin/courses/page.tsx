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

type Course = {
  _id: string;
  title: string;
  description: string;
  image: string;
  type: 'personal' | 'group';
  order: number;
  prices: {
    lower: number;
    medium: number;
    higher: number;
  };
  createdAt?: string;
  updatedAt?: string;
};

type ApiResponse<T> = {
  status?: string;
  message?: string;
  data?: T | T[];
};

type CourseForm = {
  title: string;
  description: string;
  image: string;
  type: 'personal' | 'group';
  order: string;
  lowerPrice: string;
  mediumPrice: string;
  higherPrice: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const TYPE_OPTIONS: Array<'personal' | 'group'> = ['personal', 'group'];

const emptyForm: CourseForm = {
  title: '',
  description: '',
  image: '',
  type: 'personal',
  order: '0',
  lowerPrice: '',
  mediumPrice: '',
  higherPrice: '',
};

const formatDateTime = (value?: string) => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'N/A';
  return parsed.toLocaleString();
};

const toFormState = (course: Course): CourseForm => ({
  title: course.title || '',
  description: course.description || '',
  image: course.image || '',
  type: course.type || 'personal',
  order: String(course.order ?? 0),
  lowerPrice: String(course.prices?.lower ?? ''),
  mediumPrice: String(course.prices?.medium ?? ''),
  higherPrice: String(course.prices?.higher ?? ''),
});

async function parseApiError(res: Response) {
  try {
    const payload = (await res.json()) as ApiResponse<unknown>;
    return payload.message || 'Request failed';
  } catch {
    return 'Request failed';
  }
}

export default function AdminCoursesPage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [editingId, setEditingId] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  const [form, setForm] = useState<CourseForm>(emptyForm);
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

    const loadCourses = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`${API_URL}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          const message = await parseApiError(res);
          throw new Error(message);
        }

        const payload = (await res.json()) as ApiResponse<Course>;
        const list = Array.isArray(payload.data) ? payload.data : [];
        if (active) {
          setCourses(list);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load courses');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadCourses();

    return () => {
      active = false;
    };
  }, [authLoading, token, user?._id, user?.role, reloadCount]);

  const sortedCourses = useMemo(
    () =>
      [...courses].sort((a, b) => {
        if (a.order === b.order) {
          return a.title.localeCompare(b.title);
        }
        return a.order - b.order;
      }),
    [courses]
  );

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId('');
  };

  const validateForm = () => {
    if (form.title.trim().length < 3) return 'Title must be at least 3 characters long';
    if (form.description.trim().length < 10) return 'Description must be at least 10 characters long';
    if (!TYPE_OPTIONS.includes(form.type)) return 'Choose a valid type';
    if (!Number.isFinite(Number(form.order))) return 'Order must be a valid number';
    const lowerNum = Number(form.lowerPrice);
    const mediumNum = Number(form.mediumPrice);
    const higherNum = Number(form.higherPrice);
    if (!Number.isFinite(lowerNum) || lowerNum <= 0) return 'Lower price must be a number greater than 0';
    if (!Number.isFinite(mediumNum) || mediumNum <= 0) return 'Medium price must be a number greater than 0';
    if (!Number.isFinite(higherNum) || higherNum <= 0) return 'Higher price must be a number greater than 0';
    if (lowerNum >= mediumNum) return 'Lower price must be less than medium price';
    if (mediumNum >= higherNum) return 'Medium price must be less than higher price';
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
        image: form.image.trim(),
        type: form.type,
        order: Number(form.order),
        lowerPrice: Number(form.lowerPrice),
        mediumPrice: Number(form.mediumPrice),
        higherPrice: Number(form.higherPrice),
      };

      const endpoint = isEditMode ? `${API_URL}/courses/${editingId}` : `${API_URL}/courses`;
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

      setSuccess(isEditMode ? 'Course updated successfully' : 'Course created successfully');
      window.dispatchEvent(new Event('coursesModified'));
      resetForm();
      setReloadCount((current) => current + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (course: Course) => {
    setError('');
    setSuccess('');
    setEditingId(course._id);
    setForm(toFormState(course));
  };

  const handleDelete = async (course: Course) => {
    if (!token || !user || user.role !== 'admin') return;

    const shouldDelete = window.confirm(`Delete "${course.title}"? This action cannot be undone.`);
    if (!shouldDelete) return;

    setDeletingId(course._id);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/courses/${course._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const message = await parseApiError(res);
        throw new Error(message);
      }

      setSuccess('Course deleted successfully');
      window.dispatchEvent(new Event('coursesModified'));
      setReloadCount((current) => current + 1);
      if (editingId === course._id) {
        resetForm();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete course');
    } finally {
      setDeletingId('');
    }
  };

  if (authLoading || loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-secondary py-24">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-primary" size={36} />
          <p className="mt-4 text-sm text-muted-foreground">Loading course manager...</p>
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
          <p className="mt-2 text-sm text-muted-foreground">Only admin users can manage courses.</p>
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
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Admin Courses</p>
            <h1 className="mt-2 text-3xl font-bold uppercase tracking-tight text-foreground">Course CRUD Manager</h1>
            <p className="mt-2 text-sm text-muted-foreground">Create, update, and delete courses with live MongoDB persistence.</p>
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
                {isEditMode ? 'Update Course' : 'Add New Course'}
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
                  placeholder="Personal Training Course"
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
                  placeholder="Write course details..."
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        type: e.target.value as CourseForm['type'],
                      }))
                    }
                    className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    {TYPE_OPTIONS.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
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
                  placeholder="/images/course.jpg"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lower Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.lowerPrice}
                    onChange={(e) => setForm((current) => ({ ...current, lowerPrice: e.target.value }))}
                    className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    placeholder="99.00"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Medium Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.mediumPrice}
                    onChange={(e) => setForm((current) => ({ ...current, mediumPrice: e.target.value }))}
                    className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    placeholder="149.00"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Higher Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.higherPrice}
                    onChange={(e) => setForm((current) => ({ ...current, higherPrice: e.target.value }))}
                    className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    placeholder="199.00"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80 disabled:opacity-70"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : isEditMode ? <Save size={14} /> : <Plus size={14} />}
                {isEditMode ? 'Update Course' : 'Create Course'}
              </button>
            </form>
          </div>

          <div className="border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase tracking-wide text-foreground">Current Courses</h2>
              <span className="border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {sortedCourses.length} Total
              </span>
            </div>

            {sortedCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No courses yet. Add your first course from the form.</p>
            ) : (
              <div className="space-y-3">
                {sortedCourses.map((course) => (
                  <article key={course._id} className="border border-border bg-secondary p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">{course.title}</h3>
                        <p className="mt-1 text-xs uppercase tracking-wider text-primary">
                          {course.type} | order {course.order}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="inline-flex items-center gap-1 border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary"
                        >
                          <PencilLine size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course)}
                          disabled={deletingId === course._id}
                          className="inline-flex items-center gap-1 border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-red-300 hover:bg-red-500/20 disabled:opacity-60"
                        >
                          {deletingId === course._id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                          Delete
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">{course.description}</p>

                    {course.prices && (
                      <div className="mt-3 flex gap-4 text-xs">
                        <span className="font-semibold text-primary">Lower: ${course.prices.lower}</span>
                        <span className="font-semibold text-primary">Medium: ${course.prices.medium}</span>
                        <span className="font-semibold text-primary">Higher: ${course.prices.higher}</span>
                      </div>
                    )}

                    <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                      Updated: {formatDateTime(course.updatedAt)}
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
