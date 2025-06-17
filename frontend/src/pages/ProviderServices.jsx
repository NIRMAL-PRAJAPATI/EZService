import { useState, useEffect, use } from 'react';
import {
  List,
  CircleFadingPlus,
  Filter,
  Edit2,
  Trash,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import DashboardHeader from '../components/provider/Header';

import authApi from '../config/auth-config';
import api from "../config/axios-config"

function ServiceRow({ service, onEdit, onDelete }) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{service.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
          {service.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ₹{service.visitingCharge?.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ₹{service.instantServiceCharge?.toFixed(2)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <div className="w-[300px]">{service.description}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <div className="min-w-[300px]">{service.coverImage}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <ul className="w-[200px]">
          {service.serviceLocations.map((location, index) => (
            <li key={index}>{location}</li>
          ))}
        </ul>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <div>{service.experience}</div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <ul className="w-[300px]">
          {service.providedServices.map((providedService, index) => (
            <li key={index}>{providedService}</li>
          ))}
        </ul>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        <ul className="min-w-[300px]">
          {service.workingImages.map((image, index) => (
            <li key={index}>{image}</li>
          ))}
        </ul>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
        <button
          onClick={() => onEdit(service.id)}
          className="text-primary hover:text-primary-900 mr-3 flex items-center"
        >
          <Edit2 className="w-4 h-4 mr-1" /> Edit
        </button>
        <button
          onClick={() => onDelete(service.id)}
          className="text-red-600 hover:text-red-900 flex items-center"
        >
          <Trash className="w-4 h-4 mr-1" /> Delete
        </button>
      </td>
    </tr>
  );
}

function EditServiceModal({ isOpen, onClose, service, onSave, categories }) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [visitingCharge, setVisitingCharge] = useState(0);
  const [instantVisitingCharge, setInstantVisitingCharge] = useState(0);
  const [locations, setLocations] = useState('');
  const [experience, setExperience] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [workingImages, setWorkingImages] = useState([]);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [serviceType, setServiceType] = useState('HOME');

  useEffect(() => {
    if (service) {
      console.log(service)
      setName(service.name || '');
      setCategoryId(service.category_id || '');
      setVisitingCharge(service.visiting_charge || 0);
      setInstantVisitingCharge(service.instant_visiting_charge || 0);
      setLocations(service.serviceLocations?.join(', ') || '');
      setExperience(service.experience || '');
      setSpecifications(service.providedServices?.join(', ') || '');
      setDescription(service.description || '');
      setServiceType(service.service_type || 'HOME');
      setWorkingImages([]);
      setCoverImage(null);
    }
  }, [service, isOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      id: service?.id,
      name,
      category_id: categoryId,
      visiting_charge: parseFloat(visitingCharge),
      instant_visiting_charge: parseFloat(instantVisitingCharge),
      locations: locations.split(',').map((loc) => loc.trim()),
      experience,
      specifications: specifications.split(',').map((s) => s.trim()),
      working_images: workingImages,
      cover_image: coverImage,
      description,
      service_type: serviceType,
    });
    onClose();
  };

  const handleImageChange = (e) => {
    setWorkingImages([...e.target.files]);
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Edit2 className="w-5 h-5 mr-2 text-primary" />
            <h3 className="text-xl font-semibold">
              {service ? 'Edit Service' : 'Add New Service'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Service Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full border px-3 py-2 rounded">
                <option value="">Select Category</option>
                {categories?.map((cat) => {
                  if(categoryId == cat.id)
                    return <option key={cat.id} value={cat.id} selected={true}>{cat.name}</option>  
                  else
                    return <option key={cat.id} value={cat.id}>{cat.name}</option>
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Visiting Charge (₹)</label>
              <input type="number" value={visitingCharge} onChange={(e) => setVisitingCharge(e.target.value)} min="0" required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Instant Visiting Charge (₹)</label>
              <input type="number" value={instantVisitingCharge} onChange={(e) => setInstantVisitingCharge(e.target.value)} min="0" required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Locations (comma-separated)</label>
              <input type="text" value={locations} onChange={(e) => setLocations(e.target.value)} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Experience (Years)</label>
              <select value={experience} onChange={(e) => setExperience(e.target.value)} required className="w-full border px-3 py-2 rounded">
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
                <option value="10">10</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Specifications (comma-separated)</label>
              <input type="text" value={specifications} onChange={(e) => setSpecifications(e.target.value)} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Service Type</label>
              <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} required className="w-full border px-3 py-2 rounded">
                <option value="HOME">HOME</option>
                <option value="INSTANT">INSTANT</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Cover Image</label>
              <input type="file" accept="image/*" onChange={handleCoverImageChange} className="w-full border px-3 py-2 rounded" />
              {coverImage && (
                <div className="mt-2 text-sm text-gray-700">{coverImage.name}</div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Working Images</label>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full border px-3 py-2 rounded" />
              <div className="mt-2">
                {workingImages.length > 0 && Array.from(workingImages).map((file, idx) => (
                  <span key={idx} className="inline-block bg-gray-200 text-xs px-2 py-1 rounded mr-2">{file.name}</span>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" required className="w-full border px-3 py-2 rounded"></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
              <X className="w-4 h-4 mr-1 inline" /> Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
              <Check className="w-4 h-4 mr-1 inline" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
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

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    authApi.get('/provider/services').then((response) => {
      const servicesData = response.data.map((service) => ({
        id: service.id,
        name: service.name,
        category: service.category.name,
        categoryId: service.category_id,
        visitingCharge: parseFloat(service.visiting_charge || 0),
        instantServiceCharge: parseFloat(service.instant_visiting_charge || 0),
        description: service.description,
        coverImage: service.cover_image,
        serviceLocations: service.locations,
        experience: service.experience,
        providedServices: service.providedServices || [],
        workingImages: service.working_images,
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
    filterCategory === '' || service.category === filterCategory
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
    const updatedServices = services.filter((s) => s.id !== serviceToDeleteId);
    setServices(updatedServices);
    setDeleteModalOpen(false);
    setServiceToDeleteId(null);
  };

  const saveEditedService = (editedService) => {
    console.log(editedService)
    authApi.put(`/services/${editedService.id}`, {
      name: editedService.name,
      category_id: editedService.category,
      visiting_charge: editedService.visitingCharge,
      instant_visiting_charge: editedService.instantServiceCharge,
      description: editedService.description,
      cover_image: editedService.coverImage,
      locations: editedService.serviceLocations,
      experience: parseInt(editedService.experience || 0),
      providedServices: editedService.providedServices,
      working_images: editedService.workingImages,
      locations: editedService.locations || [],
      specifications: editedService.specifications || [],
      badge_status: editedService.badgeStatus || [],
      state: editedService.state || "",
      country: editedService.country || ""
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then((response) => {
      console.log('Service updated successfully:', response.data);
    }).catch((error) => {
      console.error('Error updating service:', error);
    });
    setEditModalOpen(false);

    const updatedServices = services.map((s) =>
      s.id === editedService.id ? editedService : s
    );
    setServices(updatedServices);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-2 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="items-center hidden sm:flex">
          <List className="w-6 h-6 mr-2 text-primary" />
          <h2 className="text-1xl md:text-2xl font-semibold">
            Registered Services
          </h2>
        </div>
        <div className="flex space-x-2">
          <a
            href="/add_service" // Replace with your actual add service route
            className="flex bg-primary text-white px-3 py-2 rounded whitespace-nowrap"
          >
            <CircleFadingPlus className="h-4 w-4 mt-1 mr-1" />
            Add Service
          </a>
          <div className="relative">
            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              id="filterCategory"
              className="pl-8 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories?.map((category)=>{
                return <option value={category.id}>{category.name}</option>
              })}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-scroll">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                VISITING CHARGE(₹)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                INSTANT SERVICE CHARGE(₹)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                DESCRIPTION
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                COVER IMAGE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SERVICE LOCATIONS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                EXPERIENCE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PROVIDED SERVICES
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                WORKING IMAGES
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody id="servicesList" className="bg-white divide-y divide-gray-200">
            {filteredServices.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
      {filteredServices.length === 0 && (
        <div id="noServices" className="text-center py-4 text-gray-500">
          No services found. Add a service to get started.
        </div>
      )}

      <EditServiceModal
        isOpen={editModalOpen}
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
    <>
    <DashboardHeader />
    <main className=' mx-auto py-4 px-3 sm:px-6 lg:px-8 pt-20 z-0 overflow-x-scroll'>
      <ServiceList />
    </main>
    
    </>
  );
}

export default ProviderServices;