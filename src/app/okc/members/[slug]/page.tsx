import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMemberBySlug, MOCK_MEMBERS } from '@/lib/data/mockFeed';
import { Building2, CheckCircle, ExternalLink, Instagram, Linkedin, Facebook, Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return MOCK_MEMBERS.map((member) => ({
    slug: member.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const member = getMemberBySlug(params.slug);

  if (!member) {
    return {
      title: 'Member Not Found | DealSprints OKC',
    };
  }

  return {
    title: `${member.businessName} - ${member.category} | DealSprints OKC Network`,
    description: member.bio || member.tagline,
    alternates: {
      canonical: `https://dealsprints.com/okc/members/${params.slug}`,
    },
    openGraph: {
      title: `${member.businessName} | DealSprints OKC Network`,
      description: member.tagline,
      url: `https://dealsprints.com/okc/members/${params.slug}`,
      siteName: 'DealSprints OKC',
      locale: 'en_US',
      type: 'profile',
    },
  };
}

export const revalidate = 3600;

export default function MemberProfilePage({ params }: PageProps) {
  const member = getMemberBySlug(params.slug);

  if (!member || !member.isActive) {
    notFound();
  }

  const planBadges = {
    free: null,
    verified: {
      label: 'Verified Member',
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: CheckCircle,
    },
    pro: {
      label: 'Pro Member',
      className: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: CheckCircle,
    },
  };

  const badge = planBadges[member.plan];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            href="/okc/members"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-brand transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Members</span>
          </Link>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Logo */}
            <div className="w-32 h-32 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
              {member.logoUrl ? (
                <img
                  src={member.logoUrl}
                  alt={`${member.businessName} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-16 h-16 text-gray-400" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {member.businessName}
                  </h1>
                  <p className="text-xl text-gray-600 mb-3">
                    {member.tagline}
                  </p>
                  <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                    {member.category}
                  </div>
                </div>

                {badge && (
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${badge.className} flex-shrink-0`}>
                    <badge.icon className="w-4 h-4" />
                    {badge.label}
                  </span>
                )}
              </div>

              {member.bio && (
                <p className="text-gray-700 leading-relaxed mb-6">
                  {member.bio}
                </p>
              )}

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {member.address && (
                  <div className="flex items-start gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{member.address}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a href={`tel:${member.phone}`} className="hover:text-brand transition-colors">
                      {member.phone}
                    </a>
                  </div>
                )}
                {member.email && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${member.email}`} className="hover:text-brand transition-colors">
                      {member.email}
                    </a>
                  </div>
                )}
                {member.website && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a
                      href={member.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {(member.instagram || member.linkedin || member.facebook) && (
        <div className="bg-white">
          <div className="max-w-5xl mx-auto px-6 py-8 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connect</h2>
            <div className="flex gap-3">
              {member.instagram && (
                <a
                  href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Instagram className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-700">Instagram</span>
                </a>
              )}
              {member.linkedin && (
                <a
                  href={`https://linkedin.com/${member.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-700">LinkedIn</span>
                </a>
              )}
              {member.facebook && (
                <a
                  href={`https://facebook.com/${member.facebook}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Facebook className="w-5 h-5 text-gray-700" />
                  <span className="font-medium text-gray-700">Facebook</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Owner Info */}
      {member.ownerName && (
        <div className="bg-white">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Owner</h2>
            <p className="text-gray-700">{member.ownerName}</p>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Join the OKC Network
          </h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Get your own verified profile, connect with local business owners, and get featured in the OKC Pulse feed.
          </p>
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Join the Waitlist
          </Link>
        </div>
      </div>
    </main>
  );
}

