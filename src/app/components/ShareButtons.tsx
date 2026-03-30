import { Share2, Facebook, Twitter, Mail, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url = window.location.href }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    email: `mailto:?subject=${shareTitle}&body=Check out this product: ${shareUrl}`
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Share2 className="h-4 w-4" />
        <span>Share this product:</span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.facebook, '_blank')}
          className="flex-1"
        >
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(shareLinks.twitter, '_blank')}
          className="flex-1"
        >
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = shareLinks.email}
          className="flex-1"
        >
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="flex-1"
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
    </div>
  );
}
