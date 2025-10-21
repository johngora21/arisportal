'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Users,
  FileText,
  TrendingUp,
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  Box,
  Wrench,
  Shirt,
  Megaphone,
  Receipt,
  DollarSign,
  BarChart3,
  X,
  XCircle
} from 'lucide-react';
import InventoryService, { InventoryItem, InventoryCategory, InventoryStats, NewInventoryForm } from './models/inventoryService';

export default function InventoryPage() {
  // State
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [categories, setCategories] = useState<InventoryCategory[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showAddItem, setShowAddItem] = useState(false);
  const [showViewItem, setShowViewItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showOutgoings, setShowOutgoings] = useState(false);
  const [outgoingsForm, setOutgoingsForm] = useState({
    itemId: '',
    quantity: '',
    reason: '',
    destination: '',
    notes: ''
  });
  const [outgoingsLoading, setOutgoingsLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [newItemForm, setNewItemForm] = useState<NewInventoryForm>({
    name: '',
    sku: '',
    category: '',
    description: '',
    supplier: '',
    supplierContact: '',
    supplierSocial: '',
    unit: '',
    quantity: '',
    minQuantity: '',
    maxQuantity: '',
    unitPrice: '',
    location: ''
  });

  // Load data from backend
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setDataLoading(true);
    try {
      // Test API config
      InventoryService.testApiConfig();
      
      const [itemsData, categoriesData, statsData] = await Promise.all([
        InventoryService.fetchItems(),
        InventoryService.fetchCategories(),
        InventoryService.getStats()
      ]);
      
      setInventoryItems(itemsData);
      setCategories(categoriesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Filter items
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddItem = async () => {
    setFormLoading(true);
    try {
      // Validate required fields
      if (!newItemForm.name || !newItemForm.sku || !newItemForm.category || !newItemForm.unit) {
        alert('Please fill in all required fields');
        return;
      }

      // Convert numeric fields - use 0 as default for empty values
      const quantity = parseInt(newItemForm.quantity) || 0;
      const minQuantity = parseInt(newItemForm.minQuantity) || 0;
      const maxQuantity = parseInt(newItemForm.maxQuantity) || 0;
      const unitPrice = parseFloat(newItemForm.unitPrice) || 0;

      // Prepare data for API
      const itemData = {
        ...newItemForm,
        quantity: quantity.toString(),
        minQuantity: minQuantity.toString(),
        maxQuantity: maxQuantity.toString(),
        unitPrice: unitPrice.toString()
      };

      if (isEditing && selectedItem) {
        // Update existing item
        const updatedItem = await InventoryService.updateItem(selectedItem.id, itemData);
        setInventoryItems(prev => prev.map(item => 
          item.id === selectedItem.id ? updatedItem : item
        ));
      } else {
        // Create new item
        const newItem = await InventoryService.createItem(itemData);
      setInventoryItems(prev => [...prev, newItem]);
      }

      // Reset form and close modal
      setNewItemForm({
        name: '',
        sku: '',
        category: '',
        description: '',
        supplier: '',
        supplierContact: '',
        supplierSocial: '',
        unit: '',
        quantity: '',
        minQuantity: '',
        maxQuantity: '',
        unitPrice: '',
        location: ''
      });
      setShowAddItem(false);
      setIsEditing(false);
      setSelectedItem(null);
      
      // Reload stats
      const statsData = await InventoryService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item: ' + (error as Error).message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await InventoryService.deleteItem(id);
      setInventoryItems(prev => prev.filter(item => item.id !== id));
        // Reload stats
        const statsData = await InventoryService.getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item: ' + (error as Error).message);
      }
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditing(true);
    setNewItemForm({
      name: item.name,
      sku: item.sku,
      category: item.category,
      description: item.description,
      supplier: item.supplier || '',
      supplierContact: (item as any).supplierContact || '',
      supplierSocial: (item as any).supplierSocial || '',
      unit: item.unit,
      quantity: item.quantity.toString(),
      minQuantity: item.minQuantity.toString(),
      maxQuantity: item.maxQuantity.toString(),
      unitPrice: item.unitPrice.toString(),
      location: item.location
    });
    setShowAddItem(true);
  };

  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowViewItem(true);
  };

  const handleAddCategory = async () => {
    setCategoryLoading(true);
    try {
      const newCategory = await InventoryService.createCategory(
        categoryForm.name,
        categoryForm.description
      );
      setCategories(prev => [...prev, newCategory]);
      setCategoryForm({ name: '', description: '' });
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category: ' + (error as Error).message);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await InventoryService.deleteCategory(id);
        setCategories(prev => prev.filter(c => c.id !== id));
        // Also remove items in this category
        setInventoryItems(prev => prev.filter(item => item.category !== categories.find(c => c.id === id)?.name));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category: ' + (error as Error).message);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_stock': return '#10b981';
      case 'low_stock': return '#f59e0b';
      case 'out_of_stock': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_stock': return <CheckCircle size={16} />;
      case 'low_stock': return <AlertTriangle size={16} />;
      case 'out_of_stock': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      default: return status;
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1f2937', margin: '0 0 8px 0' }}>
              Inventory Management
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Track and manage your inventory items, stock levels, and suppliers
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowCategories(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'white',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <Database size={20} />
              Categories
            </button>
            <button
              onClick={() => setShowAddItem(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                backgroundColor: 'var(--mc-sidebar-bg-hover)',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Plus size={20} />
              Add Item
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Package size={20} color="var(--mc-sidebar-bg)" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Items</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.totalItems}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <DollarSign size={20} color="#10b981" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Total Value</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                ${stats.totalValue.toLocaleString()}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <AlertTriangle size={20} color="#f59e0b" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Low Stock</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.lowStockItems}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <XCircle size={20} color="#ef4444" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Out of Stock</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.outOfStockItems}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <Database size={20} color="#8b5cf6" />
                <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Categories</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                {stats.categories}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div style={{
        position: 'relative',
        height: '40px',
        marginBottom: '24px'
      }}>
        {/* Search Bar - positioned from right */}
        <div style={{ 
          position: 'absolute',
          right: '290px',
          top: '0px',
          width: '400px'
        }}>
          <Search style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            width: '16px',
            height: '20px'
          }} />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '40px',
              paddingRight: '16px',
              paddingTop: '12px',
              paddingBottom: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px'
            }}
          />
        </div>
        
        {/* Status Filter - positioned from right */}
        <div style={{
          position: 'absolute',
          right: '50px',
          top: '0px'
        }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '12px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '20px',
              fontSize: '14px',
              background: 'white',
              width: '180px'
            }}
          >
            <option value="all">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Item</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Category</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Supplier</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>SKU</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Quantity</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Unit Price</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                        {item.name}
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                    {item.category}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                    {item.supplier || 'No supplier'}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                    {item.sku}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                    {item.quantity} {item.unit}
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '6px',
                      color: getStatusColor(item.status),
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {getStatusIcon(item.status)}
                      {getStatusText(item.status)}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditItem(item)}
                        style={{
                          padding: '6px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: '20px',
                          color: '#6b7280'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                          e.currentTarget.style.color = '#374151';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#6b7280';
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleViewItem(item)}
                        style={{
                          padding: '6px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: '20px',
                          color: '#6b7280'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f0f9ff';
                          e.currentTarget.style.color = '#0369a1';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#6b7280';
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        style={{
                          padding: '6px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: '20px',
                          color: '#6b7280'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.color = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#6b7280';
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            width: 'min(600px, 90vw)',
            maxHeight: '90vh',
            borderRadius: '20px',
            padding: '32px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                {isEditing ? 'Edit Inventory Item' : 'Add New Inventory Item'}
              </h2>
              <button
                onClick={() => {
                  setShowAddItem(false);
                  setIsEditing(false);
                  setSelectedItem(null);
                }}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  color: '#6b7280'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={newItemForm.name}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={newItemForm.sku}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, sku: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Category *
                  </label>
                  <select
                    value={newItemForm.category}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, category: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Unit *
                  </label>
                  <input
                    type="text"
                    value={newItemForm.unit}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="e.g., pieces, kg, liters"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Description
                </label>
                <textarea
                  value={newItemForm.description}
                  onChange={(e) => setNewItemForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    value={newItemForm.supplier}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, supplier: e.target.value }))}
                    placeholder="e.g., ABC Suppliers"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newItemForm.supplierContact}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, supplierContact: e.target.value }))}
                    placeholder="e.g., +255 123 456 789"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={newItemForm.location}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, location: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Portfolio
                  </label>
                  <input
                    type="text"
                    value={newItemForm.supplierSocial}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, supplierSocial: e.target.value }))}
                    placeholder="e.g., https://supplier.com, @supplier_company"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Quantity *
                  </label>
                  <input
                    type="text"
                    value={newItemForm.quantity}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, quantity: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Unit Price *
                  </label>
                  <input
                    type="text"
                  value={newItemForm.unitPrice}
                  onChange={(e) => setNewItemForm(prev => ({ ...prev, unitPrice: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Min Quantity
                  </label>
                  <input
                    type="text"
                    value={newItemForm.minQuantity}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, minQuantity: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Max Quantity
                </label>
                <input
                    type="text"
                    value={newItemForm.maxQuantity}
                    onChange={(e) => setNewItemForm(prev => ({ ...prev, maxQuantity: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                  }}
                />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button
                onClick={() => setShowAddItem(false)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                disabled={formLoading || !newItemForm.name || !newItemForm.sku || !newItemForm.category}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'var(--mc-sidebar-bg-hover)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: formLoading ? 'not-allowed' : 'pointer',
                  opacity: formLoading ? 0.6 : 1
                }}
              >
                {formLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Item' : 'Add Item')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Item Modal */}
      {showViewItem && selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            width: 'min(700px, 90vw)',
            maxHeight: '90vh',
            borderRadius: '20px',
            padding: '32px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Item Details
              </h2>
              <button
                onClick={() => {
                  setShowViewItem(false);
                  setSelectedItem(null);
                }}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  color: '#6b7280'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
              {/* Basic Information */}
              <div style={{ display: 'grid', gap: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: 0 }}>
                  Basic Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Item Name
                    </label>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', padding: '12px 0' }}>
                      {selectedItem.name}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      SKU
                    </label>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', padding: '12px 0' }}>
                      {selectedItem.sku}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Category
                    </label>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', padding: '12px 0' }}>
                      {selectedItem.category}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Unit
                    </label>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', padding: '12px 0' }}>
                      {selectedItem.unit}
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                    Description
                  </label>
                  <div style={{ fontSize: '16px', color: '#1f2937', padding: '12px 0', minHeight: '60px' }}>
                    {selectedItem.description || 'No description provided'}
                  </div>
                </div>
              </div>

              {/* Supplier Information */}
              <div style={{ display: 'grid', gap: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: 0 }}>
                  Supplier Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Supplier Name
                    </label>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', padding: '12px 0' }}>
                      {selectedItem.supplier || 'No supplier assigned'}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Location
                    </label>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', padding: '12px 0' }}>
                      {selectedItem.location || 'No location specified'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Phone
                    </label>
                    <div style={{ fontSize: '16px', color: '#1f2937', padding: '12px 0' }}>
                      {(selectedItem as any).supplierContact ? (selectedItem as any).supplierContact.split(' - ')[1] || (selectedItem as any).supplierContact : 'No contact information'}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Portfolio
                    </label>
                    <div style={{ fontSize: '16px', color: '#1f2937', padding: '12px 0', minHeight: '60px' }}>
                      {(selectedItem as any).supplierSocial || 'No portfolio information'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory Details */}
              <div style={{ display: 'grid', gap: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: 0 }}>
                  Inventory Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Current Quantity
                    </label>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', padding: '12px 0' }}>
                      {selectedItem.quantity} {selectedItem.unit}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Unit Price
                    </label>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', padding: '12px 0' }}>
                      ${selectedItem.unitPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Minimum Quantity
                    </label>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', padding: '12px 0' }}>
                      {selectedItem.minQuantity} {selectedItem.unit}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Maximum Quantity
                    </label>
                    <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', padding: '12px 0' }}>
                      {selectedItem.maxQuantity} {selectedItem.unit}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Status
                    </label>
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '500', 
                      padding: '12px 0', 
                      color: getStatusColor(selectedItem.status),
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {getStatusIcon(selectedItem.status)}
                      {getStatusText(selectedItem.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div style={{ display: 'grid', gap: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: 0 }}>
                  Record Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Created At
                    </label>
                    <div style={{ fontSize: '16px', color: '#1f2937', padding: '12px 0' }}>
                      {new Date(selectedItem.createdAt).toLocaleDateString()} at {new Date(selectedItem.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '4px' }}>
                      Last Updated
                    </label>
                    <div style={{ fontSize: '16px', color: '#1f2937', padding: '12px 0' }}>
                      {new Date(selectedItem.lastUpdated).toLocaleDateString()} at {new Date(selectedItem.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Modal */}
      {showCategories && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            width: 'min(600px, 90vw)',
            maxHeight: '90vh',
            borderRadius: '20px',
            padding: '32px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Manage Categories
              </h2>
              <button
                onClick={() => setShowCategories(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  color: '#6b7280'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Add New Category Form */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Add New Category
              </h3>
              <div style={{ display: 'grid', gap: '16px', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Electronics, Furniture"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                    Description
                  </label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    placeholder="Brief description of this category"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '20px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={handleAddCategory}
                    disabled={categoryLoading || !categoryForm.name.trim()}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'var(--mc-sidebar-bg-hover)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: categoryLoading ? 'not-allowed' : 'pointer',
                      opacity: categoryLoading ? 0.6 : 1
                    }}
                  >
                    {categoryLoading ? 'Adding...' : 'Add Category'}
                  </button>
                </div>
              </div>
            </div>

            {/* Categories List */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Existing Categories
              </h3>
              {categories.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '20px',
                  border: '2px dashed #d1d5db'
                }}>
                  <Database size={48} color="#9ca3af" />
                  <p style={{ fontSize: '16px', color: '#6b7280', margin: '16px 0 0 0' }}>
                    No categories found. Add your first category above.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                          {category.name}
                        </h4>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px 0' }}>
                          {category.description || 'No description provided'}
                        </p>
                        <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                          {category.itemCount} item{category.itemCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          style={{
                            padding: '8px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '20px',
                            color: '#ef4444'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fef2f2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}