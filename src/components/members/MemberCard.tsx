"use client";

import { Member } from '@/lib/data/mockFeed';
import { Building2, CheckCircle, ExternalLink, Instagram, Linkedin, Facebook } from 'lucide-react';
import Link from 'next/link';

interface MemberCardProps {
  member: Member;
}

const planBadges = {
  free: null,
  verified: {
    label: 'Verified',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircle,
  },
  pro: {
    label: 'Pro Member',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: CheckCircle,
  },
};

export function MemberCard({ member }: MemberCardProps) {
  const badge = planBadges[member.plan];

  return (
    <Link href={`/okc/members/${member.slug}`}>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-brand/30 transition-all cursor-pointer h-full flex flex-col">
        {/* Header with logo and badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            {member.logoUrl ? (
              <img 
                src={member.logoUrl} 
                alt={`${member.businessName} logo`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Building2 className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          {badge && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${badge.className}`}>
              <badge.icon className="w-3 h-3" />
              {badge.label}
            </span>
          )}
        </div>

        {/* Business info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {member.businessName}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3">
            {member.tagline}
          </p>

          <div className="text-xs text-gray-500 font-medium">
            {member.category}
          </div>
        </div>

        {/* Social links */}
        {(member.instagram || member.linkedin || member.facebook || member.website) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            {member.instagram && (
              <a
                href={`https://instagram.com/${member.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-gray-600" />
              </a>
            )}
            {member.linkedin && (
              <a
                href={`https://linkedin.com/${member.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-gray-600" />
              </a>
            )}
            {member.facebook && (
              <a
                href={`https://facebook.com/${member.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-gray-600" />
              </a>
            )}
            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors ml-auto"
                aria-label="Website"
              >
                <ExternalLink className="w-4 h-4 text-gray-600" />
              </a>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

