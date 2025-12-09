import React, { useState } from 'react';
import { X, Store, Plus, Trash2, Edit2, Search } from 'lucide-react';

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
}

const CatalogModal: React.FC<CatalogModalProps> = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Premium Coffee Beans', sku: 'CF-001', price: 18.50, stock: 45 },
    { id: 2, name: 'Ceramic Mug Set', sku: 'MG-002', price: 24.99, stock: 12 },
    { id: 3, name: 'Espresso Machine', sku: 'EM-003', price: 499.00, stock: 3 },
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  if (!isOpen) return null;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    
    const newProduct: Product = {
      id: Date.now(),
      name: newItemName,
      sku: `SKU-${Math.floor(Math.random() * 1000)}`,
      price: parseFloat(newItemPrice),
      stock: 10
    };
    
    setProducts([...products, newProduct]);
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#117aca] text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6" />
            Edit Catalog
          </h3>
          <button onClick={onClose} className="hover:bg-blue-700 p-2 rounded-full transition-colors"><X className="h-6 w-6" /></button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          
          <form onSubmit={handleAddItem} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name</label>
              <input 
                type="text" 
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#117aca] outline-none"
                placeholder="e.g. Gift Card"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Price ($)</label>
              <input 
                type="number" 
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#117aca] outline-none"
                placeholder="0.00"
              />
            </div>
            <button type="submit" className="bg-[#117aca] hover:bg-[#0f6ab0] text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 h-[38px]">
              <Plus className="h-4 w-4" /> Add
            </button>
          </form>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                <th className="py-3 font-semibold">Product</th>
                <th className="py-3 font-semibold">SKU</th>
                <th className="py-3 font-semibold text-right">Price</th>
                <th className="py-3 font-semibold text-center">Stock</th>
                <th className="py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 group">
                  <td className="py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="py-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                  <td className="py-4 text-right font-medium">${product.price.toFixed(2)}</td>
                  <td className="py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="text-gray-400 hover:text-[#117aca] p-1"><Edit2 className="h-4 w-4" /></button>
                       <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CatalogModal;