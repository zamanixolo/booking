'use client'
import React, { useState, ChangeEvent, useEffect } from 'react';

interface Providers{
  id: string;   
  firstName: string;
  lastName: string;
  imageurl: string;
  bio: string;
  email: string;
}
interface Service {
  name: string;
  description: string;
  // duration: number; // Changed from string to number
  // price: number;
  providers: string[];
}



interface CreateServiceProps {
  openCreateModule: () => void;
}

function CreateService({ openCreateModule }: CreateServiceProps) {
  const [service, setService] = useState<Service>({
    name: '',
    description: '',
    providers: []
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'duration') {
      setService(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setService(prev => ({ ...prev, [name]: value }));
    }
  };


  const handlesubmit =async (e: React.FormEvent)=>{
    e.preventDefault();
    const sub=await fetch('/app/api/services',
    {method:'POST',
    headers:{'Content-Type': 'application/json' },
    body:JSON.stringify({...service})})
    const res:any=await sub.json()
      openCreateModule()
    
  }
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <form className='bg-white p-6 shadow-xl w-96 max-h-[90vh] overflow-y-auto' onSubmit={handlesubmit}>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>Create Service</h2>
          <button 
            type='button'
            onClick={openCreateModule}
            className='text-gray-500 hover:text-gray-700 text-xl font-bold'
          >
            ×
          </button>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Service Name
            </label>
            <input 
              type="text" 
              name="name"
              placeholder="Service Name"
              value={service.name} 
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Description
            </label>
            <input 
              type="text" 
              name="description"
              placeholder="Description"
              value={service.description} 
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>

        <div className='flex justify-end space-x-3 mt-6'>
          <button
            type='button'
            onClick={openCreateModule}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors'
          >
            Create Service
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateService;