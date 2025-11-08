import { redirect } from 'next/navigation';
import { getSession, getMemberProfile, signOut } from '@/lib/auth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Building2, Mail, Phone, Globe, Instagram, Facebook, Linkedin, Edit, LogOut, BadgeCheck, Crown } from 'lucide-react';

export default async function DashboardPage() {
  // Check authentication
  const { session } = await getSession();
  
  if (!session) {
    redirect('/login');
  }

  // Get member profile
  const member = await getMemberProfile(session.user.id);

  if (!member) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
            <p className="text-gray-600">Unable to load your member profile. Please contact support.</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Member Dashboard</h1>
          <p className="text-gray-600">Manage your profile and membership</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Logo/Avatar */}
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {member.logo_url ? (
                  <img src={member.logo_url} alt={member.business_name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <Building2 className="w-12 h-12 text-purple-600" />
                )}
              </div>

              {/* Business Name */}
              <h2 className="text-xl font-bold text-center text-gray-900 mb-1">
                {member.business_name}
              </h2>

              {/* Plan Badge */}
              <div className="flex justify-center mb-4">
                {member.plan === 'member' ? (
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    <BadgeCheck className="w-4 h-4" />
                    Verified Member
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                    Free Member
                  </div>
                )}
              </div>

              {/* Category */}
              {member.category && (
                <p className="text-center text-gray-600 text-sm mb-4">
                  {member.category}
                </p>
              )}

              {/* Quick Actions */}
              <div className="space-y-2 mb-4">
                <Link
                  href={`/okc/members/${member.slug}`}
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  View Public Profile
                </Link>
                <Link
                  href="/dashboard/edit"
                  className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Link>
              </div>

              {/* Upgrade CTA (if free) */}
              {member.plan === 'free' && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Upgrade to Member</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Get verified badge, full directory access, and more!
                  </p>
                  <Link
                    href="/pricing"
                    className="block text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                  >
                    Upgrade - $9/month
                  </Link>
                </div>
              )}

              {/* Logout */}
              <form action={async () => {
                'use server';
                await signOut();
                redirect('/login');
              }}>
                <button
                  type="submit"
                  className="w-full text-center text-red-600 hover:text-red-700 font-medium py-2 px-4 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
                  <p className="text-gray-900">{member.business_name}</p>
                </div>
                {member.owner_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Owner Name</label>
                    <p className="text-gray-900">{member.owner_name}</p>
                  </div>
                )}
                {member.category && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Category</label>
                    <p className="text-gray-900">{member.category}</p>
                  </div>
                )}
                {member.tagline && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Tagline</label>
                    <p className="text-gray-900">{member.tagline}</p>
                  </div>
                )}
                {member.bio && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Bio</label>
                    <p className="text-gray-900">{member.bio}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{member.email}</span>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{member.phone}</span>
                  </div>
                )}
                {member.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                      {member.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            {(member.instagram || member.facebook || member.linkedin) && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Social Media</h3>
                <div className="space-y-3">
                  {member.instagram && (
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-gray-400" />
                      <a href={`https://instagram.com/${member.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                        {member.instagram}
                      </a>
                    </div>
                  )}
                  {member.facebook && (
                    <div className="flex items-center gap-3">
                      <Facebook className="w-5 h-5 text-gray-400" />
                      <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                        Facebook
                      </a>
                    </div>
                  )}
                  {member.linkedin && (
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5 text-gray-400" />
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                        LinkedIn
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Membership Status */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Membership Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Plan</label>
                  <p className="text-gray-900 capitalize">{member.plan}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Member Since</label>
                  <p className="text-gray-900">{new Date(member.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Profile Status</label>
                  <p className="text-gray-900">{member.is_active ? 'Active' : 'Inactive'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Verification</label>
                  <p className="text-gray-900">{member.is_verified ? 'Verified ✓' : 'Not verified'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

