'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/Button'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const scrollToPackages = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const packagesSection = document.getElementById('packages')
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={150} height={38} className="w-auto h-8 sm:h-10" priority />
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            <Link href="/about" className="text-base font-medium text-[#004643] hover:text-opacity-80 transition-colors">About</Link>
            <a href="#packages" onClick={scrollToPackages} className="text-base font-medium text-[#004643] hover:text-opacity-80 transition-colors">Packages</a>
            <Link href="/contact" className="text-base font-medium text-[#004643] hover:text-opacity-80 transition-colors">Contact</Link>
          </nav>
          
          <div className="hidden md:block">
            <Link href="/user-login">
              <Button>Log in</Button>
            </Link>
          </div>
          
          <div className="md:hidden">
            <button
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-[#004643] hover:text-opacity-80 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#004643]"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}
        aria-label="Mobile menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-[#004643] hover:text-opacity-80 hover:bg-gray-50 transition-colors">About</Link>
          <a href="#packages" onClick={scrollToPackages} className="block px-3 py-2 rounded-md text-base font-medium text-[#004643] hover:text-opacity-80 hover:bg-gray-50 transition-colors">Packages</a>
          <Link href="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-[#004643] hover:text-opacity-80 hover:bg-gray-50 transition-colors">Contact</Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-5">
            <Link href="/user-login" className="block w-full px-5 py-3 text-center font-medium text-white bg-[#004643] hover:bg-opacity-90 transition-colors rounded-md">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}