import { Metadata } from "next";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | DealSprints",
  description: "DealSprints terms of service - the legal terms governing your use of our platform.",
  alternates: { 
    canonical: "https://dealsprints.com/terms" 
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="font-display text-4xl font-medium mb-8">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-mute mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="font-display text-2xl font-medium mb-4">Acceptance of Terms</h2>
            <p className="text-mute mb-4">
              By accessing and using DealSprints, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
            
            <h2 className="font-display text-2xl font-medium mb-4">Use License</h2>
            <p className="text-mute mb-4">
              Permission is granted to temporarily use DealSprints for personal, non-commercial 
              transitory viewing only.
            </p>
            
            <h2 className="font-display text-2xl font-medium mb-4">Disclaimer</h2>
            <p className="text-mute mb-4">
              The materials on DealSprints are provided on an 'as is' basis. DealSprints makes no 
              warranties, expressed or implied, and hereby disclaims and negates all other warranties.
            </p>
            
            <h2 className="font-display text-2xl font-medium mb-4">Limitations</h2>
            <p className="text-mute mb-4">
              In no event shall DealSprints or its suppliers be liable for any damages arising out 
              of the use or inability to use the materials on DealSprints.
            </p>
            
            <h2 className="font-display text-2xl font-medium mb-4">Contact Information</h2>
            <p className="text-mute mb-4">
              If you have any questions about these Terms of Service, please contact us at 
              <a href="mailto:legal@dealsprints.com" className="text-brand hover:underline"> legal@dealsprints.com</a>.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
