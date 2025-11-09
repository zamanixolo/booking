'use client'

import Image from "next/image";
import { useEffect, useState } from "react";

interface Props {
  select: (val: any) => void;
  viewNum: (val: any) => void;
  viewselected: number;
  data: any;
  bookingsetting:any;
}
interface TeamMember {
bio:string;
firstName:string;
id:string;
imageurl:string;
isAvailable:boolean;
lastName:string;
rating:number;
role:string;
}
function Member({ select, viewNum, viewselected, data ,bookingsetting}: Props) {
  // need a loading state
  const [members,setMembers]=useState<TeamMember[]>([])

  useEffect(()=>{
  //   const providerData = Array.isArray(bookingsetting[data.serviceNum]?.provider)
  // ? bookingsetting[data.serviceNum].provider
  // : [bookingsetting[data.serviceNum]?.provider].filter(Boolean);
  const providerData =bookingsetting[data.serviceNum].providers
  setMembers(providerData)
   
  },[])

  return (
    <div className="w-[90%] mx-auto">
      <h2 className="text-xl font-semibold mb-4">Member</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member, index) => {
          const isSelected = data?.firstName === member.firstName;

          return (
            <div
              key={index}
              onClick={() =>
                select({ ...data, firstName: member.firstName, lastName: member.lastName})
              }
              className={`p-4 border rounded-lg cursor-pointer shadow hover:shadow-lg transition
                ${isSelected ? "bg-gray-400 border-gray-400" : "bg-white"}`}
            >
              <Image
                src={'next.svg'}
                alt={member.firstName}
                height={200}
                width={200}
                className="mx-auto mb-2"
              />
              <h3 className="text-lg font-semibold text-center">{member.firstName} {member.lastName}</h3>
              <h3 className="text-gray-700 text-center">{member.bio}</h3>
              <p className="text-gray-500">{member.role}</p>
             
            </div>
          );
        })}
      </div>

      <div className="">
        <button
          onClick={() => viewNum(viewselected - 1)}
          className=""
        >
          Prev
        </button>
        <button
          onClick={() => viewNum(viewselected + 1)}
          className=""
          disabled={data.firstName === ""}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Member;

