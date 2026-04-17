'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Service = {
  _id: string;
  title: string;
  description: string;
  icon: string;
  shortText?: string;
  highlights?: string[];
  order?: number;
};

type ApiResponse<T> = {
  status?: string;
  message?: string;
  data?: T[] | T;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gym-managment-two.vercel.app/api/v1';

export default function StaffPanelPage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!token) router.push('/login');
  }, [authLoading, token, router]);

  useEffect(() => {
    if (authLoading || !token || !user) return;

    let active = true;

    const loadServices = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/services`, { cache: 'no-store' });
        const payload = (await res.json()) as ApiResponse<Service>;

        if (!res.ok) {
          throw new Error(payload.message || 'Failed to load services');
        }

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
  }, [authLoading, token, user?._id]);

  const sortedServices = useMemo(
    () =>
      [...services].sort((a, b) => {
        const firstOrder = Number.isFinite(a.order as number) ? (a.order as number) : 0;
        const secondOrder = Number.isFinite(b.order as number) ? (b.order as number) : 0;
        if (firstOrder === secondOrder) return a.title.localeCompare(b.title);
        return firstOrder - secondOrder;
      }),
    [services]
  );

  if (authLoading || loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-secondary py-24">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-primary" size={36} />
          <p className="mt-4 text-sm text-muted-foreground">Loading staff panel...</p>
        </div>
      </section>
    );
  }

  if (!token) return null;

  if (!user) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-secondary py-24">
        <div className="w-full max-w-lg border border-border bg-card p-8 text-center">
          <ShieldAlert size={34} className="mx-auto mb-4 text-primary" />
          <h1 className="text-2xl font-bold uppercase tracking-tight text-foreground">Session Required</h1>
          <p className="mt-2 text-sm text-muted-foreground">Please login to view the staff panel.</p>
          <Link href="/login" className="mt-6 inline-flex text-xs font-semibold uppercase tracking-wider text-primary hover:underline">
            Go To Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-secondary py-24">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ opacity: [0.2, 0.35, 0.2], scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-8 border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Staff Panel</p>
          <h1 className="mt-2 text-3xl font-bold uppercase tracking-tight text-foreground">Service Access Board</h1>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            View all active services configured by admin. Any service created or updated in admin panel appears here directly from MongoDB.
          </p>
        </div>

        {error ? (
          <div className="mb-6 border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
        ) : null}

        <div className="mb-6 flex items-center justify-between border border-border bg-card px-4 py-3">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Services</p>
          <span className="text-xl font-bold text-foreground">{sortedServices.length}</span>
        </div>

        {sortedServices.length === 0 ? (
          <div className="border border-border bg-card p-6 text-sm text-muted-foreground">
            No services found. Ask admin to add services in Admin Services manager.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sortedServices.map((service) => (
              <article key={service._id} className="border border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15">
                    <BriefcaseBusiness size={18} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-wide text-foreground">{service.title}</h2>
                    <p className="text-xs uppercase tracking-wider text-primary">{service.icon}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{service.description}</p>
                {service.shortText && <p className="mt-2 text-xs text-primary">{service.shortText}</p>}
                {Array.isArray(service.highlights) && service.highlights.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {service.highlights.map((item) => (
                      <span
                        key={`${service._id}-${item}`}
                        className="border border-border bg-secondary px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/appointment"
            className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/80"
          >
            Create Appointment
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
