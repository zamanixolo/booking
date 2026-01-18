'use client'

import Card from "../../../Card/Card"

interface Review {
    id: number
    text: string
    author: string
  }

function Reviwes() {
    const list: Review[] = [{id:0,author:'Maria Garcia',text:''},{id:1,author:'Jamie Smith',text:''},{id:2,author:'Ryan Choi',text:''},{id:3,author:'Alex Turner',text:''}]
  return (
    <div className="h-[100vh] bg-black flex flex-col items-center">
        <h2 className="text-[48px] text-center text-white">What Our Clients Are Saying</h2>
        <div className="w-[88%] mx-auto overflow-hidden mt-auto mb-auto">
            <div className="flex gap-8">
            {list.map((review) => (
            <Card key={review.id} author={review.author} text={review.text} />
            ))}
            </div>
        </div>
    </div>
  )
}

export default Reviwes