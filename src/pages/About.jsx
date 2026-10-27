import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const TOPICS = [
  { name: 'Technology', text: 'Latest trends, gadget reviews, and digital solutions' },
  { name: 'Travel', text: 'Destinations, adventure stories, and travel tips' },
  { name: 'Lifestyle', text: 'Wellness, productivity, and personal growth' },
  { name: 'Photography', text: 'Tips, techniques, and visual storytelling' },
];

export default function AboutPage() {
  return (
    <div className="shell max-w-5xl pt-10 sm:pt-14">
      <title>About | Kabah’s Blog</title>
      <div className="grid gap-10 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-14">
        <aside className="md:sticky md:top-24 md:self-start">
          <div
            className="grid aspect-square w-32 place-items-center rounded-full bg-accent text-on-accent md:w-full md:max-w-[15rem]"
            aria-hidden="true"
          >
            <span className="font-serif text-5xl italic md:text-7xl">KA</span>
          </div>
          <h2 className="mt-6 font-serif text-2xl font-medium">Kabah Atawoge</h2>
          <p className="text-muted">Blogger and journalist, Accra</p>
          <a
            href="mailto:kabahatawoge@gmail.com"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline underline-offset-4"
          >
            <Mail className="h-4 w-4" aria-hidden="true" /> kabahatawoge@gmail.com
          </a>
        </aside>

        <div className="min-w-0">
          <h1 className="font-serif text-[clamp(2.25rem,5vw,3.25rem)] font-medium leading-tight tracking-[-0.015em]">
            Hey there, I’m Kabah
          </h1>
          <div className="prose-body mt-6 max-w-[38rem] font-serif text-[1.2rem] leading-[1.75] text-ink/90">
            <p>
              Welcome to my blog! I’m a passionate writer and digital storyteller with over 5 years of experience creating content
              across various niches. My journey began in 2020 when I decided to share my thoughts on technology, travel, and lifestyle
              with the world.
            </p>
            <p>
              What started as a simple hobby has evolved into a platform where I connect with readers from around the globe. My mission
              is to create valuable, insightful, and entertaining content that inspires and helps others.
            </p>
          </div>

          <h2 className="mt-14 font-serif text-3xl font-medium">What I write about</h2>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <div key={t.name} className="rounded-xl bg-surface p-5">
                <dt className="font-semibold">{t.name}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{t.text}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-14 font-serif text-3xl font-medium">My story</h2>
          <div className="prose-body mt-6 max-w-[38rem] font-serif text-[1.2rem] leading-[1.75] text-ink/90">
            <p>
              Before becoming a full-time blogger, I worked in marketing for several tech companies. My background in digital marketing
              has helped me understand how to create content that resonates with readers and builds a loyal community.
            </p>
            <p>
              When I’m not writing, you can find me hiking local trails, experimenting with new recipes in the kitchen, or curled up with
              a good book. I believe in continuous learning and am always exploring new topics to share with my audience.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link to="/" className="btn btn-primary">
              Read the latest stories
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
