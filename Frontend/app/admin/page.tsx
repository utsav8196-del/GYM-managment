'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Contact,
  Dumbbell,
  Loader2,
  MessageSquareText,
  RefreshCcw,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type DashboardResponse<T> = {
  status?: string;
  message?: string;
  data?: T[] | T;
};

type Service = {
  _id: string;
  title: string;
};

type Course = {
  _id: string;
  title: string;
  type?: string;
};

type BlogPost = {
  _id: string;
  title: string;
  category?: string;
  publishedAt?: string;
};

type Member = {
  _id: string;
  name: string;
  email: string;
  status?: string;
};

type Appointment = {
  _id: string;
  name: string;
  type?: string;
  date?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
};

type ContactMessage = {
  _id: string;
  name: string;
  subject?: string;
  createdAt?: string;
};

type DashboardData = {
  services: Service[];
  courses: Course[];
  posts: BlogPost[];
  members: Member[];
  appointments: Appointment[];
  contacts: ContactMessage[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const initialData: DashboardData = {
  services: [],
  courses: [],
  posts: [],
  members: [],
  appointments: [],
  contacts: [],
};

const formatDate = (value?: string) => {
  if (!value) return 'N/A';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString();
};

async function fetchList<T>(path: string, token?: string): Promise<T[]> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    let payload: DashboardResponse<T> = {};
    try {
      payload = (await res.json()) as DashboardResponse<T>;
    } catch {
      payload = {};
    }

    if (res.status === 429 && attempt === 0) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      continue;
    }

    if (!res.ok) throw new Error(payload.message || `Failed to fetch ${path}`);
    return Array.isArray(payload.data) ? payload.data : [];
  }

  return [];
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const quickPanels = [
  {
    title: 'Manage Appointments',
    text: 'Check who booked sessions and update appointment status.',
    href: '/admin/appointments',
    image: '/images/hero-trainer.jpg',
  },
  {
    title: 'Create Staff Account',
    text: 'Add new staff and assign roles for daily operations.',
    href: '/register',
    image: '/images/about-trainer.jpg',
  },
  {
    title: 'Manage Services',
    text: 'Update service visuals, highlights, and descriptions.',
    href: '/admin/services',
    image: '/images/personal-training.jpg',
  },
  {
    title: 'Admin Profile',
    text: 'Maintain your account details and preferences.',
    href: '/profile',
    image: '/images/group-training.jpg',
  },
];

