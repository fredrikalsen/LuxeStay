'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/outline';

export default function Terms() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
<button
  className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg text-gray-800 flex items-center justify-center font-semibold"
  onClick={() => router.back()}
>
  <ArrowLeftIcon className="w-5 h-5" /> 
</button>
      <h1 className="text-3xl font-bold mb-4">Terms and Services</h1>
      <p className="text-gray-700 mb-4">
        Welcome to our Terms and Services page. Please read these terms and conditions carefully before using our service.
      </p>
      <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
      <p className="text-gray-700 mb-4">
        These terms and conditions outline the rules and regulations for the use of our website.
      </p>
      <h2 className="text-2xl font-semibold mb-2">2. Intellectual Property Rights</h2>
      <p className="text-gray-700 mb-4">
        Other than the content you own, under these terms, we own all the intellectual property rights and materials contained in this website.
      </p>
      <h2 className="text-2xl font-semibold mb-2">3. Restrictions</h2>
      <p className="text-gray-700 mb-4">
        You are specifically restricted from all of the following: publishing any website material in any other media; selling, sublicensing and/or otherwise commercializing any website material.
      </p>
      <h2 className="text-2xl font-semibold mb-2">4. Your Content</h2>
      <p className="text-gray-700 mb-4">
        In these website standard terms and conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this website.
      </p>
      <h2 className="text-2xl font-semibold mb-2">5. No warranties</h2>
      <p className="text-gray-700 mb-4">
        This website is provided "as is," with all faults, and we express no representations or warranties, of any kind related to this website or the materials contained on this website.
      </p>
      <h2 className="text-2xl font-semibold mb-2">6. Limitation of liability</h2>
      <p className="text-gray-700 mb-4">
        In no event shall we, nor any of our officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this website.
      </p>
      <h2 className="text-2xl font-semibold mb-2">7. Indemnification</h2>
      <p className="text-gray-700 mb-4">
        You hereby indemnify to the fullest extent us from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these terms.
      </p>
      <h2 className="text-2xl font-semibold mb-2">8. Severability</h2>
      <p className="text-gray-700 mb-4">
        If any provision of these terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.
      </p>
      <h2 className="text-2xl font-semibold mb-2">9. Variation of Terms</h2>
      <p className="text-gray-700 mb-4">
        We are permitted to revise these terms at any time as we see fit, and by using this website you are expected to review these terms on a regular basis.
      </p>
      <h2 className="text-2xl font-semibold mb-2">10. Assignment</h2>
      <p className="text-gray-700 mb-4">
        We are allowed to assign, transfer, and subcontract our rights and/or obligations under these terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these terms.
      </p>
      <h2 className="text-2xl font-semibold mb-2">11. Entire Agreement</h2>
      <p className="text-gray-700 mb-4">
        These terms constitute the entire agreement between us and you in relation to your use of this website, and supersede all prior agreements and understandings.
      </p>
      <h2 className="text-2xl font-semibold mb-2">12. Governing Law & Jurisdiction</h2>
      <p className="text-gray-700 mb-4">
        These terms will be governed by and interpreted in accordance with the laws of the State of [Your State], and you submit to the non-exclusive jurisdiction of the state and federal courts located in [Your State] for the resolution of any disputes.
      </p>
    </div>
  );
}