export function TestimonialCard({
  name,
  role,
  text,
}: {
  name: string;
  role: string;
  text: string;
}) {
  return (
    <div className="bg-white border border-navy/5 rounded-lg p-6 flex flex-col gap-4">
      <svg className="w-6 h-6 text-electric-blue/40 flex-none" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <p className="text-navy/80 leading-relaxed flex-1">{text}</p>
      <div>
        <p className="font-bold text-sm">{name}</p>
        <p className="text-navy/50 text-xs mt-0.5">{role}</p>
      </div>
    </div>
  );
}
