import { Leaf, Heart, Users, Award } from 'lucide-react';

const values = [
  { icon: Leaf, title: 'Sustainability', description: 'Committed to environmentally friendly practices and supporting sustainable farming.' },
  { icon: Heart, title: 'Health', description: 'Providing nutritious, organic products that support a healthy lifestyle.' },
  { icon: Users, title: 'Community', description: 'Supporting local farmers and building stronger communities together.' },
  { icon: Award, title: 'Quality', description: 'Never compromising on quality, freshness, or taste in every product we offer.' },
];

export function About() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="uppercase tracking-[0.2em] text-xs font-semibold text-primary-foreground/70 mb-3">Our story</p>
          <h1 className="text-5xl mb-4">About FreshMarket</h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl">
            Bringing fresh, organic, and sustainably sourced food to your table since 2020.
          </p>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl mb-6">Our Story</h2>
        <div className="space-y-4 text-foreground/80 leading-relaxed">
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
      <div className="bg-secondary/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
