import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { TbX } from 'react-icons/tb';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 text-center">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* Contact Section */}
        <div className="mb-6 md:mb-0 text-left">
          <h2 className="text-xl font-semibold">Get in Touch</h2>
          <p className="text-gray-600 mt-2 max-w-xs">
            Leave feedback or ask general questions through a contact page. These pieces of information are valuable to businesses because they learn more about consumer expectations and preferences.
          </p>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-6 text-3xl text-gray-800">
          <TbX />
          <FaFacebook />
          <FaInstagram />
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-8 text-gray-600 text-sm">
        2024 LuxeStay, Inc • Copyright Reserved
      </div>
    </footer>
  );
};

export default Footer;
