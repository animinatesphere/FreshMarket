import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In a real app, this would send to a backend
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="bg-orange-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="h-8 w-8" />
              <h3 className="text-2xl">Subscribe to Our Newsletter</h3>
            </div>
            <p className="text-orange-100">
              Get the latest updates on new products and exclusive offers!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full md:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 text-white bg-orange-700 px-6 py-3 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span>Successfully subscribed!</span>
              </div>
            ) : (
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="px-4 py-3 rounded-lg w-full md:w-80 outline-none"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  Subscribe
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
