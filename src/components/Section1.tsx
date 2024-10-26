import Image from 'next/image';
import { fraunces, dmSans } from '@/app/fonts';

export const Section1 = () => {
  return (
    <section className="flex flex-col-reverse md:flex-row justify-between items-center max-w-7xl mx-auto px-3 py-10 gap-5">
      <div className="relative w-full md:w-1/2 mb-5 md:mb-0">
        <Image 
          src="/team1.png" 
          alt="Section 1 Image" 
          width={520} 
          height={360} 
          className="rounded-[16px] w-full h-auto"
        />
      </div>
      <div className="w-full md:w-1/2">
        <h2 className={`text-2xl md:text-6xl font-bold mb-3 md:mb-6 text-[#0F3D3E] ${fraunces.className}`}>
          More Than Just Financial Returns
        </h2>
        <p className={`text-sm md:text-xl text-[#4A4A4A] mb-5 md:mb-8 leading-relaxed ${dmSans.className}`}>
          Legacy Project is about creating long-term value, not just for investors but for society as a whole. As part of the Loyal Xtream Talents Ltd vision, our projects are designed to have a lasting impact on local communities, providing employment opportunities, fostering economic growth, and transforming lives. We are committed to building not only financial wealth but also social equity.
        </p>
        <button className={`w-full md:w-auto bg-[#0F3D3E] text-white px-5 md:px-8 py-2 md:py-3 rounded-[32px] text-sm md:text-base font-semibold hover:bg-[#0D3233] transition duration-300 ${dmSans.className}`}>
          Invest Now
        </button>
      </div>
    </section>
  );
};