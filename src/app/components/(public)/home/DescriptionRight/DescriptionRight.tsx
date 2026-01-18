import Image from "next/image"

function DescriptionRight() {
    let images=Array(6).fill(0)
    return (
        <div className="h-[100vh]  flex">
           
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-full">
           {images.map((e,i)=>{return <img key={i} src={'/app/next.svg'} alt={'name'} width={250} height={400}/>})}
           </div>
           <div className="bg-white w-[50%] pl-[2.5em] pr-[2.5em]">Description Right</div> 
        </div>
      )
    }

export default DescriptionRight