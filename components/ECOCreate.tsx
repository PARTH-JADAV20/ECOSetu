import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Send } from 'lucide-react';

type Page = any;
type Role = 'Engineer' | 'Approver' | 'Operations' | 'Admin';

interface ECOCreateProps {
  onNavigate: (page: Page) => void;
  productId?: string;
  role: Role;
}

export function ECOCreate({ onNavigate, productId, role }: ECOCreateProps) {
  const [productsList, setProductsList] = useState<any[]>([]);
  const [ecoTitle, setEcoTitle] = useState('');
  const [ecoType, setEcoType] = useState<'Product' | 'BoM'>('Product');
  const [selectedProduct, setSelectedProduct] = useState(productId || '');
  const [selectedBoM, setSelectedBoM] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [versionUpdate, setVersionUpdate] = useState(true);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProductsList(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  const canSubmit = role === 'Engineer' || role === 'Admin';

  const handleSaveDraft = async () => {
    await submitECO('Draft');
  };

  const handleSubmitForApproval = async () => {
    if (!ecoTitle || !selectedProduct) {
      alert('Please fill in all required fields');
      return;
    }
    await submitECO('Pending Approval');
  };

  const submitECO = async (status: string) => {
    setIsLoading(true);
    try {
      // Find the internal DB ID for the selected product
      const product = productsList.find(p => p.productId === selectedProduct || p.id === selectedProduct);

      const response = await fetch('/api/eco', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ecoId: `ECO-${Math.floor(1000 + Math.random() * 9000)}`, // Simple auto-gen
          title: ecoTitle,
          type: ecoType,
          productId: product?.id,
          description,
          effectiveDate,
          status,
          createdBy: 'Current User', // Placeholder
        }),
      });

      if (response.ok) {
        alert(`ECO ${status === 'Draft' ? 'saved' : 'submitted'} successfully`);
        onNavigate({ name: 'eco-list' });
      } else {
        const data = await response.json();
        alert(`Failed to create ECO: ${data.error}`);
      }
    } catch (error) {
      alert('An error occurred while creating the ECO.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate({ name: 'eco-list' })}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to ECOs
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Create Engineering Change Order</h3>
          <p className="text-sm text-slate-600 mt-1">Fill in the details for the new ECO</p>
        </div>

        <div className="p-6 space-y-6">
          {/* ECO Title */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              ECO Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={ecoTitle}
              onChange={(e) => setEcoTitle(e.target.value)}
              placeholder="e.g., Update Motor Housing Material"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ECO Type */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              ECO Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="Product"
                  checked={ecoType === 'Product'}
                  onChange={(e) => setEcoType(e.target.value as 'Product')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-900">Product Change</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="BoM"
                  checked={ecoType === 'BoM'}
                  onChange={(e) => setEcoType(e.target.value as 'BoM')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-900">Bill of Materials Change</span>
              </label>
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Product <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setSelectedBoM('');
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a product...</option>
              {productsList.map((product) => (
                <option key={product.id} value={product.productId}>
                  {product.productId} - {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* BoM Selection - Conditional */}
          {ecoType === 'BoM' && selectedProduct && (
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                Bill of Materials
              </label>
              <select
                value={selectedBoM}
                onChange={(e) => setSelectedBoM(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a BoM...</option>
                {productsList
                  .find(p => p.productId === selectedProduct || p.id === selectedProduct)
                  ?.boms?.map((bom: any) => (
                    <option key={bom.id} value={bom.bomId}>
                      {bom.bomId} - {bom.version}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the changes and rationale..."
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Effective Date */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Effective Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Version Update Checkbox */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={versionUpdate}
                onChange={(e) => setVersionUpdate(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-slate-900">
                Increment version number upon approval
              </span>
            </label>
            <p className="text-xs text-slate-500 mt-1 ml-6">
              This will create a new version of the {ecoType === 'BoM' ? 'BoM' : 'product'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={() => onNavigate({ name: 'eco-list' })}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          {canSubmit && (
            <>
              <button
                onClick={handleSaveDraft}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                onClick={handleSubmitForApproval}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isLoading ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
