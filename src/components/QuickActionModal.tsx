import React, { useState, useEffect } from 'react';
import { useCrm } from '../context/CrmContext.tsx';
import { LeadSource, OrderType, Priority } from '../types.ts';
import { formatCurrency } from '../utils/calculations.ts';
import { X, Plus, CheckCircle2, MessageSquare, Phone, ShoppingBag, CreditCard, Sparkles } from 'lucide-react';

export const QuickActionModal: React.FC = () => {
  const {
    quickAction,
    setQuickAction,
    addLead,
    addOrder,
    addPayment,
    addCustomer,
    checkDuplicateCustomer,
    orders,
    products,
    customers,
    setActiveTab,
  } = useCrm();

  // Lead State
  const [leadName, setLeadName] = useState('');
  const [leadMobile, setLeadMobile] = useState('');
  const [leadSource, setLeadSource] = useState<LeadSource>('Instagram');
  const [productInterest, setProductInterest] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [customizationRequired, setCustomizationRequired] = useState(true);
  const [customNotes, setCustomNotes] = useState('');
  const [expectedBudget, setExpectedBudget] = useState(500);
  const [priority, setPriority] = useState<Priority>('High');

  // Quick Order State
  const [orderCustId, setOrderCustId] = useState('');
  const [orderCustName, setOrderCustName] = useState('');
  const [orderCustMobile, setOrderCustMobile] = useState('');
  const [orderCustAddress, setOrderCustAddress] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('Customized');
  const [orderPriority, setOrderPriority] = useState<Priority>('High');
  const [orderDeliveryDate, setOrderDeliveryDate] = useState(() => {
    return new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  });
  const [orderProductId, setOrderProductId] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [orderUnitPrice, setOrderUnitPrice] = useState(0);
  const [orderCustomCharge, setOrderCustomCharge] = useState(0);
  const [orderCustomText, setOrderCustomText] = useState('');
  const [orderCustomColor, setOrderCustomColor] = useState('');
  const [orderCustomNotes, setOrderCustomNotes] = useState('');
  const [orderAdvanceReceived, setOrderAdvanceReceived] = useState(0);

  // Payment State
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState(1500);
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'Bank Transfer' | 'Cash' | 'Card'>('UPI');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('50% advance payment via UPI');

  // Initialize product & order defaults
  useEffect(() => {
    if (products.length > 0) {
      if (!productInterest) setProductInterest(products[0].name);
      if (!orderProductId) {
        setOrderProductId(products[0].id);
        setOrderUnitPrice(products[0].sellingPrice);
        const tot = products[0].sellingPrice;
        setOrderAdvanceReceived(Math.round(tot * 0.5));
      }
    }
  }, [products]);

  useEffect(() => {
    if (orders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(orders[0].id);
      setPaymentRef(`UPI/HDFC/${Date.now().toString().slice(-6)}`);
    }
  }, [orders]);

  if (!quickAction) return null;

  // Handle selecting existing customer in Quick Order
  const handleSelectOrderCustomer = (cId: string) => {
    setOrderCustId(cId);
    const found = customers.find((c) => c.id === cId);
    if (found) {
      setOrderCustName(found.name);
      setOrderCustMobile(found.mobile);
      setOrderCustAddress(`${found.address.street}, ${found.address.city}, ${found.address.state}`);
    }
  };

  // Handle product change in Quick Order
  const handleOrderProductChange = (pId: string) => {
    setOrderProductId(pId);
    const prod = products.find((p) => p.id === pId);
    if (prod) {
      setOrderUnitPrice(prod.sellingPrice);
      const total = prod.sellingPrice * orderQuantity + orderCustomCharge;
      setOrderAdvanceReceived(Math.round(total * 0.5));
    }
  };

  const orderItemSubtotal = orderUnitPrice * orderQuantity + orderCustomCharge;
  const orderTotalValue = orderItemSubtotal;
  const orderBalanceAmount = Math.max(0, orderTotalValue - orderAdvanceReceived);

  // Handle Quick Lead Submit
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadMobile) {
      alert('Please provide customer name and mobile');
      return;
    }

    addLead({
      date: new Date().toISOString().split('T')[0],
      customerName: leadName,
      mobile: leadMobile,
      whatsapp: leadMobile,
      leadSource,
      productInterest: [productInterest || products[0]?.name || 'Handmade Crafts'],
      quantity: Number(quantity) || 1,
      customizationRequired,
      customizationNotes: customNotes,
      expectedBudget: Number(expectedBudget) || undefined,
      priority,
      status: 'New',
      assignedUser: 'Studio Sales',
      remarks: customNotes,
    });

    setQuickAction(null);
    alert(`Lead for "${leadName}" created successfully!`);
  };

  // Handle Quick Order Submit
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCustName || !orderCustMobile) {
      alert('Please enter customer name and contact number');
      return;
    }

    const selProd = products.find((p) => p.id === orderProductId) || products[0];

    // Check or create customer
    let custId = orderCustId;
    if (!custId) {
      const existing = checkDuplicateCustomer({ mobile: orderCustMobile });
      if (existing) {
        custId = existing.id;
      } else {
        const newCust = addCustomer({
          name: orderCustName,
          mobile: orderCustMobile,
          whatsapp: orderCustMobile,
          address: {
            street: orderCustAddress || 'Craft Studio Pickup',
            city: 'Hyderabad',
            state: 'Telangana',
            pincode: '500001',
          },
          customerType: orderType === 'Bulk' || orderType === 'Corporate' ? 'Corporate' : 'Retail',
          customerSource: 'Direct Customer',
          totalOrders: 1,
          totalPurchaseValue: orderTotalValue,
          outstandingAmount: orderBalanceAmount,
          customerRating: 5,
        });
        custId = newCust.id;
      }
    }

    const hasCustomization =
      orderType === 'Customized' || orderCustomText || orderCustomColor || orderCustomNotes;

    const newOrder = addOrder({
      customerId: custId,
      customerName: orderCustName,
      customerMobile: orderCustMobile,
      customerAddress: orderCustAddress || 'Craft Studio Pickup, Hyderabad',
      orderDate: new Date().toISOString().split('T')[0],
      requiredDeliveryDate: orderDeliveryDate,
      orderType,
      priority: orderPriority,
      items: [
        {
          productId: selProd?.id || 'prod-1',
          productName: selProd?.name || 'Artisan Craft Item',
          sku: selProd?.sku || 'VC-SKU-001',
          quantity: orderQuantity,
          unitPrice: orderUnitPrice,
          customizationDetails: hasCustomization
            ? {
                nameText: orderCustomText || undefined,
                color: orderCustomColor || undefined,
                specialInstructions: orderCustomNotes || undefined,
                approvalStatus: 'Approved',
                approvalDate: new Date().toISOString().split('T')[0],
                version: 1,
              }
            : undefined,
          total: orderTotalValue,
        },
      ],
      totalValue: orderTotalValue,
      advanceRequired: Math.round(orderTotalValue * 0.5),
      advanceReceived: orderAdvanceReceived,
      balanceAmount: orderBalanceAmount,
      paymentStatus:
        orderBalanceAmount <= 0
          ? 'Paid'
          : orderAdvanceReceived > 0
          ? 'Partially Paid'
          : 'Pending',
      productionStatus: 'Production Pending',
      dispatchStatus: 'Not Dispatched',
      orderStatus:
        orderAdvanceReceived > 0 ? 'Production Pending' : 'Advance Pending',
      notes: orderCustomNotes || 'Order created via Quick Action',
    });

    // Auto-record advance payment if provided
    if (orderAdvanceReceived > 0) {
      addPayment({
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        customerId: custId,
        customerName: orderCustName,
        amount: orderAdvanceReceived,
        paymentDate: new Date().toISOString().split('T')[0],
        mode: 'UPI',
        transactionRef: `UPI/VC/${Date.now().toString().slice(-6)}`,
        status: 'Completed',
        notes: `Advance payment for ${newOrder.orderNumber}`,
      });
    }

    setQuickAction(null);
    alert(`Order ${newOrder.orderNumber} created successfully! Total: ₹${orderTotalValue}`);
  };

  // Handle Record Payment Submit
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const order = orders.find((o) => o.id === selectedOrderId);
    if (!order) return;

    addPayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customerName,
      amount: Number(paymentAmount) || 0,
      paymentDate: new Date().toISOString().split('T')[0],
      mode: paymentMode,
      transactionRef: paymentRef || `UTR-${Date.now().toString().slice(-6)}`,
      status: 'Completed',
      notes: paymentNotes,
    });

    setQuickAction(null);
    alert(`Payment of ₹${paymentAmount} recorded for Order ${order.orderNumber}!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-xl w-full p-6 space-y-4 my-8 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            {quickAction === 'newOrder' && <ShoppingBag className="w-5 h-5 text-amber-700" />}
            {quickAction === 'newLead' && <MessageSquare className="w-5 h-5 text-amber-700" />}
            {quickAction === 'newPayment' && <CreditCard className="w-5 h-5 text-emerald-700" />}
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {quickAction === 'newLead' && 'Quick Inbound Lead Capture'}
              {quickAction === 'newPayment' && 'Record Customer Payment'}
              {quickAction === 'newOrder' && 'Create Quick Order & Customization'}
              {quickAction === 'newQuotation' && 'Create Quick Quotation'}
            </h3>
          </div>
          <button onClick={() => setQuickAction(null)} className="p-1 text-stone-400 hover:text-stone-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. QUICK ORDER FORM */}
        {quickAction === 'newOrder' && (
          <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
            {/* Customer Section */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wider">
                  Customer Information
                </span>
                <select
                  value={orderCustId}
                  onChange={(e) => handleSelectOrderCustomer(e.target.value)}
                  className="p-1 bg-white border border-stone-200 rounded text-[11px]"
                >
                  <option value="">+ New Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.mobile})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={orderCustName}
                    onChange={(e) => setOrderCustName(e.target.value)}
                    placeholder="e.g. Pooja Reddy"
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Mobile / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={orderCustMobile}
                    onChange={(e) => setOrderCustMobile(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Delivery Address / City</label>
                <input
                  type="text"
                  value={orderCustAddress}
                  onChange={(e) => setOrderCustAddress(e.target.value)}
                  placeholder="e.g. Banjara Hills, Hyderabad"
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg"
                />
              </div>
            </div>

            {/* Product & Pricing Section */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-stone-900 uppercase text-[10px] tracking-wider">
                Product & Quantities
              </span>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Select Product *</label>
                <select
                  value={orderProductId}
                  onChange={(e) => handleOrderProductChange(e.target.value)}
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg text-xs font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Retail: ₹{p.sellingPrice} | Bulk: ₹{p.bulkPrice}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={orderQuantity}
                    onChange={(e) => {
                      const q = Math.max(1, Number(e.target.value));
                      setOrderQuantity(q);
                      const tot = orderUnitPrice * q + orderCustomCharge;
                      setOrderAdvanceReceived(Math.round(tot * 0.5));
                    }}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg font-mono text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={orderUnitPrice}
                    onChange={(e) => {
                      const rate = Number(e.target.value);
                      setOrderUnitPrice(rate);
                      const tot = rate * orderQuantity + orderCustomCharge;
                      setOrderAdvanceReceived(Math.round(tot * 0.5));
                    }}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Customization Fee</label>
                  <input
                    type="number"
                    value={orderCustomCharge}
                    onChange={(e) => {
                      const fee = Number(e.target.value);
                      setOrderCustomCharge(fee);
                      const tot = orderUnitPrice * orderQuantity + fee;
                      setOrderAdvanceReceived(Math.round(tot * 0.5));
                    }}
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg font-mono text-center"
                  />
                </div>
              </div>
            </div>

            {/* Customization Details */}
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-2">
              <span className="font-bold text-amber-950 uppercase text-[10px] tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Artisan Customization Specifications
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Engraved Name / Text</label>
                  <input
                    type="text"
                    value={orderCustomText}
                    onChange={(e) => setOrderCustomText(e.target.value)}
                    placeholder="e.g. Sibling names, company name"
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 mb-1 font-medium">Color / Inlay Pigment</label>
                  <input
                    type="text"
                    value={orderCustomColor}
                    onChange={(e) => setOrderCustomColor(e.target.value)}
                    placeholder="e.g. Turquoise Ocean with 24K Gold"
                    className="w-full p-2 bg-white border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Artisan Instructions</label>
                <input
                  type="text"
                  value={orderCustomNotes}
                  onChange={(e) => setOrderCustomNotes(e.target.value)}
                  placeholder="e.g. Food safe resin coat, dry flowers carefully..."
                  className="w-full p-2 bg-white border border-stone-200 rounded-lg"
                />
              </div>
            </div>

            {/* Timeline, Order Type & Advance Payment */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Order Type</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value as OrderType)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                >
                  <option value="Customized">Customized</option>
                  <option value="Retail">Retail</option>
                  <option value="Bulk">Bulk / B2B</option>
                  <option value="Corporate">Corporate Gifting</option>
                  <option value="Wholesale">Wholesale</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Priority</label>
                <select
                  value={orderPriority}
                  onChange={(e) => setOrderPriority(e.target.value as Priority)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                >
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 mb-1 font-medium">Required Delivery *</label>
                <input
                  type="date"
                  required
                  value={orderDeliveryDate}
                  onChange={(e) => setOrderDeliveryDate(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Payment Summary Footer */}
            <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-stone-500 text-[11px]">Total Order Value:</span>
                  <div className="font-mono text-base font-bold text-stone-900">
                    {formatCurrency(orderTotalValue)}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-stone-500 text-[11px]">Advance Received (₹):</span>
                  <input
                    type="number"
                    min="0"
                    max={orderTotalValue}
                    value={orderAdvanceReceived}
                    onChange={(e) => setOrderAdvanceReceived(Number(e.target.value))}
                    className="w-28 p-1.5 bg-white border border-stone-300 rounded font-mono font-bold text-right text-emerald-800"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] pt-1 border-t border-stone-200 text-stone-600">
                <span>Remaining Balance on Delivery:</span>
                <strong className={`font-mono ${orderBalanceAmount > 0 ? 'text-amber-900' : 'text-emerald-700'}`}>
                  {formatCurrency(orderBalanceAmount)}
                </strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setQuickAction(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs transition-colors"
              >
                Confirm & Create Order
              </button>
            </div>
          </form>
        )}

        {/* 2. QUICK LEAD FORM */}
        {quickAction === 'newLead' && (
          <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Ananya Roy"
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Mobile / WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={leadMobile}
                  onChange={(e) => setLeadMobile(e.target.value)}
                  placeholder="+91 98..."
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Inquiry Source</label>
                <select
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value as any)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                >
                  <option value="Instagram">Instagram DM / Reel</option>
                  <option value="WhatsApp">Direct WhatsApp</option>
                  <option value="Website">Website Form</option>
                  <option value="Meesho">Meesho Store</option>
                  <option value="Referral">Client Referral</option>
                  <option value="Exhibition">Exhibition / Stall</option>
                </select>
              </div>
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                >
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1 font-medium">Product of Interest</label>
              <select
                value={productInterest}
                onChange={(e) => setProductInterest(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} (₹{p.sellingPrice})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Estimated Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Budget Target (₹)</label>
                <input
                  type="number"
                  value={expectedBudget}
                  onChange={(e) => setExpectedBudget(Number(e.target.value))}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1 font-medium">Customization & Notes</label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Names to engrave, flower colors, deadline details..."
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setQuickAction(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs"
              >
                Save Lead
              </button>
            </div>
          </form>
        )}

        {/* 3. RECORD PAYMENT FORM */}
        {quickAction === 'newPayment' && (
          <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
            <div>
              <label className="block text-stone-600 mb-1 font-medium">Link to Active Order</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} - {o.customerName} (Bal: ₹{o.balanceAmount})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Amount Received (₹) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1 font-medium">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
                >
                  <option value="UPI">UPI (PhonePe / GPay / Paytm)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Cash">Cash at Studio</option>
                  <option value="Card">Card / POS</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-stone-600 mb-1 font-medium">Transaction UTR / Reference</label>
              <input
                type="text"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="UTR / Reference Number"
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block text-stone-600 mb-1 font-medium">Notes</label>
              <input
                type="text"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder="e.g. 50% advance for customized order"
                className="w-full p-2 bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setQuickAction(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs"
              >
                Record Payment
              </button>
            </div>
          </form>
        )}

        {/* 4. QUICK QUOTATION ACTION */}
        {quickAction === 'newQuotation' && (
          <div className="text-center py-6 space-y-4">
            <p className="text-xs text-stone-600">
              Opening the full Quotation Builder to allow customized line items, GST taxation, and branded PDF generation.
            </p>
            <button
              onClick={() => {
                setQuickAction(null);
                setActiveTab('quotations');
              }}
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs"
            >
              Go to Quotations Builder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
