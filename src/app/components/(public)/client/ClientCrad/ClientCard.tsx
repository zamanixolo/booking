import Image from "next/image"

interface CardProps {
    name: string
    src:string
    select:(val: any) => void
    num:number
  }
function ClientCard({name,src,select,num}:CardProps) {
  return (
    <div onClick={()=>{select(num)}}>
        <div className="relative h-[200px] w-[200px]">
        <Image src={src} alt={name} fill className="object-fill"/>
        </div>
        <h3>
            {name}
        </h3>
    </div>
  )
}

export default ClientCard