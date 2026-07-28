import { useState } from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { api, ApiError } from '../lib/api';
import { Button } from './ui/button';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await api.post('/newsletter', { email });
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        alert('You are already subscribed!');
      } else {
        console.error('Newsletter error:', err);
        alert('Failed to subscribe. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary py-16 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-primary-foreground max-w-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-primary-foreground/15 p-3 rounded-full">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-3xl">Stay Healthy & Fresh</h3>
            </div>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              Join our community and get the latest updates on organic harvests,
              exclusive farmhouse deals, and nutrition tips delivered to your inbox.
            </p>
          </div>

          <div className="w-full md:w-auto relative">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={isLoading || subscribed}
                className="px-6 py-4 rounded-xl w-full md:w-96 outline-none text-foreground shadow-lg focus:ring-4 focus:ring-accent/40 transition-all font-medium bg-card"
              />
              <Button
                type="submit"
                size="lg"
                variant="secondary"
                disabled={isLoading || subscribed}
                className="px-8 py-4 rounded-xl shadow-lg font-bold min-w-[140px] transition-transform active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : subscribed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  'Subscribe Now'
                )}
              </Button>
            </form>

            {subscribed && (
              <p className="absolute -bottom-8 left-0 text-primary-foreground text-sm font-semibold animate-in fade-in slide-in-from-top-2">
                ✓ Welcome to the FreshMarket family!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
