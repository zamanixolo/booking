'use client'
import React from 'react'

interface Props {

  viewNum: (val: any) => void;
  viewselected: number;
  data: any;
}

const handlebooking=(e: React.FormEvent)=>{
    e.preventDefault()
    // api call here for booking
}
function Confirm({  viewNum, viewselected, data }: Props) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Confirmation</h2>
      
      <table className="table-auto border border-gray-300 w-full mb-4">
        <tbody>
          {data.date && (
            <tr>
              <td className="border px-4 py-2 font-medium">Date</td>
              <td className="border px-4 py-2">{data.date}</td>
            </tr>
          )}
          {data.time && (
            <tr>
              <td className="border px-4 py-2 font-medium">Time</td>
              <td className="border px-4 py-2">{data.time}</td>
            </tr>
          )}
          {data.member && (
            <tr>
              <td className="border px-4 py-2 font-medium">Member</td>
              <td className="border px-4 py-2">{data.member}</td>
            </tr>
          )}
          {data.price && (
            <tr>
              <td className="border px-4 py-2 font-medium">Price</td>
              <td className="border px-4 py-2">R{data.price}</td>
            </tr>
          )}
        </tbody>
      </table>

        <form onSubmit={handlebooking}>
        <div className='mb-[0.5em] align-center '>
        <input type='text' className='border border-gray-200 w-[60%] mx-auto' placeholder='first name here'/>
        <br/>
        <input type='text' className='border border-gray-200 w-[60%] mx-auto' placeholder='last name here'/>
        <br/>
        <input type='email' className='border border-gray-200 w-[60%] mx-auto' placeholder='email here'/>
        <br/>
        <input type='phone' className='border border-gray-200 w-[60%] mx-auto' placeholder='phone number here'/>
        </div>
        <div className="flex">
        <button 
          onClick={() => viewNum(viewselected - 1)} 
          className=""
        >
          Prev
        </button>

        <button 
          type='submit'
          className=""
        >
          Confirm
        </button>
      </div>
        </form>


    </div>
  )
}

export default Confirm
