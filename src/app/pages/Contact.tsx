import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export function Contact() {
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <div className="bg-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-4">Contact Us</h1>
          <p className="text-xl text-orange-100 max-w-3xl">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl mb-6">Send us a Message</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border rounded-md"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border rounded-md"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border rounded-md"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-2 border rounded-md resize-none"
                      placeholder="Your message..."
                    />
                  </div>
                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="bg-orange-100 p-3 rounded-full h-fit">
                    <Mail className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">Email</h3>
                    <p className="text-gray-600">contact@freshmarket.com</p>
                    <p className="text-gray-600">support@freshmarket.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="bg-orange-100 p-3 rounded-full h-fit">
                    <Phone className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">+1 (555) 987-6543</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="bg-orange-100 p-3 rounded-full h-fit">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">Address</h3>
                    <p className="text-gray-600">123 Fresh Street</p>
                    <p className="text-gray-600">Green Valley, CA 94102</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="bg-orange-100 p-3 rounded-full h-fit">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="mb-1">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 8am - 8pm</p>
                    <p className="text-gray-600">Saturday - Sunday: 9am - 6pm</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
