'use client'
import React, { use, useState } from 'react'
import Nav from './Nav'
import MobileNav from './MobileNav'
import { usePathname } from 'next/navigation'

const ResponsiveNav = () => {
  const[showNav, setShownav] = useState(false);

  const openNavHandler=()=>setShownav(true);
  const closeNavHandler=()=>setShownav(false);
  const pathname = usePathname();
  // ❌ Ne pas afficher le header sur /dashboard
  if (pathname.startsWith('/dashboard')) {
    return null
  }
  return (
    <div>
      <Nav openNav={openNavHandler}/>
      <MobileNav showNav={showNav} closeNav={closeNavHandler}/>
    </div>
  )
}

export default ResponsiveNav
