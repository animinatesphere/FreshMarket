import { useState } from 'react';
import { Mail, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../utils/supabase';
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
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
            alert("You are already subscribed!");
        } else {
            throw error;
        }
      }

      setSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    } catch (err: any) {
      console.error("Newsletter error:", err.message);
      alert("Failed to subscribe. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-600 to-orange-700 py-16 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white max-w-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold">Stay Healthy & Fresh</h3>
            </div>
            <p className="text-orange-50 text-lg leading-relaxed">
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
                className="px-6 py-4 rounded-xl w-full md:w-96 outline-none text-gray-900 shadow-lg focus:ring-4 focus:ring-orange-400 transition-all font-medium"
              />
              <Button
                type="submit"
                size="lg"
                disabled={isLoading || subscribed}
                className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl shadow-lg font-bold min-w-[140px] transition-transform active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : subscribed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                    "Subscribe Now"
                )}
              </Button>
            </form>
            
            {subscribed && (
                <p className="absolute -bottom-8 left-0 text-white text-sm font-semibold animate-in fade-in slide-in-from-top-2">
                    ✓ Welcome to the FreshMarket family!
                </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
