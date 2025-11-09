'use client'
import { useEffect, useState } from "react"
import ClientCard from "../ClientCrad/ClientCard"
import ClientReview from "../ClientReview/ClientReview"

function ClientList() {
  const [viewreview,setviewReview]=useState()
  const clientInfoArr=[
  { name: 'Alice', project: 'Website', review: 'Great work!', image: '/next.svg' },
  { name: 'Bob', project: 'App', review: 'Amazing!', image: '/next.svg' },
  { name: 'Charlie', project: 'Dashboard', review: 'Loved it!', image: '/next.svg' }]

  return (
    <div className="flex w-[100%] justify-around">
      <div className="grid grid-cols-3 gap-8">
      {clientInfoArr.map((e,i)=>{
        return <div key={i}><ClientCard
        name={e.name}
        src={e.image}
        num={i}
        select={setviewReview}
        /></div>
      })}
      </div>
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