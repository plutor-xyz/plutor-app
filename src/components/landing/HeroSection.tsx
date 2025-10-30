'use client'

import Link from 'next/link';
import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Button from '@/components/ui/button';
import { HexPattern } from './HexPattern';

export const HeroSection: React.FC = () => {
  return (
    <>
      <section className="relative min-h-screen h-[100vh] flex items-center justify-center align-center overflow-hidden bg-black">
        <HexPattern 
          className="absolute left-0 top-0 pointer-events-auto z-20" 
          width={431} 
          height={840}
        />
        
        <HexPattern 
          className="absolute right-0 top-0 pointer-events-auto z-20" 
          width={431} 
          height={840}
          flipped={true}
        />
        
        <div className="max-w-5xl w-full text-center relative z-10 pointer-events-none px-4">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-[#A0E66E] mb-4 text-center text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Create Wealth From{' '}
                <span className="text-white">Invoices</span>
              </h1>
              
              <p className="text-gray-300 mb-8 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
                Plutor turns your invoices into instant liquidity using{' '}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#A0E66E] hover:text-white transition-colors pointer-events-auto"
                >
                  TIPS Protocol
                  <ExternalLink className="w-3 h-3" />
                </a>{' '}
                on Solana. Don't wait 30-90 days for payment - get funded in seconds.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/connect" className="pointer-events-auto">
                <Button
                  variant="success"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  className="text-[#143200] bg-[#A0E66E] hover:bg-opacity-80 font-semibold px-6 py-3 rounded-md transition-colors"
                >
                  Start Creating
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="md"
                className="text-[#A0E66E] border border-[#A0E66E] hover:bg-[#A0E66E] hover:text-[#143200] transition-colors pointer-events-auto px-6 py-3"
              >
                View Demo
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <span className="text-[#A0E66E] opacity-70 text-xs">
                Built on:
              </span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center px-3 py-1 bg-black/50 rounded-full border border-[#A0E66E]/30">
                  <span className="text-xs font-medium text-[#A0E66E]">
                    TIPS
                  </span>
                </div>
                <div className="flex items-center justify-center px-3 py-1 bg-black/50 rounded-full border border-[#A0E66E]/30">
                  <span className="text-xs font-medium text-[#A0E66E]">
                    Solana
                  </span>
                </div>
                <div className="flex items-center justify-center px-3 py-1 bg-black/50 rounded-full border border-[#A0E66E]/30">
                  <span className="text-xs font-medium text-[#A0E66E]">
                    Web3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="h-[64px]"></div>
    </>
  );
};