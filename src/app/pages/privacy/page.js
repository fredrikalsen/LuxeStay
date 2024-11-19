'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/outline';

export default function Privacy() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
<button
  className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg text-gray-800 flex items-center justify-center font-semibold"
  onClick={() => router.back()}
>
  <ArrowLeftIcon className="w-5 h-5" /> 
</button>
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        Welcome to our Privacy Policy page. Your privacy is critically important to us.
      </p>
      <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
      <p className="text-gray-700 mb-4">
        We collect various types of information in connection with the services we provide, including information you provide directly to us, information we collect about your use of our services, and information we obtain from third-party sources.
      </p>
      <h2 className="text-2xl font-semibold mb-2">2. How We Use Information</h2>
      <p className="text-gray-700 mb-4">
        We use the information we collect to provide, maintain, and improve our services, to develop new services, and to protect us and our users.
      </p>
      <h2 className="text-2xl font-semibold mb-2">3. Information Sharing</h2>
      <p className="text-gray-700 mb-4">
        We do not share your personal information with companies, organizations, or individuals outside of our company except in the following cases: with your consent, for external processing, and for legal reasons.
      </p>
      <h2 className="text-2xl font-semibold mb-2">4. Data Security</h2>
      <p className="text-gray-700 mb-4">
        We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold.
      </p>
      <h2 className="text-2xl font-semibold mb-2">5. Data Retention</h2>
      <p className="text-gray-700 mb-4">
        We retain the information we collect for different periods of time depending on what it is, how we use it, and how you configure your settings.
      </p>
      <h2 className="text-2xl font-semibold mb-2">6. Your Privacy Controls</h2>
      <p className="text-gray-700 mb-4">
        You have choices regarding the information we collect and how it's used. This section describes key controls for managing your privacy across our services.
      </p>
      <h2 className="text-2xl font-semibold mb-2">7. Changes to This Policy</h2>
      <p className="text-gray-700 mb-4">
        We may change this Privacy Policy from time to time. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice.
      </p>
      <h2 className="text-2xl font-semibold mb-2">8. Contact Us</h2>
      <p className="text-gray-700 mb-4">
        If you have any questions about this Privacy Policy, please contact us at [Your Contact Information].
      </p>
    </div>
  );
}