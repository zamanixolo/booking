import Image from "next/image"


function History() {
  return (
    <div className="h-[100vh] flex gap-8">
    <div className="bg-white w-[50%] pl-[2.5em] pr-[2.5em]">
       <h2>History</h2>
    </div> 
    <div className="h-[80vh] relative w-[40%]">
    <img src={'/app/next.svg'} alt={'name'} />
    </div>
 </div>
  )
}

export default History