import { useState, useEffect } from 'react';
import {
  CircleFadingPlus,
  Trash,
  X,
  AlertTriangle,
} from 'lucide-react';
import { ProviderPage } from '../components/layout/ProviderLayout';
import ServiceImage from '../components/ui/ServiceImage';
import ServiceForm from '../components/provider/ServiceForm';

import authApi from '../config/auth-config';
import api from "../config/axios-config"

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[60]">
      <div className="bg-white rounded-t-lg sm:rounded-md shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
          <h3 className="text-xl font-semibold">Confirm Deletion</h3>
        </div>
        <p className="mb-6">
          Are you sure you want to delete this service? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ServiceList() {
  const [services, setServices] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [serviceToDeleteId, setServiceToDeleteId] = useState(null);
  const [providerProfile, setProviderProfile] = useState(null);

  useEffect(() => {
    authApi.get('/provider/profile').then((res) => setProviderProfile(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    authApi.get('/provider/services').then((response) => {
      const servicesData = response.data.map((service) => ({
        id: service.id,
        name: service.name,
        category: service.category?.name || '',
        category_id: service.category_id,
        visitingCharge: parseFloat(service.visiting_charge || 0),
        instantServiceCharge: parseFloat(service.instant_visiting_charge || 0),
        description: service.description,
        coverImage: service.cover_image,
        serviceLocations: service.locations || [],
        experience: service.experience,
        providedServices: service.specifications || [],
        workingImages: service.working_images || [],
        badgeStatus: service.badge_status || false,
        service_type: service.service_type || 'HOME',
        city: service.city || '',
        state: service.state || '',
        country: service.country || '',
        created: service.created
      }));
      setServices(servicesData);
    }).catch((error) => {
      console.error('Error fetching services:', error);
    });
  }, []);

  const [categories, setCategoies] = new useState([])

  useEffect(()=>{
    api.get("/category/names").then((res)=>{
      setCategoies(res.data)
    }).catch((err)=>{
      console.error(err);
    })
  },[])

  const filteredServices = services.filter((service) =>
    filterCategory === '' || service.category_id == filterCategory
  );

  const handleEdit = (id) => {
    const service = services.find((s) => s.id === id);
    setServiceToEdit(service);
    setEditModalOpen(true);
  };

  const handleDelete = (id) => {
    setServiceToDeleteId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    authApi.delete(`/services/${serviceToDeleteId}`)
      .then((response) => {
        console.log('Service deleted successfully:', response.data);
        const updatedServices = services.filter((s) => s.id !== serviceToDeleteId);
        setServices(updatedServices);
      })
      .catch((error) => {
        console.error('Error deleting service:', error);
        
        // Check if the error is due to existing orders
        if (error.response && error.response.status === 409) {
          alert(`Cannot delete this service because it has ${error.response.data.ordersCount} associated orders. Complete or cancel these orders first.`);
        } else {
          alert('Failed to delete service. Please try again.');
        }
      })
      .finally(() => {
        setDeleteModalOpen(false);
        setServiceToDeleteId(null);
      });
  };

  const saveEditedService = (editedService) => {
    
    // Create FormData object for file uploads
    const formData = new FormData();
    formData.append('name', editedService.name);
    formData.append('category_id', editedService.category_id);
    formData.append('visiting_charge', editedService.visiting_charge);
    formData.append('instant_visiting_charge', editedService.instant_visiting_charge);
    formData.append('description', editedService.description);
    formData.append('experience', parseInt(editedService.experience || 0));
    formData.append('service_type', editedService.service_type);
    
    // Handle arrays
    if (Array.isArray(editedService.locations)) {
      editedService.locations.forEach(location => {
        formData.append('locations[]', location);
      });
    }
    
    if (Array.isArray(editedService.specifications)) {
      editedService.specifications.forEach(spec => {
        formData.append('specifications[]', spec);
      });
    }
    
    // Handle files
    if (editedService.cover_image) {
      formData.append('cover_image', editedService.cover_image);
    }
    
    // Handle working images
    if (editedService.working_images && editedService.working_images.length > 0) {
      console.log("Appending working images:", editedService.working_images);
      
      // Append each file individually
      for (let i = 0; i < editedService.working_images.length; i++) {
        formData.append('working_images', editedService.working_images[i]);
      }
    }
    
    // Add other fields
    formData.append('badge_status', editedService.badge_status || false);
    formData.append('city', editedService.city || providerProfile?.city || '');
    formData.append('state', editedService.state || providerProfile?.state || '');
    formData.append('country', editedService.country || providerProfile?.country || '');
    
    // Determine if this is a create or update operation
    const isNewService = !editedService.id;
    
    const apiCall = isNewService 
      ? authApi.post('/services', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      : authApi.put(`/services/${editedService.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    
    return apiCall.then((response) => {
      
      if (isNewService) {
        // Add the new service to the list
        const newService = {
          id: response.data.service.id,
          name: editedService.name,
          category: categories.find(c => c.id == editedService.category_id)?.name || '',
          category_id: editedService.category_id,
          visitingCharge: parseFloat(editedService.visiting_charge),
          instantServiceCharge: parseFloat(editedService.instant_visiting_charge),
          description: editedService.description,
          coverImage: response.data.service.cover_image || '',
          serviceLocations: editedService.locations,
          experience: parseInt(editedService.experience || 0),
          providedServices: editedService.specifications,
          workingImages: response.data.service.working_images || [],
          service_type: editedService.service_type,
          city: editedService.city || '',
          state: editedService.state || '',
          country: editedService.country || '',
          badge_status: false
        };
        setServices([newService, ...services]);
      } else {
        // Update existing service
        const updatedServices = services.map((s) =>
          s.id === editedService.id ? {
            ...s,
            name: editedService.name,
            category: categories.find(c => c.id == editedService.category_id)?.name || '',
            category_id: editedService.category_id,
            visitingCharge: parseFloat(editedService.visiting_charge),
            instantServiceCharge: parseFloat(editedService.instant_visiting_charge),
            description: editedService.description,
            serviceLocations: editedService.locations,
            experience: parseInt(editedService.experience || 0),
            providedServices: editedService.specifications,
            service_type: editedService.service_type,
            city: editedService.city || '',
            state: editedService.state || '',
            country: editedService.country || '',
            badge_status: editedService.badge_status || false
          } : s
        );
        setServices(updatedServices);
      }
    });
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-wide text-gray-900">My services</h1>
          <p className="text-sm text-gray-500">What customers can book from you, with your prices.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setServiceToEdit(null);
            setEditModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 h-11 px-4 rounded-sm bg-indigo-500 text-white font-semibold hover:bg-indigo-600"
        >
          <CircleFadingPlus className="h-4 w-4" aria-hidden="true" />
          Add service
        </button>
      </div>

      {categories?.length > 0 && services.length > 0 && (
        <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter by category">
          {[{ id: '', name: 'All' }, ...categories.filter((c) => services.some((s) => String(s.category_id) === String(c.id)))].map((c) => (
            <button
              key={c.id || 'all'}
              type="button"
              role="tab"
              aria-selected={String(filterCategory) === String(c.id)}
              onClick={() => setFilterCategory(c.id)}
              className={`shrink-0 h-9 px-3.5 rounded-sm border text-sm font-medium ${String(filterCategory) === String(c.id) ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      <ul className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredServices.map((service) => (
          <li key={service.id} className="rounded-md border border-gray-200 bg-white p-4">
            <div className="flex gap-3">
              <ServiceImage src={service.coverImage} alt={service.name} category={service.category} className="h-20 w-20 shrink-0 rounded-sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">{service.name}</h3>
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-sm bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" /> Active
                  </span>
                </div>
                <p className="text-sm text-indigo-600">{service.category}</p>
                <p className="mt-1 text-sm text-gray-700">
                  <span className="font-semibold text-gray-900">₹{service.visitingCharge}</span> visit
                  {service.instantServiceCharge ? <> · <span className="font-semibold text-gray-900">₹{service.instantServiceCharge}</span> instant</> : null}
                </p>
                {service.badgeStatus && <p className="text-xs font-semibold text-green-700 mt-0.5">Verified</p>}
              </div>
            </div>
            {service.description && <p className="mt-3 text-sm text-gray-600 line-clamp-2">{service.description}</p>}
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={() => handleEdit(service.id)} className="flex-1 h-10 rounded-sm border border-gray-300 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50">
                Edit
              </button>
              <button type="button" onClick={() => handleDelete(service.id)} className="h-10 px-4 rounded-sm border border-red-200 bg-white text-sm font-semibold text-red-600 hover:bg-red-50">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {filteredServices.length === 0 && (
        <div id="noServices" className="rounded-md border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="font-semibold text-gray-900">{services.length ? 'No services in this category' : 'No services yet'}</p>
          <p className="text-sm text-gray-500">Add a service so customers can book you.</p>
        </div>
      )}

      <ServiceForm
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        service={serviceToEdit}
        onSave={saveEditedService}
        categories={categories}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function ProviderServices() {
  return (
    <ProviderPage>
      <ServiceList />
    </ProviderPage>
  );
}

export default ProviderServices;