import { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | DealSprints",
  description: "DealSprints privacy policy - how we collect, use, and protect your information.",
  alternates: { 
    canonical: "https://dealsprints.com/privacy" 
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-display text-4xl font-medium mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-mute mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="font-display text-2xl font-medium mb-4">Information We Collect</h2>
            <p className="text-mute mb-4">
              We collect information you provide directly to us, such as when you fill out our forms, 
              contact us, or use our services.
            </p>
            
            <h2 className="font-display text-2xl font-medium mb-4">How We Use Your Information</h2>
            <p className="text-mute mb-4">
              We use the information we collect to provide, maintain, and improve our services, 
              process transactions, and communicate with you.
            </p>
            
            <h2 className="font-display text-2xl font-medium mb-4">Information Sharing</h2>
            <p className="text-mute mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy.
            </p>
            
            <h2 className="font-display text-2xl font-medium mb-4">Data Security</h2>
            <p className="text-mute mb-4">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
            
            <h2 className="font-display text-2xl font-medium mb-4">Contact Us</h2>
            <p className="text-mute mb-4">
              If you have any questions about this Privacy Policy, please contact us at 
              <a href="mailto:privacy@dealsprints.com" className="text-brand hover:underline"> privacy@dealsprints.com</a>.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
