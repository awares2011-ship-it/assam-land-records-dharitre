// The square app logo (public/app-logo.webp). Used in the top bar, result
// headers, hero sections and onboarding, so changing the file in /public is
// the only place a user needs to touch to rebrand.
type Props = {
  className?: string;
  alt?: string;
  rounded?: boolean;
};

export default function AppLogo({ className = 'w-9 h-9', alt = 'Assam Land Records – Dharitre', rounded = true }: Props) {
  return (
    <img
      src="/app-logo.webp"
      alt={alt}
      width={128}
      height={128}
      decoding="async"
      loading="eager"
      className={`${className} ${rounded ? 'rounded-xl' : ''} object-cover shadow-card bg-white`}
      draggable={false}
    />
  );
}
