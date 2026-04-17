'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

type ProfileUser = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: Gender;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ProfileResponse = {
  status?: string;
  message?: string;
  data?: {
    user?: ProfileUser;
  };
};

type ProfileFormState = {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  dateOfBirth: string;
  gender: '' | Gender;
  bio: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gym-managment-two.vercel.app/api/v1';

const formatDate = (value?: string) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString();
};

const emptyForm: ProfileFormState = {
  name: '',
  email: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  dateOfBirth: '',
  gender: '',
  bio: '',
};

export default function ProfilePage() {
  const { token, isLoading: authLoading, setUserData } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [form, setForm] = useState<ProfileFormState>(emptyForm);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      setIsLoadingProfile(true);
      setError('');
      setSuccess('');

      try {
        const res = await fetch(`${API_URL}/auth/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        const data = (await res.json()) as ProfileResponse;
        if (!res.ok) {
          throw new Error(data.message || 'Failed to load profile');
        }

        const serverUser = data.data?.user;
        if (!serverUser) {
          throw new Error('Profile data not found');
        }

        setProfile(serverUser);
        setForm({
          name: serverUser.name || '',
          email: serverUser.email || '',
          phone: serverUser.phone || '',
          addressLine1: serverUser.addressLine1 || '',
          addressLine2: serverUser.addressLine2 || '',
          city: serverUser.city || '',
          state: serverUser.state || '',
          postalCode: serverUser.postalCode || '',
          country: serverUser.country || '',
          dateOfBirth: serverUser.dateOfBirth ? serverUser.dateOfBirth.slice(0, 10) : '',
          gender: serverUser.gender || '',
          bio: serverUser.bio || '',
        });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    void loadProfile();
  }, [authLoading, token, router]);

  const onInputChange =
    (field: keyof ProfileFormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim() || !form.email.trim()) {
      setError('Name and email are required');
      return;
    }

    if (!token) {
      setError('Please login again');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country.trim(),
        dateOfBirth: form.dateOfBirth || '',
        gender: form.gender,
        bio: form.bio.trim(),
      };

      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as ProfileResponse;
      if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      const updatedUser = data.data?.user;
      if (!updatedUser) {
        throw new Error('Updated profile data not found');
      }

      setProfile(updatedUser);
      setForm({
        name: updatedUser.name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        addressLine1: updatedUser.addressLine1 || '',
        addressLine2: updatedUser.addressLine2 || '',
        city: updatedUser.city || '',
        state: updatedUser.state || '',
        postalCode: updatedUser.postalCode || '',
        country: updatedUser.country || '',
        dateOfBirth: updatedUser.dateOfBirth ? updatedUser.dateOfBirth.slice(0, 10) : '',
        gender: updatedUser.gender || '',
        bio: updatedUser.bio || '',
      });

      setUserData({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });

      setSuccess('Profile updated successfully');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoadingProfile) {
    return (
      <section className="relative flex min-h-screen items-center justify-center bg-secondary py-24">
        <div className="mx-auto w-full max-w-md px-6 text-center">
          <Loader2 className="mx-auto animate-spin text-primary" size={40} />
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </section>
    );
  }

  if (!token) return null;

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-secondary py-24">
      <div className="mx-auto w-full max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border border-border bg-card p-8 sm:p-10"
        >
          <h1 className="mb-2 text-3xl font-bold uppercase tracking-tight text-foreground">Profile</h1>
          <p className="mb-8 text-sm text-muted-foreground">Update your contact and personal details (saved in MongoDB).</p>

          {error && <p className="mb-4 text-sm font-medium text-red-400">{error}</p>}
          {success && <p className="mb-4 text-sm font-medium text-green-400">{success}</p>}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={onInputChange('name')}
                  className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={onInputChange('email')}
                  className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  value={form.phone}
                  onChange={onInputChange('phone')}
                  className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="gender" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Gender
                </label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={onInputChange('gender')}
                  className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer Not To Say</option>
                </select>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Date Of Birth
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={onInputChange('dateOfBirth')}
                  className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="addressLine1" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Address Line 1
                </label>
                <input
                  id="addressLine1"
                  type="text"
                  value={form.addressLine1}
                  onChange={onInputChange('addressLine1')}
                  className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="addressLine2" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Address Line 2
                </label>
                <input
                  id="addressLine2"
                  type="text"
                  value={form.addressLine2}
                  onChange={onInputChange('addressLine2')}
                  className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="city" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  value={form.city}
                  onChange={onInputChange('city')}
                  className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="state" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  value={form.state}
                  onChange={onInputChange('state')}
                  className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="postalCode" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Postal Code
                </label>
                <input
                  id="postalCode"
                  type="text"
                  value={form.postalCode}
                  onChange={onInputChange('postalCode')}
                  className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="country" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  value={form.country}
                  onChange={onInputChange('country')}
                  className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground transition-all duration-300 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="mb-2 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                maxLength={500}
                value={form.bio}
                onChange={onInputChange('bio')}
                className="w-full border border-border bg-secondary px-4 py-3 text-sm text-foreground transition-all duration-300 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Role</p>
                <p className="text-sm uppercase text-foreground">{profile?.role || 'N/A'}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">User ID</p>
                <p className="break-all text-sm text-foreground">{profile?._id || 'N/A'}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Created At</p>
                <p className="text-sm text-foreground">{formatDate(profile?.createdAt)}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Updated At</p>
                <p className="text-sm text-foreground">{formatDate(profile?.updatedAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-none bg-primary px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:bg-primary/80 disabled:opacity-50"
              >
                {isSaving ? 'Updating...' : 'Update Profile'}
              </button>
              <Link href="/" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:text-primary">
                Back Home
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
