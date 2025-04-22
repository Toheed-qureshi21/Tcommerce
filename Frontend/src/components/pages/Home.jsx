
import Crousel from '../UI/Crousel';


const Home = () => {

  return (
    <section className="text-white">
      
      <section className="relative h-screen w-screen">
        <img
          src="/Landing.webp"
          alt="Landing background"
          className="absolute h-full w-full object-fill"
          loading='lazy'
        />

        <div className="container relative ml-[3rem] max-sm:mr-[3rem] z-50 top-[2rem]  flex flex-col gap-8">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            Shop Smarter,<br /> Live Better
          </h2>
          <p className="text-md sm:text-xl md:text-2xl">
            Discover the latest trends and best deals at Tcommerce.
            <br /> From fashion to electronics,
            <br /> we bring you top-quality products
            <br /> with fast shipping and secure payments.
            <br /> Shop now and experience effortless online shopping!
          </p>
        </div>
      </section>

      
      <section className="transition-colors duration-300 px-4 sm:px-8 py-[2rem] space-y-[3rem] h-[35rem]">
        <h3 className="text-center py-8 text-2xl font-semibold">Latest Collections</h3>
      
        <Crousel/>
    

      </section>
    </section>
  );
};

export default Home;
