
import React from 'react'

function Team() {
    const members=Array(3).fill(0)
  return (
    <div className='p-[2.5em] text-center'>
        <h2>Team</h2>
        <div className='mt-[1em] grid grid-cols-1 md:grid-cols-3 gap-2'>
        {members.map((e,i)=>{return <div key={i}>
        <Card
        team='team member name'
        role='team member role'
        text='team member short bio'
        />
        </div>})}
        </div>
    </div>
  )
}

export default Team
interface CardProps {
    team: string
    role:string
    text: string
  }
function Card({ team, text,role }: CardProps) {
  return (
    <div className="bg-white flex-shrink-0 border p-8  shadow-xl min-w-[300px] h-[300px]">    
        <p className="mt-4 font-bold">{team}</p>
        <p>{role}</p>
        <p className="italic">{text}</p>
        
    </div>
  )
}

