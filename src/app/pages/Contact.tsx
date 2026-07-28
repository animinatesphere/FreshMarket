import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Loader2, CheckCircle } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const infoCards = [
  { icon: Mail, title: 'Email', lines: ['contact@freshmarket.com', 'support@freshmarket.com'] },
  { icon: Phone, title: 'Phone', lines: ['+234 (0) 700 000 0000', '+234 (0) 800 111 2222'] },
  { icon: MapPin, title: 'Address', lines: ['123 Fresh Street', 'Lagos, Nigeria'] },
  { icon: Clock, title: 'Business Hours', lines: ['Monday - Friday: 8am - 8pm', 'Saturday - Sunday: 9am - 6pm'] },
];

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await api.post('/contact', form);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.2em] text-xs font-semibold text-primary-foreground/70 mb-3">Get in touch</p>
          <h1 className="text-5xl mb-4">Contact Us</h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <h2 className="text-2xl mb-6">Send us a Message</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input-background"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange('name')}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm mb-2">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input-background"
                      placeholder="your.email@example.com"
                      value={form.email}
                      onChange={handleChange('email')}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input-background"
                      placeholder="How can we help?"
                      value={form.subject}
                      onChange={handleChange('subject')}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm mb-2">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-2 border border-border rounded-lg resize-none bg-input-background"
                      placeholder="Your message..."
                      value={form.message}
                      onChange={handleChange('message')}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : submitted ? (
                      <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Message Sent</span>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {infoCards.map((info) => (
              <Card key={info.title} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="bg-secondary p-3 rounded-full h-fit">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-1">{info.title}</h3>
                      {info.lines.map((line) => (
                        <p key={line} className="text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
