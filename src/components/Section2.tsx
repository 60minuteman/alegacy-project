import Image from 'next/image';
import { fraunces, dmSans } from '@/app/fonts';

export const Section2 = () => {
  return (
    <section className="flex flex-col md:flex-row-reverse justify-between items-center max-w-7xl mx-auto px-3 py-10 md:py-48 gap-6 md:gap-10">
      <div className="relative w-full md:w-1/2">
        <Image 
          src="/team4.png" 
          alt="Section 2 Image" 
          width={520} 
          height={360} 
          className="rounded-[16px] md:rounded-[30px] w-full h-auto"
        />
      </div>
      <div className="w-full md:w-1/2">
        <h2 className={`text-2xl md:text-6xl font-bold mb-3 md:mb-6 text-[#0F3D3E] ${fraunces.className}`}>
          Creating a Legacy with LXT
        </h2>
        <p className={`text-sm md:text-xl text-[#4A4A4A] mb-5 md:mb-8 leading-relaxed ${dmSans.className}`}>
          As a product of Loyal Xtream Talents Ltd (LXT), the Legacy Project reflects our core values of transparency, innovation, and community impact. Our vision is to become Africa's leading investment platform, helping millions achieve financial stability while contributing to the economic development of the continent. We aim to create legacies that last, ensuring that wealth can be passed down for generations to come.
        </p>
        <button className={`w-full md:w-auto bg-[#0F3D3E] text-white px-5 md:px-8 py-2 md:py-3 rounded-[32px] text-sm md:text-base font-semibold hover:bg-[#0D3233] transition duration-300 ${dmSans.className}`}>
          Invest Now
        </button>
      </div>
    </section>
  );
};