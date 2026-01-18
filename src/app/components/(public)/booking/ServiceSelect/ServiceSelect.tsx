import React from 'react'
interface Props {
    select: (val: any) => void;
    viewNum: (val: any) => void;
    viewselected: number
    data: any;
    bookingsetting:any;
  }
function ServiceSelect({ select, viewNum,viewselected, data ,bookingsetting}: Props) {
    
  return (
    <div>
        <h1>Select Service</h1>
        {Array.isArray(bookingsetting) &&
            bookingsetting.map((e, i) => {
             const service = e.service;
                if (!service) return null;
                if(service.isActive==false) return null
                const isSelected =data.serviceNum === i
                return <div key={i} 
                onClick={() =>
                    select({ ...data,serviceNum:i })
                  }
                >
                <div className={`p-4 border rounded-lg cursor-pointer shadow hover:shadow-lg transition
                ${isSelected ? "bg-gray-400 border-gray-400" : "bg-white"}`}>
                    <h2>{service.name}</h2>
                    <h3>{service.description}</h3>
                </div>
                </div>;
            })}

        <div className="">

        <button
          onClick={() => viewNum(viewselected + 1)}
          className=""
          disabled={data.serviceNum === null}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ServiceSelect