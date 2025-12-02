'use client'
import React, { useEffect, useState } from 'react'
import CreateService from './CreateService/CreateService'
import UpdateService from './UpdateService/UpdateService' // Import the update component
interface Provider {
  id: string;   
  firstName: string;
  lastName: string;
  imageurl: string;
  bio: string;
  email: string;
}
interface ServiceType {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  providers: Provider[] | string[]
}
// need to fix delete servic function
function ServicesDash() {
  const [services, setServices] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreate, setIsCreate] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [serviceToEdit, setServiceToEdit] = useState<ServiceType | null>(null)

  // Fetch services function that can be reused
  const fetchServices = async () => {
    try {
      setLoading(true)
      const res = await fetch('/app/api/services')
      if (!res.ok) throw new Error('Failed to fetch services')
      const data: ServiceType[] = await res.json()
      setServices(data)
    } catch (err) {
      console.error('Failed to fetch services:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const openCreateModule = () => {
    setIsCreate(true)
  }

  const closeCreateModule = () => {
    setIsCreate(false)
    fetchServices() // Refresh the services list after creating
  }

  const openUpdateModule = (service: ServiceType) => {
    setServiceToEdit(service)
    setIsUpdate(true)
  }

  const closeUpdateModule = () => {
    setIsUpdate(false)
    setServiceToEdit(null)
    fetchServices() // Refresh the services list after updating
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
   
    try {
      const res = await fetch(`/app/api/services`, {
        method: 'DELETE',
        headers:{
          'Content-Type':'Application/JSON'
        },
        body:JSON.stringify(serviceId)
      })
      
      if (res.ok) {
        fetchServices() // Refresh the list
      } else {
        alert('Failed to delete service')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('Error deleting service')
    }
  }

  if (loading) return <div className="p-4">Loading services...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <button 
          className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors'
          onClick={openCreateModule}
        >
          Add Service
        </button>
      </div>

      {/* Create Service Modal */}
      {isCreate && (
        <CreateService
          openCreateModule={closeCreateModule}
        />
      )}

      {/* Update Service Modal */}
      {isUpdate && serviceToEdit && (
        <UpdateService
          openUpdateModule={closeUpdateModule}
          serviceToEdit={serviceToEdit}
          onServiceUpdated={closeUpdateModule}
        />
      )}

      {services.length === 0 && (
        <div className="text-center py-8">
          <h2 className="text-xl text-gray-500">No services found</h2>
          <p className="text-gray-400">Create your first service to get started</p>
        </div>
      )}

      {services.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.id} className="border p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
              {service.description && (
                <p className="text-gray-600 mb-2">{service.description}</p>
              )}
              {/* <div className="flex justify-between text-sm text-gray-500">
                <span>Duration: {service.duration} min</span>
                <span className="font-semibold">R{service.price}</span>
              </div> */}
              
              {/* Edit/Delete buttons */}
              <div className="mt-3 flex space-x-2">
                <button 
                  className="text-blue-600 text-sm hover:underline"
                  onClick={() => openUpdateModule(service)}
                >
                  Edit
                </button>
                <button 
                  className="text-red-600 text-sm hover:underline"
                  onClick={() => handleDeleteService(service.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ServicesDash