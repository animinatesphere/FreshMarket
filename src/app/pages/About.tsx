import { Leaf, Heart, Users, Award } from 'lucide-react';

export function About() {
  return (
    <div className="bg-gray-50">
      {/* Hero */}
      <div className="bg-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl mb-4">About FreshMarket</h1>
          <p className="text-xl text-orange-100 max-w-3xl">
            Bringing fresh, organic, and sustainably sourced food to your table since 2020.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl mb-6">Our Story</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            FreshMarket was founded with a simple mission: to make fresh, organic, and locally-sourced
            food accessible to everyone. We believe that what we eat matters, and we're passionate about
            connecting our customers with the best food producers in the region.
          </p>
          <p>
            Working directly with local farms and artisan producers, we ensure that every product meets
            our high standards for quality, sustainability, and taste. From farm-fresh vegetables to
            artisan breads and premium meats, we carefully curate our selection to bring you the finest
            products available.
          </p>
          <p>
            Today, we're proud to serve thousands of families, helping them eat healthier and support
            their local community. Join us in our mission to make good food accessible to all.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Committed to environmentally friendly practices and supporting sustainable farming.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl mb-2">Health</h3>
              <p className="text-gray-600">
                Providing nutritious, organic products that support a healthy lifestyle.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl mb-2">Community</h3>
              <p className="text-gray-600">
                Supporting local farmers and building stronger communities together.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl mb-2">Quality</h3>
              <p className="text-gray-600">
                Never compromising on quality, freshness, or taste in every product we offer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
