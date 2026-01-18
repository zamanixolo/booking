'use client'

import Image from "next/image"
interface HeroProps {
    src: string 
    name: string
    text: string
  }

function Hero({src,name,text}: HeroProps) {

  return (
    <div className="relative w-full h-[600px]">
        <img src={src} alt={name}  />
        <div className="absolute top-[25%] left-[25em] text-center items-center flex  bg-white/30 backdrop-blur-md h-[300px] w-[40%] justify-center">
        <p className="text-[96px]">{text}</p>
        </div>
    </div>
  )
}

export default Hero