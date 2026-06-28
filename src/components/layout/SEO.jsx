import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description = "Expert Defence Coaching for Army, Navy, Air Force, Police & Agniveer Aspirants. Join Vivek Defence Academy & Build Your Future in Armed Forces.", 
  keywords = "Defense Academy, Army Coaching, Navy Coaching, Air Force Coaching, Police Coaching, Agniveer, NDA, Physical Training, Nizamabad",
  image = "/og-image.jpg",
  url = "https://vivekdefenceacademy.com"
}) => {
  const siteTitle = title ? `${title} | Vivek Defence Academy` : "Vivek Defence Academy | Premium Defence Coaching";

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph tags for social media */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* canonical link */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
