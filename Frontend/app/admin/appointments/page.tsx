'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  RefreshCcw,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

type Appointment = {
  _id: string;
  type: 'personal' | 'group' | 'cardio' | 'strength';
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt?: string;
};

type ApiResponse<T> = {
  status?: string;
  message?: string;
  results?: number;
  data?: T[] | T;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const statusOptions: AppointmentStatus[] = ['pending', 'confirmed', 'cancelled'];

const typeLabel: Record<Appointment['type'], string> = {
  personal: 'Personal Training',
  group: 'Group Session',
  cardio: 'Cardio Session',
  strength: 'Strength Session',
};

const formatDateTime = (value?: string) => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'N/A';
  return parsed.toLocaleString();
};

const parseErrorMessage = async (res: Response) => {
  try {
    const payload = (await res.json()) as ApiResponse<unknown>;
    return payload.message || 'Request failed';
  } catch {
    return 'Request failed';
  }
};

export default function AdminAppointmentsPage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reloadCount, setReloadCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [deletingId, setDeletingId] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!token) router.push('/login');
  }, [authLoading, token, router]);

  useEffect(() => {
    if (authLoading || !token || !user || user.role !== 'admin') return;

    let active = true;

    const loadAppointments = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await fetch(`${API_URL}/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          const message = await parseErrorMessage(res);
          throw new Error(message);
        }

        const payload = (await res.json()) as ApiResponse<Appointment>;
        const list = Array.isArray(payload.data) ? payload.data : [];

        if (active) {
          setAppointments(list);
        }
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load appointments');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadAppointments();

    return () => {
      active = false;
    };
  }, [authLoading, token, user?._id, user?.role, reloadCount]);

  const filteredAppointments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return appointments.filter((item) => {
      const statusPass = statusFilter === 'all' || item.status === statusFilter;
      if (!statusPass) return false;
      if (!keyword) return true;

      return [item.name, item.email, item.phone, item.type, item.date, item.time]
        .join(' ')
        .toLowerCase()
        .includes(keyword);
    });
  }, [appointments, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const pending = appointments.filter((item) => item.status === 'pending').length;
    const confirmed = appointments.filter((item) => item.status === 'confirmed').length;
    const cancelled = appointments.filter((item) => item.status === 'cancelled').length;
    return {
      total: appointments.length,
      pending,
      confirmed,
      cancelled,
    };
  }, [appointments]);

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    if (!token) return;

    setUpdatingId(id);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const message = await parseErrorMessage(res);
        throw new Error(message);
      }

      setAppointments((current) =>
        current.map((item) => (item._id === id ? { ...item, status } : item))
      );
      setSuccess('Appointment status updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update appointment');
    } finally {
      setUpdatingId('');
    }
  };

  const deleteAppointment = async (id: string, name: string) => {
    if (!token) return;
    const shouldDelete = window.confirm(`Delete appointment for ${name}?`);
    if (!shouldDelete) return;

    setDeletingId(id);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const message = await parseErrorMessage(res);
        throw new Error(message);
      }

      setAppointments((current) => current.filter((item) => item._id !== id));
      setSuccess('Appointment deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete appointment');
    } finally {
      setDeletingId('');
    }
  };

  if (authLoading || loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-secondary py-24">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-primary" size={38} />
          <p className="mt-4 text-sm text-muted-foreground">Loading appointments...</p>
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
          <p className="mt-2 text-sm text-muted-foreground">Only admin users can manage appointments.</p>
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
          className="absolute right-0 top-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border border-border bg-card p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Admin Appointments</p>
            <h1 className="mt-2 text-3xl font-bold uppercase tracking-tight text-foreground">Appointment Control</h1>
            <p className="mt-2 text-sm text-muted-foreground">Check who booked sessions and manage appointment status.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setReloadCount((count) => count + 1)}
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

        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Pending</p>
            <p className="mt-2 text-3xl font-bold text-yellow-300">{stats.pending}</p>
          </div>
          <div className="border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Confirmed</p>
            <p className="mt-2 text-3xl font-bold text-green-300">{stats.confirmed}</p>
          </div>
          <div className="border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Cancelled</p>
            <p className="mt-2 text-3xl font-bold text-red-300">{stats.cancelled}</p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 border border-border bg-card p-4 sm:grid-cols-[1fr_220px]">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, type..."
            className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | AppointmentStatus)}
            className="w-full border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="border border-border bg-card p-6 text-sm text-muted-foreground">
            No appointments found for current filters.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((item) => (
              <article key={item._id} className="border border-border bg-card p-5">
                <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_auto]">
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-wide text-foreground">{item.name}</h2>
                    <p className="mt-1 text-xs uppercase tracking-wider text-primary">{typeLabel[item.type] || item.type}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.email}</p>
                    <p className="text-sm text-muted-foreground">{item.phone}</p>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>
                      <span className="font-semibold text-foreground">Date:</span> {item.date}
                    </p>
                    <p className="mt-1">
                      <span className="font-semibold text-foreground">Time:</span> {item.time}
                    </p>
                    <p className="mt-1">
                      <span className="font-semibold text-foreground">Created:</span> {formatDateTime(item.createdAt)}
                    </p>
                    <p className="mt-1">
                      <span className="font-semibold text-foreground">Notes:</span> {item.notes?.trim() ? item.notes : 'N/A'}
                    </p>
                  </div>

                  <div className="flex min-w-[190px] flex-col gap-2">
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item._id, e.target.value as AppointmentStatus)}
                      disabled={updatingId === item._id}
                      className="w-full border border-border bg-secondary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground focus:border-primary focus:outline-none disabled:opacity-70"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => deleteAppointment(item._id, item.name)}
                      disabled={deletingId === item._id}
                      className="inline-flex items-center justify-center gap-2 border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-red-300 hover:bg-red-500/20 disabled:opacity-60"
                    >
                      {deletingId === item._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
