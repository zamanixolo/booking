'use client'
import React, { useState, ChangeEvent, useEffect } from 'react';

interface Provider {
  id: string;   
  firstName: string;
  lastName: string;
  imageurl: string;
  bio: string;
  email: string;
}

// Update this interface - providers can be objects or IDs
interface Service {
  id: string;
  name: string;
  description?: string;
  // duration: number;
  // price: number;
  providers: Provider[] | string[]; // Can be objects or IDs
}

interface UpdateServiceProps {
  openUpdateModule: () => void;
  serviceToEdit: Service;
  onServiceUpdated: () => void;
}

function UpdateService({ openUpdateModule, serviceToEdit, onServiceUpdated }: UpdateServiceProps) {
  // Convert providers from objects to IDs if needed
  const [service, setService] = useState<{
    id: string;
    name: string;
    description: string;
    // duration: number;
    // price: number;
    providers: string[]; // Always store as IDs
  }>({
    ...serviceToEdit,
    description: serviceToEdit.description || '',
    // Convert providers to IDs if they come as objects
    providers: Array.isArray(serviceToEdit.providers) 
      ? serviceToEdit.providers.map(p => typeof p === 'string' ? p : p.id)
      : []
  });
  
  const [availableProviders, setAvailableProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
   
    const getProviders = async () => {
      const res = await fetch('/api/team/getActiveProvider')
      const providers:any = await res.json()
      setAvailableProviders(providers)
    }
    // getProviders()
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'duration') {
      setService(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setService(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleProvider = (providerId: string) => {
    setService(prev => {
      const isSelected = prev.providers.includes(providerId);
      if (isSelected) {
        return {
          ...prev,
          providers: prev.providers.filter(id => id !== providerId)
        };
      } else {
        return {
          ...prev,
          providers: [...prev.providers, providerId]
        };
      }
    });
  };

  const removeProvider = (providerId: string) => {
    setService(prev => ({
      ...prev,
      providers: prev.providers.filter(id => id !== providerId)
    }));
  };

  const getSelectedProviderNames = (): string[] => {
    return service.providers.map(providerId => {
      const provider = availableProviders.find(p => p.id === providerId);
      return provider ? `${provider.firstName} ${provider.lastName}` : 'Unknown';
    }).filter(name => name !== 'Unknown');
  };

  const isProviderSelected = (providerId: string): boolean => {
    return service.providers.includes(providerId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('🟡 Updating service with providers:', service.providers);
      
      const response = await fetch(`/app/api/services`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id:service.id,
          name: service.name,
          description: service.description,
          // duration: service.duration,
          // price: service.price,
          // providers: service.providers
        })
      });
      
      const result:any = await response.json();
      console.log('🟢 Update result:', result);
      
      if (response.ok) {
        onServiceUpdated();
      } else {
        alert(result.msg || 'Failed to update service');
      }
    } catch (error) {
      console.error('❌ Error updating service:', error);
      alert('Error updating service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <form className='bg-white p-6 shadow-xl w-96 max-h-[90vh] overflow-y-auto' onSubmit={handleSubmit}>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>Update Service</h2>
          <button 
            type='button'
            onClick={openUpdateModule}
            className='text-gray-500 hover:text-gray-700 text-xl font-bold'
            disabled={isLoading}
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
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
          
          {/* <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Duration (minutes)
            </label>
            <input 
              type="number"
              name="duration"
              placeholder="Duration in minutes"
              value={service.duration} 
              onChange={handleInputChange}
              min="15"
              step="15"
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div> */}
          
          {/* <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Price
            </label>
            <input 
              type="number" 
              name="price"
              placeholder="Price"
              step="0.01"
              min="0"
              value={service.price} 
              onChange={handleInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div> */}
          
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
              className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Providers selection */}
          {/* {service.providers.length > 0 && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Selected Providers ({service.providers.length})
              </label>
              <div className='flex flex-wrap gap-2 mb-3'>
                {getSelectedProviderNames().map((providerName, index) => (
                  <div
                    key={service.providers[index]}
                    className='flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm'
                  >
                    <span>{providerName}</span>
                    <button
                      type='button'
                      onClick={() => removeProvider(service.providers[index])}
                      className='ml-2 text-blue-600 hover:text-blue-800 font-bold'
                      disabled={isLoading}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {/* <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Select Providers {service.providers.length > 0 && `(${service.providers.length} selected)`}
            </label>
            <div className='border border-gray-300 rounded max-h-32 overflow-y-auto'>
              {availableProviders.map(provider => (
                <div
                  key={provider.id}
                  className={`flex items-center px-3 py-2 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                    isProviderSelected(provider.id)
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !isLoading && toggleProvider(provider.id)}
                >
                  <input
                    type="checkbox"
                    checked={isProviderSelected(provider.id)}
                    onChange={() => {}}
                    className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    disabled={isLoading}
                  />
                  <span className={`ml-3 text-sm ${
                    isProviderSelected(provider.id) ? 'text-blue-800 font-medium' : 'text-gray-700'
                  }`}>
                    {provider.firstName} {provider.lastName}
                  </span>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        <div className='flex justify-end space-x-3 mt-6'>
          <button
            type='button'
            onClick={openUpdateModule}
            className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50'
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50'
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update Service'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateService;