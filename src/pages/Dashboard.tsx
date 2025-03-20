import React, { useState } from 'react';
import { Users, Car, Building2, AlertTriangle, Plus, Search, ChevronDown } from 'lucide-react';
import { Tree, TreeNode } from 'react-organizational-chart';
import type { Vendor } from '../types/vendor';
import { Dialog } from '@headlessui/react';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';
import { useAuth } from '../contexts/AuthContext';

const stats = [
  { name: 'Total Vendors', value: '24', icon: Building2 },
  { name: 'Active Drivers', value: '156', icon: Users },
  { name: 'Total Vehicles', value: '89', icon: Car },
  { name: 'Pending Approvals', value: '12', icon: AlertTriangle },
];

const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Super Vendor Corp',
    level: 'super',
    email: 'super@vendor.com',
    phone: '+1234567890',
    location: 'National',
    status: 'active',
    createdAt: '2024-03-15',
    permissions: ['all'],
    children: [
      {
        id: '2',
        name: 'Regional Vendor East',
        level: 'regional',
        parentId: '1',
        email: 'east@vendor.com',
        phone: '+1234567891',
        location: 'East Region',
        status: 'active',
        createdAt: '2024-03-15',
        permissions: ['manage_drivers', 'manage_vehicles'],
        children: [
          {
            id: '4',
            name: 'Mumbai City Vendor',
            level: 'city',
            parentId: '2',
            email: 'mumbai@vendor.com',
            phone: '+1234567893',
            location: 'Mumbai',
            status: 'active',
            createdAt: '2024-03-15',
            permissions: ['manage_drivers'],
            children: [],
          },
        ],
      },
      {
        id: '3',
        name: 'Regional Vendor West',
        level: 'regional',
        parentId: '1',
        email: 'west@vendor.com',
        phone: '+1234567892',
        location: 'West Region',
        status: 'active',
        createdAt: '2024-03-15',
        permissions: ['manage_drivers', 'manage_vehicles'],
        children: [],
      },
    ],
  },
];

interface VendorNodeProps {
  vendor: Vendor;
  onEdit?: (vendor: Vendor) => void;
  onAddChild?: (vendor: Vendor) => void;
}

function VendorNode({ vendor, onEdit, onAddChild }: VendorNodeProps) {
  return (
    <div className="relative p-4 bg-white rounded-lg shadow-md border border-gray-200 min-w-[200px]">
      <div className="flex items-center mb-2">
        <div className="h-10 w-10 flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
            <Building2 className="h-5 w-5 text-indigo-600" />
          </div>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-900">{vendor.name}</h3>
          <p className="text-xs text-gray-500">{vendor.level}</p>
        </div>
      </div>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onEdit?.(vendor)}
          className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100"
        >
          Edit
        </button>
        <button
          onClick={() => onAddChild?.(vendor)}
          className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
        >
          Add Sub-vendor
        </button>
      </div>
    </div>
  );
}

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentVendor?: Vendor;
}

function AddVendorModal({ isOpen, onClose, parentVendor }: AddVendorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    level: parentVendor ? 
      (parentVendor.level === 'super' ? 'regional' : 
       parentVendor.level === 'regional' ? 'city' : 'local') : 'super',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
            {parentVendor ? `Add Sub-vendor under ${parentVendor.name}` : 'Add Super Vendor'}
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Level</label>
              <input
                type="text"
                value={formData.level}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Add Vendor
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

function renderVendorTree(
  vendor: Vendor,
  onEdit: (vendor: Vendor) => void,
  onAddChild: (vendor: Vendor) => void
) {
  return (
    <TreeNode
      key={vendor.id}
      label={
        <VendorNode
          vendor={vendor}
          onEdit={onEdit}
          onAddChild={onAddChild}
        />
      }
    >
      {vendor.children?.map((child) =>
        renderVendorTree(child, onEdit, onAddChild)
      )}
    </TreeNode>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>(undefined);

  const handleEditVendor = (vendor: Vendor) => {
    // Handle edit vendor
    console.log('Edit vendor', vendor);
  };

  const handleAddChildVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsAddModalOpen(true);
  };

  const handleAddSuperVendor = () => {
    setSelectedVendor(undefined);
    setIsAddModalOpen(true);
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Welcome, {user?.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your vendor hierarchy and operations from this dashboard
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              type="button"
              onClick={handleAddSuperVendor}
              className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Plus className="-ml-0.5 mr-1.5 h-5 w-5" />
              Add Super Vendor
            </button>
          </div>
        </div>

        <div>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.name}
                className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
              >
                <dt>
                  <div className="absolute rounded-md bg-indigo-500 p-3">
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Vendor Hierarchy</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                View and manage your vendor structure
              </p>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6 overflow-auto" style={{ maxHeight: '600px' }}>
            <div className="flex justify-center">
              {mockVendors.map((vendor) => (
                <Tree
                  key={vendor.id}
                  lineWidth="2px"
                  lineColor="#d1d5db"
                  lineBorderRadius="10px"
                  label={<VendorNode vendor={vendor} onEdit={handleEditVendor} onAddChild={handleAddChildVendor} />}
                >
                  {renderVendorTree(vendor, handleEditVendor, handleAddChildVendor)}
                </Tree>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddVendorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        parentVendor={selectedVendor}
      />
    </AuthenticatedLayout>
  );
}

export default Dashboard;