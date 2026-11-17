import { MapPin } from 'lucide-react';
import InterestTags from './InterestTags';

const ProfileCard = ({ profile, overlay = null, style, className = '' }) => {
  if (!profile) return null;

  return (
    <div
      className={`absolute inset-0 overflow-hidden rounded-[28px] bg-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.25)] ${className}`}
      style={style}
    >
      <img
        src={profile.photo}
        alt={profile.name}
        className="h-full w-full object-cover"
        draggable={false}
        loading="eager"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      {overlay}

      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <div className="mb-1 flex items-end gap-2">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            {profile.name}
            <span className="ml-2 font-sans text-2xl font-medium text-white/90">{profile.age}</span>
          </h2>
        </div>

        <div className="mb-3 flex items-center gap-1.5 text-sm text-white/80">
          <MapPin size={14} />
          <span>{profile.city}</span>
        </div>

        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-white/90">{profile.bio}</p>

        <InterestTags interests={profile.interests} />
      </div>
    </div>
  );
};

export default ProfileCard;
