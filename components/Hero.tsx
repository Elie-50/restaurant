import Image from "next/image"
import Link from "next/link"
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

function Hero() {
  return (
    <section id="hero" className="py-16">
      {/* Hero Content */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Text */}
        <div>
          <h1 className="title">
            DSS RESTAURANT
          </h1>
          <p className="subtitle">
            Discover our delicious meals made with fresh ingredients, served hot
            and fast. Your taste buds will thank you!
          </p>
          <Link href="/menu" >
            <div className="flex flex-row order-now items-center justify-center w-full lg:w-fit">
                <span>Order Now</span>
                <ArrowRightCircleIcon className="w-7 h-7 mx-2" />
            </div>
          </Link>
        </div>

        {/* Right Side: Burger Image (hidden on small devices) */}
        <div className="hero-image">
          <Image
            src="/burger.png"
            alt="Burger"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
