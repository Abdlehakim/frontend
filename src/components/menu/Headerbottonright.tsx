import Link from 'next/link'
import React from 'react'

const Headerbottonright = () => {
  return (
    
        
          <div className="flex justify-end gap-[8px] xl:gap-[16px]  2xl:gap-[40px] font-semibold items-center text-white   max-xl:text-xs max-lg:hidden">
            <Link className="hover:text-secondary uppercase" href="/productpromotion">
              PROMOTION
            </Link>
            <Link className="hover:text-secondary uppercase" href="/nouveau-product">
            Nouveau PRODUITS
            </Link>
            <Link className="hover:text-secondary " href="/bestproductcollection">
            MEILLEURE COLLECTION
            </Link>
            <Link className="hover:text-secondary uppercase" href="/ourstores">
              NOS BOUTIQUES
            </Link>
            <Link className="hover:text-secondary uppercase" href="/blog">
              BLOG
            </Link>
            <Link className="hover:text-secondary uppercase" href="/contactus">
            CONTACTEZ-NOUS
            </Link>
          </div>
  )
}

export default Headerbottonright