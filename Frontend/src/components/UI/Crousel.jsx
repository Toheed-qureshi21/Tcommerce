import React, { useRef } from 'react'
import { NavLink } from 'react-router-dom';
import categories from '../../Data/products.json';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react';
const Crousel = () => {
    const crouselRef = useRef(null);
    const handlePrev  = () => {
      if (crouselRef.current) {
        crouselRef.current.slidePrev()
      }
    }
    const handleNext =  () => {
      if (crouselRef.current) {
        crouselRef.current.slideNext()
      }
    }
    
    const responsive = {
        0: { items: 1 },
        500: { items: 2 },
        1024: { items: 4 },
      };
      const categoryItems = categories?.map(p => (
        <div className="space-x-8" key={p.name}>
    
        <NavLink
          to={`/category/${p.name.toLowerCase()}`}
          className="inline-block ml-12 min-w-[12rem] h-[12rem] border relative hover:brightness-75 transition-all duration-300 rounded overflow-hidden "
          
          >
          <img
            src={p.imageUrl}
            alt={p.name}
            className="h-full w-full object-cover absolute top-0 left-0 hover:scale-110 transition-all duration-300"
            loading='lazy'
            />
          <p className="absolute bottom-4 left-4 text-white font-bold bg-black/50 px-2 py-1 rounded">
            {p.name}
          </p>
        </NavLink>
            </div>
      ));
  return (
    <div className='flex relative w-full items-center justify-center'> 
    <button onClick={handlePrev} className="absolute left-1 sm:left-[-1.5rem] z-10 text-white hover:text-blue-600 transition-transform hover:scale-110"><ArrowLeftCircleIcon/></button>
    <AliceCarousel
    mouseTracking
    infinite
    style={{ display: 'flex', justifyContent: 'space-between'}}
    autoPlay
    autoPlayInterval={1000}
    animationDuration={1000}
    disableDotsControls
    disableButtonsControls
    keyboardNavigation={true}
    ref={crouselRef}
    items={categoryItems}
    responsive={responsive}
    />
    <button onClick={handleNext} className='absolute right-4 z-10 text-white hover:text-blue-600 transition-transform hover:scale-110'><ArrowRightCircleIcon/></button>
    </div>
  )
}

export default Crousel
