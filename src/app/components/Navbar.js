import { useRouter } from 'next/navigation';
import { HomeIcon, HeartIcon, UserIcon, GlobeAltIcon } from '@heroicons/react/solid';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md">
      <div className="flex justify-around py-2">
        {/* Explore */}
        <div className="flex flex-col items-center" onClick={() => router.push('/explore')}>
          <GlobeAltIcon className="h-6 w-6 text-gray-500" />
          <span className="text-xs text-gray-600">Explore</span>
        </div>

        {/* Favorites */}
        <div className="flex flex-col items-center" onClick={() => router.push('/favorites')}>
          <HeartIcon className="h-6 w-6 text-gray-500" />
          <span className="text-xs text-gray-600">Favorites</span>
        </div>

        {/* Trips */}
        <div className="flex flex-col items-center" onClick={() => router.push('/trips')}>
          <HomeIcon className="h-6 w-6 text-gray-500" />
          <span className="text-xs text-gray-600">Trips</span>
        </div>

        {/* Profile */}
        <div className="flex flex-col items-center" onClick={() => router.push('/profile')}>
          <UserIcon className="h-6 w-6 text-gray-500" />
          <span className="text-xs text-gray-600">Profile</span>
        </div>
      </div>
    </nav>
  );
}
