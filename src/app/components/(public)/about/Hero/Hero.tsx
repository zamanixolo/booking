import Image from "next/image"
function Hero() {
  return (
    <div className="h-[90vh] relative flex items-center">
        <img src={'/app/next.svg' } alt={''} />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-white text-4xl font-bold ">text here</h1>
        </div>
      </div>
    </div>
  )
}

export default Hero