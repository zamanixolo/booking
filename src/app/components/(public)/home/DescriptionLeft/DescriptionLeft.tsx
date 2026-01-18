import Image from "next/image"


function DescriptionLeft() {
    let images=Array(6).fill(0)
  return (
    <div className="h-[100vh]  flex">
       <div className="bg-white w-[50%] pl-[2.5em] pr-[2.5em]">Description Left</div> 
       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 h-full">
       {images.map((e,i)=>{return <img key={i} src={'/app/next.svg'} alt={'name'} width={250} height={400}/>})}
       </div>
    </div>
  )
}

export default DescriptionLeft