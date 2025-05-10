import { useState, useEffect } from 'react';
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

const dummyServices = [
  {
    id: 'dummy1',
    name: 'Deep House Cleaning',
    category: 'Cleaning',
    visitingCharge: 20,
    instantServiceCharge: 120.00,
    description:
      'Complete cleaning of your home including kitchen, bathrooms, bedrooms, and living areas. Includes dusting, vacuuming, mopping, and sanitizing surfaces.',
    coverImage:
      'https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg',
    serviceLocations: ['Naroda, ahmedaba, india', 'Narol', 'Nikol', 'memnagar'],
    experience: '3+ Year Experiance',
    providedServices: [
      'Pipe Repairs & Replacements',
      'Leak Detection & Fixing',
      'Water Heater Installation',
      'Drain Cleaning & Unclogging',
      'Bathroom & Kitchen Plumbing',
    ],
    workingImages: [
      'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg',
      'https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg',
    ],
  },
  {
    id: 'dummy2',
    name: 'Plumbing Repair',
    category: 'Repair',
    visitingCharge: 15,
    instantServiceCharge: 85.00,
    description:
      'Professional plumbing repair service for leaky faucets, clogged drains, toilet issues, and other common plumbing problems.',
    coverImage:
      'https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg',
    serviceLocations: ['Naroda, ahmedaba, india', 'Narol'],
    experience: '5+ Year Experiance',
    providedServices: ['Leak Detection & Fixing', 'Toilet Repairs'],
    workingImages: [
      'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg',
    ],
  },
  {
    id: 'dummy3',
    name: 'Smart Home Installation',
    category: 'Installation',
    visitingCharge: 30,
    instantServiceCharge: 150.00,
    description:
      'Installation and setup of smart home devices including thermostats, security cameras, smart locks, and voice assistants.',
    coverImage:
      'https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg',
    serviceLocations: ['Nikol', 'memnagar'],
    experience: '1+ Year Experiance',
    providedServices: ['Smart Locks', 'Security Cameras', 'Thermostats'],
    workingImages: [
      'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg',
      'https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg',
    ],
  },
  {
    id: 'dummy4',
    name: 'HVAC Maintenance',
    category: 'Maintenance',
    visitingCharge: 25,
    instantServiceCharge: 95.00,
    description:
      'Regular maintenance for your heating, ventilation, and air conditioning systems to ensure optimal performance and energy efficiency.',
    coverImage:
      'https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg',
    serviceLocations: ['Naroda, ahmedaba, india'],
    experience: '10+ Year Experiance',
    providedServices: ['System Checkup', 'Filter Replacement'],
    workingImages: [
      'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg',
    ],
  },
  {
    id: 'dummy5',
    name: 'Interior Design Consultation',
    category: 'Consultation',
    visitingCharge: 50,
    instantServiceCharge: 200.00,
    description:
      'Professional interior design consultation to help you transform your space with expert advice on layout, color schemes, furniture, and decor.',
    coverImage:
      'https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg',
    serviceLocations: ['Narol', 'memnagar'],
    experience: '5+ Year Experiance',
    providedServices: ['Space Planning', 'Color Scheme Advice', 'Furniture Selection'],
    workingImages: [
      'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg',
      'https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg',
    ],
  },
];

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
        ₹{service.visitingCharge.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        ₹{service.instantServiceCharge.toFixed(2)}
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

function EditServiceModal({ isOpen, onClose, service, onSave }) {
  const [editServiceName, setEditServiceName] = useState(service?.name || '');
  const [editServiceCategory, setEditServiceCategory] = useState(
    service?.category || ''
  );
  const [editServiceVisitingCharge, setEditServiceVisitingCharge] = useState(
    service?.visitingCharge || 0
  );
  const [editServiceInstantCharge, setEditServiceInstantCharge] = useState(
    service?.instantServiceCharge || 0
  );
  const [editServiceLocations, setEditServiceLocations] = useState(
    service?.serviceLocations?.join(', ') || ''
  );
  const [editServiceExperience, setEditServiceExperience] = useState(
    service?.experience || ''
  );
  const [editProvidedServices, setEditProvidedServices] = useState(
    service?.providedServices?.join(', ') || ''
  );
  const [editWorkingImages, setEditWorkingImages] = useState([]);
  const [editServiceDescription, setEditServiceDescription] = useState(
    service?.description || ''
  );

  useEffect(() => {
    if (service) {
      setEditServiceName(service.name || '');
      setEditServiceCategory(service.category || '');
      setEditServiceVisitingCharge(service.visitingCharge || 0);
      setEditServiceInstantCharge(service.instantServiceCharge || 0);
      setEditServiceLocations(service.serviceLocations?.join(', ') || '');
      setEditServiceExperience(service.experience || '');
      setEditProvidedServices(service.providedServices?.join(', ') || '');
      setEditServiceDescription(service.description || '');
      setEditWorkingImages([]); // Reset images on open
    } else {
      setEditServiceName('');
      setEditServiceCategory('');
      setEditServiceVisitingCharge(0);
      setEditServiceInstantCharge(0);
      setEditServiceLocations('');
      setEditServiceExperience('');
      setEditProvidedServices('');
      setEditServiceDescription('');
      setEditWorkingImages([]);
    }
  }, [service, isOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      id: service?.id,
      name: editServiceName,
      category: editServiceCategory,
      visitingCharge: parseFloat(editServiceVisitingCharge),
      instantServiceCharge: parseFloat(editServiceInstantCharge),
      serviceLocations: editServiceLocations
        .split(',')
        .map((loc) => loc.trim()),
      experience: editServiceExperience,
      providedServices: editProvidedServices
        .split(',')
        .map((ps) => ps.trim()),
      workingImages: editWorkingImages,
      description: editServiceDescription,
    });
    onClose();
  };

  const handleImageChange = (e) => {
    setEditWorkingImages([...e.target.files]);
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
        <form id="editServiceForm" onSubmit={handleSave}>
          <input type="hidden" id="editServiceId" value={service?.id || ''} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label
                htmlFor="editServiceName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Name
              </label>
              <input
                type="text"
                id="editServiceName"
                name="editServiceName"
                value={editServiceName}
                onChange={(e) => setEditServiceName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="editServiceCategory"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="editServiceCategory"
                name="editServiceCategory"
                value={editServiceCategory}
                onChange={(e) => setEditServiceCategory(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select a category</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Repair">Repair</option>
                <option value="Installation">Installation</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Consultation">Consultation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="editServiceVisitingCharge"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Visiting Charge (₹)
              </label>
              <input
                type="number"
                id="editServiceVisitingCharge"
                name="editServiceVisitingCharge"
                value={editServiceVisitingCharge}
                onChange={(e) => setEditServiceVisitingCharge(e.target.value)}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="editServiceInstantCharge"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Instant Service Charge (₹)
              </label>
              <input
                type="number"
                id="editServiceInstantCharge"
                name="editServiceInstantCharge"
                value={editServiceInstantCharge}
                onChange={(e) => setEditServiceInstantCharge(e.target.value)}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="editServiceLocations"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Locations
              </label>
              <input
                type="text"
                id="editServiceLocations"
                name="editServiceLocations"
                value={editServiceLocations}
                onChange={(e) => setEditServiceLocations(e.target.value)}
                required

                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="experiance"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Experience Years
              </label>
              <select
                id="experiance"
                name="experiance"
                value={editServiceExperience}
                onChange={(e) => setEditServiceExperience(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select Year</option>
                <option value="1+ Year Experiance">1+ Year Experiance</option>
                <option value="3+ Year Experiance">3+ Year Experiance</option>
                <option value="5+ Year Experiance">5+ Year Experiance</option>
                <option value="10+ Year Experiance">10+ Year Experiance</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="editProvidedServices"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Provided Services
              </label>
              <input
                type="text"
                id="editProvidedServices"
                name="editProvidedServices"
                value={editProvidedServices}
                onChange={(e) => setEditProvidedServices(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="editWorkingImages"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Working Images
              </label>
              <input
                type="file"
                id="editWorkingImages"
                name="editWorkingImages"
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {editWorkingImages.length > 0 && (
                <div className="mt-2">
                  {Array.from(editWorkingImages).map((file, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2"
                    >
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
              {service?.workingImages && service.workingImages.length > 0 && (
                <div className="mt-2">
                  {service.workingImages.map((url, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2"
                    >
                      {url.split('/').pop()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="editServiceDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="editServiceDescription"
                name="editServiceDescription"
                rows="3"
                value={editServiceDescription}
                onChange={(e) => setEditServiceDescription(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-2"
            >
              <Check className="w-4 h-4 mr-2" />
              Save Changes
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
  const [services, setServices] = useState(() => {
    const storedServices = localStorage.getItem('services');
    return storedServices ? JSON.parse(storedServices) : dummyServices;
  });
  const [filterCategory, setFilterCategory] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState(null);
  const [serviceToDeleteId, setServiceToDeleteId] = useState(null);

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

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
              <option value="Cleaning">Cleaning</option>
              <option value="Repair">Repair</option>
              <option value="Installation">Installation</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Consultation">Consultation</option>
              <option value="Other">Other</option>
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