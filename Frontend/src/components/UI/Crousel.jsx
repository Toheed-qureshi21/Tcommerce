import React from 'react'
import { NavLink } from 'react-router-dom';
import categories from '../../Data/products.json';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
const Crousel = () => {
    const responsive = {
        0: { items: 1 },
        600: { items: 2 },
        1024: { items: 5 },
      };
      const categoryItems = categories?.map(p => (
        <div className="space-x-1" key={p.name}>
    
        <NavLink
          to={`/category/${p.name.toLowerCase()}`}
          className="inline-block  min-w-[12rem] h-[12rem] border relative hover:brightness-75 transition-all duration-300 rounded overflow-hidden "
          
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
    <AliceCarousel
    mouseTracking
    infinite
    style={{ display: 'flex', justifyContent: 'space-between' }}
    autoPlay
    autoPlayInterval={1000}
    animationDuration={1000}
    disableDotsControls
    disableButtonsControls
    items={categoryItems}
    responsive={responsive}
    />
  )
}

export default Crousel
