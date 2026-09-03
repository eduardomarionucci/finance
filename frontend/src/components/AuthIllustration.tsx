import towersImg from "@/assets/tower.jpg";

interface AuthIllustrationProps {
  logoText?: string;
  quote?: string;
  quoteAuthor?: string;
}

export default function AuthIllustration({
  logoText = "",
  quote = "O risco vem de você não saber o que está fazendo.",
  quoteAuthor = "Warren Buffet",
}: AuthIllustrationProps) {
  return (
    <div className="relative w-full h-full min-h-screen bg-[#0a1730]">
      <img
        src={towersImg}
        alt="Towers background"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full min-h-screen flex-col justify-between p-10 lg:p-12">
        <span className="text-xl font-bold tracking-[0.15em] text-white">
          {logoText}
        </span>

        <blockquote className="max-w-md">
          <p className="font-serif text-5xl shadow text-white/95">
            “{quote}”
          </p>
          <footer className="mt-3 italic font-serif text-lg text-white">
            {quoteAuthor}
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
