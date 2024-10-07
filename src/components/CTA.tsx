import React from 'react';
import { fraunces, dmSans } from '@/app/fonts';
import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/Marquee"; // Updated import

const testimonials = [
  {
    name: "John Doe",
    
    body: "Investing in the Legacy Project was one of the best decisions I've made. The returns are consistent, and I feel part of something truly impactful.",
    img: "https://avatar.vercel.sh/johndoe",
  },
  {
    name: "Jane Smith",
    
    body: "The transparency is incredible! I can track every step of the project and the referral rewards have given me an extra source of income.",
    img: "https://avatar.vercel.sh/janesmith",
  },
  {
    name: "Mike Johnson",
    
    body: "I love that the Legacy Project focuses on both financial growth and social impact. Creating jobs and opportunities feels like giving back while earning!",
    img: "https://avatar.vercel.sh/mikejohnson",
  },
];

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 mx-2",
        "border-gray-50/[.1] bg-gray-50/[.10] hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-white">{body}</blockquote>
    </figure>
  );
};

const CTA: React.FC = () => {
  return (
    <section className="relative h-[892.98px] overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full"
        >
          <source src="/7.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Darker overlay */}
        <div className="absolute inset-0 bg-black opacity-75"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <h2 className={`text-4xl md:text-5xl text-white font-bold mb-8 text-center pt-12 ${fraunces.className}`}>
            What Our Investors<br />
            Are Saying
          </h2>
          
          {/* Testimonials */}
          <div className="w-full mb-12 overflow-hidden">
            <Marquee pauseOnHover className="[--duration:30s] mb-4">
              {testimonials.map((testimonial, index) => (
                <ReviewCard key={index} {...testimonial} />
              ))}
            </Marquee>
            <Marquee pauseOnHover reverse className="[--duration:30s]">
              {testimonials.map((testimonial, index) => (
                <ReviewCard key={index} {...testimonial} />
              ))}
            </Marquee>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-5xl pb-12">
          <div className="flex flex-col items-center text-center">
            <h3 className={`text-3xl text-white font-bold mb-4 ${fraunces.className}`}>
              Need Help? We're Here for You
            </h3>
            <p className={`text-white text-lg mb-6 max-w-xl ${dmSans.className}`}>
              Our customer support team is available 24/7 to assist with any questions or concerns.
            </p>
            <button className={`bg-[#0F3D3E] text-white px-6 py-3 rounded-full hover:bg-[#1A5658] transition duration-300 ${dmSans.className}`}>
              Chat with Us Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;