import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Customer,
  CompanySettings,
  DispatchRecord,
  FollowUp,
  InventoryItem,
  Invoice,
  Lead,
  Order,
  Payment,
  Product,
  ProductionRecord,
  Quotation,
  UserRole,
} from '../types.ts';
import {
  initialCustomers,
  initialDispatches,
  initialFollowUps,
  initialInventory,
  initialInvoices,
  initialLeads,
  initialOrders,
  initialPayments,
  initialProducts,
  initialProduction,
  initialQuotations,
  initialSettings,
} from '../data/mockData.ts';

interface CrmContextType {
  settings: CompanySettings;
  updateSettings: (newSettings: Partial<CompanySettings>) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'leadNumber' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'customerNumber' | 'createdAt' | 'lifetimeValue'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  checkDuplicateCustomer: (check: { mobile?: string; whatsapp?: string; email?: string; company?: string }) => Customer | null;

  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  quotations: Quotation[];
  addQuotation: (quotation: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt'>) => Quotation;
  updateQuotation: (id: string, updates: Partial<Quotation>) => void;
  convertQuotationToOrder: (quotationId: string) => Order | null;

  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  updateOrderStatus: (id: string, status: Order['orderStatus']) => void;

  production: ProductionRecord[];
  updateProductionRecord: (id: string, updates: Partial<ProductionRecord>) => void;

  inventory: InventoryItem[];
  updateInventoryStock: (id: string, newStock: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => InventoryItem;

  payments: Payment[];
  addPayment: (payment: Omit<Payment, 'id' | 'receiptNumber'>) => Payment;

  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => Invoice;

  dispatches: DispatchRecord[];
  updateDispatch: (id: string, updates: Partial<DispatchRecord>) => void;

  followUps: FollowUp[];
  addFollowUp: (followUp: Omit<FollowUp, 'id'>) => FollowUp;
  completeFollowUp: (id: string) => void;

  // Active view & navigation
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  selectedQuotationId: string | null;
  setSelectedQuotationId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;

  // Quick Action Dialogs
  quickAction: 'newLead' | 'newQuotation' | 'newOrder' | 'newPayment' | 'newFollowUp' | null;
  setQuickAction: (action: 'newLead' | 'newQuotation' | 'newOrder' | 'newPayment' | 'newFollowUp' | null) => void;
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem('vartu_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('Owner/Admin');

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('vartu_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('vartu_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vartu_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('vartu_quotations');
    return saved ? JSON.parse(saved) : initialQuotations;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('vartu_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [production, setProduction] = useState<ProductionRecord[]>(() => {
    const saved = localStorage.getItem('vartu_production');
    return saved ? JSON.parse(saved) : initialProduction;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('vartu_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('vartu_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('vartu_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [dispatches, setDispatches] = useState<DispatchRecord[]>(() => {
    const saved = localStorage.getItem('vartu_dispatches');
    return saved ? JSON.parse(saved) : initialDispatches;
  });

  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem('vartu_followups');
    return saved ? JSON.parse(saved) : initialFollowUps;
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedQuotationId, setSelectedQuotationId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [quickAction, setQuickAction] = useState<'newLead' | 'newQuotation' | 'newOrder' | 'newPayment' | 'newFollowUp' | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vartu_settings', JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem('vartu_leads', JSON.stringify(leads));
  }, [leads]);
  useEffect(() => {
    localStorage.setItem('vartu_customers', JSON.stringify(customers));
  }, [customers]);
  useEffect(() => {
    localStorage.setItem('vartu_products', JSON.stringify(products));
  }, [products]);
  useEffect(() => {
    localStorage.setItem('vartu_quotations', JSON.stringify(quotations));
  }, [quotations]);
  useEffect(() => {
    localStorage.setItem('vartu_orders', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem('vartu_production', JSON.stringify(production));
  }, [production]);
  useEffect(() => {
    localStorage.setItem('vartu_inventory', JSON.stringify(inventory));
  }, [inventory]);
  useEffect(() => {
    localStorage.setItem('vartu_payments', JSON.stringify(payments));
  }, [payments]);
  useEffect(() => {
    localStorage.setItem('vartu_invoices', JSON.stringify(invoices));
  }, [invoices]);
  useEffect(() => {
    localStorage.setItem('vartu_dispatches', JSON.stringify(dispatches));
  }, [dispatches]);
  useEffect(() => {
    localStorage.setItem('vartu_followups', JSON.stringify(followUps));
  }, [followUps]);

  const updateSettings = (newSettings: Partial<CompanySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const checkDuplicateCustomer = (check: { mobile?: string; whatsapp?: string; email?: string; company?: string }) => {
    return (
      customers.find((c) => {
        if (check.mobile && c.mobile && c.mobile.replace(/\D/g, '') === check.mobile.replace(/\D/g, '')) return true;
        if (check.whatsapp && c.whatsapp && c.whatsapp.replace(/\D/g, '') === check.whatsapp.replace(/\D/g, '')) return true;
        if (check.email && c.email && c.email.toLowerCase().trim() === check.email.toLowerCase().trim()) return true;
        if (check.company && c.company && c.company.toLowerCase().trim() === check.company.toLowerCase().trim()) return true;
        return false;
      }) || null
    );
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'leadNumber' | 'createdAt' | 'updatedAt'>) => {
    const nextSeq = leads.length + 1;
    const leadNumber = `VC-LD-2026-${String(nextSeq).padStart(3, '0')}`;
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      leadNumber,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [newLead, ...prev]);

    // Check duplicate or auto-link customer
    const existingCust = checkDuplicateCustomer({
      mobile: newLead.mobile,
      whatsapp: newLead.whatsapp,
      email: newLead.email,
    });
    if (!existingCust && newLead.customerName) {
      // Auto-create or keep ready
    }

    return newLead;
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : lead))
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const addCustomer = (custData: Omit<Customer, 'id' | 'customerNumber' | 'createdAt' | 'lifetimeValue'>) => {
    const nextSeq = customers.length + 1;
    const customerNumber = `VC-CUST-${String(nextSeq).padStart(4, '0')}`;
    const newCustomer: Customer = {
      ...custData,
      id: `cust-${Date.now()}`,
      customerNumber,
      lifetimeValue: custData.totalPurchaseValue || 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, lifetimeValue: updates.totalPurchaseValue ?? c.totalPurchaseValue } : c))
    );
  };

  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addQuotation = (qtData: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt'>) => {
    const nextSeq = quotations.length + 1;
    const quotationNumber = `${settings.quotationPrefix}${String(nextSeq).padStart(4, '0')}`;
    const newQt: Quotation = {
      ...qtData,
      id: `qt-${Date.now()}`,
      quotationNumber,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setQuotations((prev) => [newQt, ...prev]);
    return newQt;
  };

  const updateQuotation = (id: string, updates: Partial<Quotation>) => {
    setQuotations((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const convertQuotationToOrder = (quotationId: string): Order | null => {
    const qt = quotations.find((q) => q.id === quotationId);
    if (!qt) return null;

    // Check customer
    let cust = customers.find((c) => c.id === qt.customerId);
    if (!cust) {
      cust = addCustomer({
        name: qt.customerName,
        mobile: qt.customerMobile,
        whatsapp: qt.customerMobile,
        email: qt.customerEmail,
        address: { street: qt.customerAddress, city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
        customerType: 'Retail',
        customerSource: 'Quotation',
        totalOrders: 1,
        totalPurchaseValue: qt.grandTotal,
        outstandingAmount: qt.balanceAmount,
        customerRating: 5,
      });
    } else {
      updateCustomer(cust.id, {
        totalOrders: (cust.totalOrders || 0) + 1,
        totalPurchaseValue: (cust.totalPurchaseValue || 0) + qt.grandTotal,
        outstandingAmount: (cust.outstandingAmount || 0) + qt.balanceAmount,
        lastOrderDate: new Date().toISOString().split('T')[0],
      });
    }

    const nextSeq = orders.length + 1;
    const orderNumber = `${settings.orderPrefix}${String(nextSeq).padStart(4, '0')}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerId: cust.id,
      customerName: qt.customerName,
      customerMobile: qt.customerMobile,
      customerEmail: qt.customerEmail,
      customerAddress: qt.customerAddress,
      quotationId: qt.id,
      orderDate: new Date().toISOString().split('T')[0],
      requiredDeliveryDate: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      orderType: qt.items.length > 20 ? 'Bulk' : 'Customized',
      priority: 'High',
      items: qt.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        customizationDetails: item.customizationNotes
          ? {
              specialInstructions: item.customizationNotes,
              approvalStatus: 'Approved',
              approvalDate: new Date().toISOString().split('T')[0],
              version: 1,
            }
          : undefined,
        total: item.itemTotal,
      })),
      totalValue: qt.grandTotal,
      advanceRequired: qt.advanceRequired,
      advanceReceived: 0,
      balanceAmount: qt.grandTotal,
      paymentStatus: 'Pending',
      productionStatus: 'Production Pending',
      dispatchStatus: 'Not Dispatched',
      orderStatus: 'Order Confirmed',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Create production records
    for (const item of newOrder.items) {
      const prodRecord: ProductionRecord = {
        id: `prod-rec-${Date.now()}-${Math.random()}`,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        productName: item.productName,
        sku: item.sku,
        requiredQty: item.quantity,
        producedQty: 0,
        rejectedQty: 0,
        balanceQty: item.quantity,
        startDate: new Date().toISOString().split('T')[0],
        expectedCompletionDate: newOrder.requiredDeliveryDate,
        status: 'Pending',
        controller: 'Studio Lead',
      };
      setProduction((prev) => [...prev, prodRecord]);
    }

    // Mark quotation as Accepted
    updateQuotation(quotationId, { status: 'Accepted' });

    return newOrder;
  };

  const addOrder = (ordData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    const nextSeq = orders.length + 1;
    const orderNumber = `${settings.orderPrefix}${String(nextSeq).padStart(4, '0')}`;
    const newOrd: Order = {
      ...ordData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setOrders((prev) => [newOrd, ...prev]);

    // Auto add production records
    for (const item of newOrd.items) {
      const prodRecord: ProductionRecord = {
        id: `prod-rec-${Date.now()}-${Math.random()}`,
        orderId: newOrd.id,
        orderNumber: newOrd.orderNumber,
        productName: item.productName,
        sku: item.sku,
        requiredQty: item.quantity,
        producedQty: 0,
        rejectedQty: 0,
        balanceQty: item.quantity,
        expectedCompletionDate: newOrd.requiredDeliveryDate,
        status: 'Pending',
        controller: 'Studio Lead',
      };
      setProduction((prev) => [...prev, prodRecord]);
    }

    return newOrd;
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const updateOrderStatus = (id: string, status: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const updates: Partial<Order> = { orderStatus: status };
        if (status === 'Dispatched') {
          updates.dispatchStatus = 'Dispatched';
        } else if (status === 'Delivered') {
          updates.dispatchStatus = 'Delivered';
          updates.productionStatus = 'Completed';
        } else if (status === 'Payment Received') {
          updates.paymentStatus = 'Paid';
        }
        return { ...o, ...updates };
      })
    );
  };

  const updateProductionRecord = (id: string, updates: Partial<ProductionRecord>) => {
    setProduction((prev) =>
      prev.map((rec) => {
        if (rec.id !== id) return rec;
        const produced = updates.producedQty ?? rec.producedQty;
        const rejected = updates.rejectedQty ?? rec.rejectedQty;
        const balance = Math.max(0, rec.requiredQty - (produced + rejected));
        return { ...rec, ...updates, balanceQty: balance };
      })
    );
  };

  const updateInventoryStock = (id: string, newStock: number) => {
    setInventory((prev) => prev.map((item) => (item.id === id ? { ...item, currentStock: newStock } : item)));
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
    };
    setInventory((prev) => [...prev, newItem]);
    return newItem;
  };

  const addPayment = (paymentData: Omit<Payment, 'id' | 'receiptNumber'>) => {
    const nextSeq = payments.length + 1;
    const receiptNumber = `VC-RCT-2026-${String(nextSeq).padStart(3, '0')}`;
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      receiptNumber,
    };
    setPayments((prev) => [newPayment, ...prev]);

    // Update order received & balance
    if (paymentData.orderId) {
      const order = orders.find((o) => o.id === paymentData.orderId);
      if (order) {
        const totalPaid = (order.advanceReceived || 0) + paymentData.amount;
        const balance = Math.max(0, order.totalValue - totalPaid);
        const paymentStatus = balance <= 0 ? 'Paid' : 'Partially Paid';
        updateOrder(order.id, {
          advanceReceived: totalPaid,
          balanceAmount: balance,
          paymentStatus,
        });
      }
    }

    return newPayment;
  };

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
    const nextSeq = invoices.length + 1;
    const invoiceNumber = `${settings.invoicePrefix}${String(nextSeq).padStart(4, '0')}`;
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `invc-${Date.now()}`,
      invoiceNumber,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  const updateDispatch = (id: string, updates: Partial<DispatchRecord>) => {
    setDispatches((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const addFollowUp = (followUpData: Omit<FollowUp, 'id'>) => {
    const newFollowUp: FollowUp = {
      ...followUpData,
      id: `flw-${Date.now()}`,
    };
    setFollowUps((prev) => [newFollowUp, ...prev]);
    return newFollowUp;
  };

  const completeFollowUp = (id: string) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'Completed', completedAt: new Date().toISOString() } : f))
    );
  };

  return (
    <CrmContext.Provider
      value={{
        settings,
        updateSettings,
        currentRole,
        setCurrentRole,
        leads,
        addLead,
        updateLead,
        deleteLead,
        customers,
        addCustomer,
        updateCustomer,
        checkDuplicateCustomer,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        quotations,
        addQuotation,
        updateQuotation,
        convertQuotationToOrder,
        orders,
        addOrder,
        updateOrder,
        updateOrderStatus,
        production,
        updateProductionRecord,
        inventory,
        updateInventoryStock,
        addInventoryItem,
        payments,
        addPayment,
        invoices,
        addInvoice,
        dispatches,
        updateDispatch,
        followUps,
        addFollowUp,
        completeFollowUp,
        activeTab,
        setActiveTab,
        selectedCustomerId,
        setSelectedCustomerId,
        selectedQuotationId,
        setSelectedQuotationId,
        selectedOrderId,
        setSelectedOrderId,
        quickAction,
        setQuickAction,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) throw new Error('useCrm must be used within a CrmProvider');
  return context;
};
