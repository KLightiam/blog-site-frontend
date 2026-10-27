import { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const EMAIL = 'kabahatawoge@gmail.com';

const FAQ = [
  ['How quickly do you respond to messages?', 'I typically respond to all inquiries within 24-48 hours during weekdays.'],
  ['Do you accept guest posts?', 'Yes, I’m open to high-quality guest contributions that align with my blog’s themes and provide value to readers.'],
  ['Can we collaborate on sponsored content?', 'I selectively work with brands that align with my values. Please include details about your company and campaign in your message.'],
  ['Do you offer consulting services?', 'Yes, I provide consulting in content strategy, digital marketing, and blog development. Contact me for rates and availability.'],
];

const EMPTY = { name: '', email: '', subject: '', message: '' };

export default function ContactPage() {
  const [formData, setFormData] = useState(EMPTY);
  const [opened, setOpened] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // There is no mail server behind the blog, so the form opens the visitor's email app with the message filled in.
  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = formData.subject || `Message from ${formData.name}`;
    const body = `${formData.message}\n\n${formData.name}\n${formData.email}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  return (
    <div className="shell max-w-5xl pt-10 sm:pt-14">
      <title>Contact | Kabah’s Blog</title>
      <h1 className="font-serif text-[clamp(2.25rem,5vw,3.25rem)] font-medium leading-tight tracking-[-0.015em]">Get in touch</h1>
      <p className="mt-3 max-w-xl text-lg text-muted">Questions, story ideas or collaborations. I read every message.</p>

      <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] md:gap-14">
        <dl className="space-y-6">
          <div className="flex gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <dt className="text-sm text-muted">Email</dt>
              <dd className="font-medium">
                <a href={`mailto:${EMAIL}`} className="hover:text-accent break-all">
                  {EMAIL}
                </a>
              </dd>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <dt className="text-sm text-muted">Location</dt>
              <dd className="font-medium">Accra, Ghana</dd>
            </div>
          </div>
          <div className="flex gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <div>
              <dt className="text-sm text-muted">Phone</dt>
              <dd className="font-medium tabular-nums">(029) 456-7890</dd>
            </div>
          </div>
        </dl>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-line p-6 sm:p-8">
          <h2 className="font-serif text-2xl font-medium">Send a message</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                Your name
              </label>
              <input id="name" name="name" type="text" required autoComplete="name" value={formData.name} onChange={handleChange} className="field" />
            </div>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Your email
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" value={formData.email} onChange={handleChange} className="field" />
            </div>
          </div>
          <div className="mt-5">
            <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
              Subject <span className="font-normal text-muted">(optional)</span>
            </label>
            <input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} className="field" />
          </div>
          <div className="mt-5">
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
              Message
            </label>
            <textarea id="message" name="message" rows={6} required value={formData.message} onChange={handleChange} className="field resize-y" />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-muted" aria-live="polite">
              {opened ? `Your email app should now be open. If it isn’t, write to ${EMAIL}.` : 'This opens your email app with the message ready to send.'}
            </p>
            <button type="submit" className="btn btn-primary">
              <Send className="h-4 w-4" aria-hidden="true" /> Write email
            </button>
          </div>
        </form>
      </div>

      <section aria-labelledby="faq-title" className="mt-20">
        <h2 id="faq-title" className="font-serif text-3xl font-medium">
          Common questions
        </h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                {q}
                <span className="text-2xl leading-none text-muted transition-transform group-open:rotate-45" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
