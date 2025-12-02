'use client'
import { useEffect, useState } from "react"
import ClientCard from "../ClientCrad/ClientCard"
import ClientReview from "../ClientReview/ClientReview"

function ClientList() {
  // ✅ FIX: Explicitly define the state type as number | undefined
  const [viewreview,setviewReview]=useState<number | undefined>(undefined) 
  
  const clientInfoArr=[
  { name: 'Alice', project: 'Website', review: 'Great work!', image: '/next.svg' },
  { name: 'Bob', project: 'App', review: 'Amazing!', image: '/next.svg' },
  { name: 'Charlie', project: 'Dashboard', review: 'Loved it!', image: '/next.svg' }]

  return (
    <div className="flex w-[100%] justify-around">
      <div className="grid grid-cols-3 gap-8">
      {clientInfoArr.map((e,i)=>{
        return <ClientCard
        key={i} // ✅ FIX: Added a unique key for list rendering
        name={e.name}
        src={e.image}
        num={i}
        select={setviewReview}
        />
      })}
      </div>
      {/* TypeScript now knows viewreview is a number here */}
      {viewreview!== undefined && (
      <ClientReview
        name={clientInfoArr[viewreview].name}
        project={clientInfoArr[viewreview].project}
        review={clientInfoArr[viewreview].review}
        src={clientInfoArr[viewreview].image}
      />
      )}
    </div>
  )
}

export default ClientList