export default function AdminPage() {
  const { token, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!token) router.push('/login');
  }, [authLoading, token, router]);

  useEffect(() => {
    if (authLoading || !token || !user || user.role !== 'admin') return;

    let active = true;

    const loadDashboard = async () => {
      setError('');
      const isManualRefresh = reloadCount > 0;
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const [servicesRes, coursesRes, postsRes, membersRes, appointmentsRes, contactsRes] =
        await Promise.allSettled([
          fetchList<Service>('/services', token),
          fetchList<Course>('/courses', token),
          fetchList<BlogPost>('/blog?limit=50', token),
          fetchList<Member>('/members', token),
          fetchList<Appointment>('/appointments', token),
          fetchList<ContactMessage>('/contact', token),
        ]);

      if (!active) return;

      setData({
        services: servicesRes.status === 'fulfilled' ? servicesRes.value : [],
        courses: coursesRes.status === 'fulfilled' ? coursesRes.value : [],
        posts: postsRes.status === 'fulfilled' ? postsRes.value : [],
        members: membersRes.status === 'fulfilled' ? membersRes.value : [],
        appointments: appointmentsRes.status === 'fulfilled' ? appointmentsRes.value : [],
        contacts: contactsRes.status === 'fulfilled' ? contactsRes.value : [],
      });

      const failedCount = [
        servicesRes,
        coursesRes,
        postsRes,
        membersRes,
        appointmentsRes,
        contactsRes,
      ].filter((x) => x.status === 'rejected').length;

      if (failedCount > 0) {
        setError('Some dashboard data failed to load. Verify backend routes and permissions.');
      }

      setLoading(false);
      setRefreshing(false);
    };

    void loadDashboard();

    return () => {
      active = false;
    };
  }, [authLoading, token, user?._id, user?.role, reloadCount]);

  const pendingAppointments = useMemo(
    () => data.appointments.filter((item) => item.status === 'pending').length,
    [data.appointments]
  );

  const confirmedAppointments = useMemo(
    () => data.appointments.filter((item) => item.status === 'confirmed').length,
    [data.appointments]
  );

  const statCards = [
    { label: 'Members', value: data.members.length, icon: Users, note: 'Registered gym members' },
    { label: 'Services', value: data.services.length, icon: Dumbbell, note: 'Active training services' },
    { label: 'Courses', value: data.courses.length, icon: BookOpen, note: 'Published course programs' },
    { label: 'Blog Posts', value: data.posts.length, icon: MessageSquareText, note: 'Public fitness content' },
    {
      label: 'Appointments',
      value: data.appointments.length,
      icon: CalendarClock,
      note: `${pendingAppointments} pending, ${confirmedAppointments} confirmed`,
    },
    { label: 'Contacts', value: data.contacts.length, icon: Contact, note: 'Inbound website messages' },
  ];

  if (authLoading || loading) {
    return (
      <section className="relative flex min-h-screen items-center justify-center bg-secondary py-24">
        <div className="mx-auto w-full max-w-md px-6 text-center">
          <Loader2 className="mx-auto animate-spin text-primary" size={40} />
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
        </div>
      </section>
    );
  }

  if (!token) return null;

  if (!user || user.role !== 'admin') {
    return (
      <section className="relative flex min-h-screen items-center justify-center bg-secondary py-24">
        <div className="mx-auto w-full max-w-lg border border-border bg-card p-8 text-center">
          <ShieldCheck size={34} className="mx-auto mb-4 text-primary" />
          <h1 className="mb-2 text-2xl font-bold uppercase tracking-tight text-foreground">Access Restricted</h1>
          <p className="mb-6 text-sm text-muted-foreground">Admin role is required to open this dashboard.</p>
          <Link href="/" className="text-sm font-semibold uppercase tracking-wider text-primary hover:underline">
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
          animate={{ opacity: [0.25, 0.4, 0.25], scale: [1, 1.08, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
        />
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-red-500/10 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.5 }}
          className="mb-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]"
        >
          <div className="border border-border bg-card p-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Admin Workspace</p>
            <h1 className="text-3xl font-bold uppercase tracking-tight text-foreground lg:text-4xl">Gym Command Panel</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Welcome {user.name}. Track operations, appointments, content, and member activity with live dashboard data.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setReloadCount((x) => x + 1);
                }}
                className="inline-flex items-center gap-2 border border-border bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                <RefreshCcw size={14} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </button>
              <Link
                href="/admin/appointments"
                className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/80"
              >
                Manage Appointments
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="relative col-span-2 h-40 overflow-hidden border border-border"
            >
              <Image src="/images/hero-trainer.jpg" alt="Gym training" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 30vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/75 to-transparent" />
            </motion.div>
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }} className="relative h-32 overflow-hidden border border-border">
              <Image src="/images/personal-training.jpg" alt="Personal coaching" fill className="object-cover" sizes="20vw" />
            </motion.div>
            <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }} className="relative h-32 overflow-hidden border border-border">
              <Image src="/images/group-training.jpg" alt="Group workout" fill className="object-cover" sizes="20vw" />
            </motion.div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-8 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
          className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {statCards.map((card) => (
            <motion.div
              key={card.label}
              variants={fadeUp}
              className="border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{card.label}</p>
                <card.icon size={18} className="text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
              <p className="mt-2 text-xs text-muted-foreground">{card.note}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="mb-10 grid gap-6 lg:grid-cols-3"
        >
          {quickPanels.map((panel) => (
            <motion.div key={panel.title} variants={fadeUp}>
              <Link href={panel.href} className="group block overflow-hidden border border-border bg-card transition-colors hover:border-primary/50">
                <div className="relative h-36 overflow-hidden border-b border-border">
                  <Image
                    src={panel.image}
                    alt={panel.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-lg font-bold uppercase tracking-wide text-foreground">{panel.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">{panel.text}</p>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary transition-all group-hover:gap-3">
                    Open
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.1 }} className="border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold uppercase tracking-wide text-foreground">Recent Appointments</h2>
              <Link href="/admin/appointments" className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline">
                View All
              </Link>
            </div>
            {data.appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No appointments yet.</p>
            ) : (
              <div className="space-y-3">
                {data.appointments.slice(0, 6).map((item) => (
                  <div key={item._id} className="flex items-center justify-between border border-border bg-secondary px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {item.type || 'Session'} | {item.date || 'No date'}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'confirmed'
                          ? 'bg-green-500/20 text-green-300'
                          : item.status === 'cancelled'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}
                    >
                      {item.status || 'pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.15 }} className="border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-bold uppercase tracking-wide text-foreground">Latest Contacts</h2>
            {data.contacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contact messages yet.</p>
            ) : (
              <div className="space-y-3">
                {data.contacts.slice(0, 6).map((item) => (
                  <div key={item._id} className="border border-border bg-secondary px-3 py-2">
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.subject || 'No subject'}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
