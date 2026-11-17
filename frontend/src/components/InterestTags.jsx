const InterestTags = ({ interests = [], limit = 5 }) => {
  const visible = interests.slice(0, limit);

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((interest) => (
        <span
          key={interest}
          className="rounded-full border border-white/25 bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
        >
          {interest}
        </span>
      ))}
    </div>
  );
};

export default InterestTags;
