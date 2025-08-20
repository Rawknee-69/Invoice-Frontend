/* eslint-disable @typescript-eslint/no-explicit-any */
// API utility functions for making authenticated requests

const API_URL = "http://localhost:3000";

interface ApiResponse<T = any> {
  data?: T;
  error?: {
    type: string;
    message: string;
    code: string;
    timestamp: string;
    details?: any[];
  };
  message?: string;
}

// Generic API request function with error handling
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include", // Include cookies for session
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: {
          type: "API_ERROR",
          message: (data as any).error?.message || "An error occurred",
          code: (data as any).error?.code || "UNKNOWN_ERROR",
          timestamp: new Date().toISOString(),
          details: (data as any).error?.details || [],
        },
      };
    }

    return { data: data as T, message: (data as any).message };
  } catch (error) {
    return {
      error: {
        type: "NETWORK_ERROR",
        message:
          error instanceof Error ? error.message : "Network error occurred",
        code: "NETWORK_ERROR",
        timestamp: new Date().toISOString(),
      },
    };
  }
};

// Auth-specific API calls
export const authApi = {
  checkSession: () => apiRequest("/api/auth/session"),
  signOut: () => apiRequest("/api/auth/sign-out", { method: "POST" }),
  signInWithGoogle: () =>
    `http://localhost:3000/api/auth/sign-in/social?provider=google`,
};

// Profile API calls
export const profileApi = {
  get: () => apiRequest("/api/profile"),
  create: (profile: any) =>
    apiRequest("/api/profile", {
      method: "POST",
      body: JSON.stringify(profile),
    }),
  update: (profile: any) =>
    apiRequest("/api/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    }),
};

// Client API calls
export const clientApi = {
  getAll: (params?: URLSearchParams) =>
    apiRequest(`/api/clients${params ? `?${params}` : ""}`),
  getById: (id: string) => apiRequest(`/api/clients/${id}`),
  create: (client: any) =>
    apiRequest("/api/clients", {
      method: "POST",
      body: JSON.stringify(client),
    }),
  update: (id: string, client: any) =>
    apiRequest(`/api/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(client),
    }),
  delete: (id: string) =>
    apiRequest(`/api/clients/${id}`, { method: "DELETE" }),
};

// Invoice API calls
export const invoiceApi = {
  getAll: (params?: URLSearchParams) =>
    apiRequest(`/api/invoices${params ? `?${params}` : ""}`),
  getById: (id: string) => apiRequest(`/api/invoices/${id}`),
  getByStatus: (status: string, params?: URLSearchParams) =>
    apiRequest(`/api/invoices/status/${status}${params ? `?${params}` : ""}`),
  search: (params?: URLSearchParams) =>
    apiRequest(`/api/invoices/search${params ? `?${params}` : ""}`),
  getOutstanding: () => apiRequest("/api/invoices/outstanding"),
  getOverdue: () => apiRequest("/api/invoices/overdue"),
  getStats: () => apiRequest("/api/invoices/stats"),
  create: (invoice: any) =>
    apiRequest("/api/invoices", {
      method: "POST",
      body: JSON.stringify(invoice),
    }),
  update: (id: string, invoice: any) =>
    apiRequest(`/api/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(invoice),
    }),
  delete: (id: string) =>
    apiRequest(`/api/invoices/${id}`, { method: "DELETE" }),
  duplicate: (id: string) =>
    apiRequest(`/api/invoices/${id}/duplicate`, { method: "POST" }),
  markPaid: (id: string) =>
    apiRequest(`/api/invoices/${id}/pay`, { method: "POST" }),
  send: (id: string) =>
    apiRequest(`/api/invoices/${id}/send`, { method: "POST" }),
  updateStatus: (id: string, status: string) =>
    apiRequest(`/api/invoices/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
  convertToEstimate: (id: string) =>
    apiRequest(`/api/invoices/${id}/convert-to-estimate`, { method: "POST" }),
};

// Estimate API calls
export const estimateApi = {
  getAll: (params?: URLSearchParams) =>
    apiRequest(`/api/estimates${params ? `?${params}` : ""}`),
  getById: (id: string) => apiRequest(`/api/estimates/${id}`),
  getStats: () => apiRequest("/api/estimates/stats"),
  create: (estimate: any) =>
    apiRequest("/api/estimates", {
      method: "POST",
      body: JSON.stringify(estimate),
    }),
  update: (id: string, estimate: any) =>
    apiRequest(`/api/estimates/${id}`, {
      method: "PUT",
      body: JSON.stringify(estimate),
    }),
  delete: (id: string) =>
    apiRequest(`/api/estimates/${id}`, { method: "DELETE" }),
  duplicate: (id: string) =>
    apiRequest(`/api/estimates/${id}/duplicate`, { method: "POST" }),
  convertToInvoice: (id: string) =>
    apiRequest(`/api/estimates/${id}/convert-to-invoice`, { method: "POST" }),
};

// Expense API calls
export const expenseApi = {
  getAll: (params?: URLSearchParams) =>
    apiRequest(`/api/expenses${params ? `?${params}` : ""}`),
  getById: (id: string) => apiRequest(`/api/expenses/${id}`),
  getCategories: () => apiRequest("/api/expenses/categories"),
  getStats: (params?: URLSearchParams) =>
    apiRequest(`/api/expenses/stats${params ? `?${params}` : ""}`),
  create: (expense: any) =>
    apiRequest("/api/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
    }),
  update: (id: string, expense: any) =>
    apiRequest(`/api/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(expense),
    }),
  delete: (id: string) =>
    apiRequest(`/api/expenses/${id}`, { method: "DELETE" }),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiRequest("/api/expenses/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
  scan: (imageUrl: string) =>
    apiRequest("/api/expenses/scan", {
      method: "POST",
      body: JSON.stringify({ imageUrl }),
    }),
  scanAndPopulate: (imageUrl: string) =>
    apiRequest("/api/expenses/scan-and-populate", {
      method: "POST",
      body: JSON.stringify({ imageUrl }),
    }),
  correctScan: (originalScanResult: any, corrections: any) =>
    apiRequest("/api/expenses/correct-scan", {
      method: "POST",
      body: JSON.stringify({ originalScanResult, corrections }),
    }),
};

// Payment API calls
export const paymentApi = {
  getAll: (params?: URLSearchParams) =>
    apiRequest(`/api/payments${params ? `?${params}` : ""}`),
  getById: (id: string) => apiRequest(`/api/payments/${id}`),
  getHistory: (invoiceId: string) =>
    apiRequest(`/api/payments/history/invoice/${invoiceId}`),
  getUpcoming: () => apiRequest("/api/payments/upcoming"),
  create: (payment: any) =>
    apiRequest("/api/payments", {
      method: "POST",
      body: JSON.stringify(payment),
    }),
  update: (id: string, payment: any) =>
    apiRequest(`/api/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(payment),
    }),
  delete: (id: string) =>
    apiRequest(`/api/payments/${id}`, { method: "DELETE" }),

  // Payment Schedule APIs
  schedule: {
    create: (schedule: any) =>
      apiRequest("/api/payments/schedule", {
        method: "POST",
        body: JSON.stringify(schedule),
      }),
    getByInvoice: (invoiceId: string) =>
      apiRequest(`/api/payments/schedule/invoice/${invoiceId}`),
    updateItem: (itemId: string, item: any) =>
      apiRequest(`/api/payments/schedule/item/${itemId}`, {
        method: "PUT",
        body: JSON.stringify(item),
      }),
    deleteItem: (itemId: string) =>
      apiRequest(`/api/payments/schedule/item/${itemId}`, { method: "DELETE" }),
    markPaid: (itemId: string, paidDate?: string) =>
      apiRequest(`/api/payments/schedule/item/${itemId}/mark-paid`, {
        method: "PATCH",
        body: JSON.stringify({ paidDate }),
      }),
  },
};

// Saved Items API calls
export const savedItemApi = {
  getAll: (params?: URLSearchParams) =>
    apiRequest(`/api/saved-items${params ? `?${params}` : ""}`),
  getById: (id: string) => apiRequest(`/api/saved-items/${id}`),
  getFrequentlyUsed: () => apiRequest("/api/saved-items/frequently-used"),
  create: (item: any) =>
    apiRequest("/api/saved-items", {
      method: "POST",
      body: JSON.stringify(item),
    }),
  update: (id: string, item: any) =>
    apiRequest(`/api/saved-items/${id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    }),
  delete: (id: string) =>
    apiRequest(`/api/saved-items/${id}`, { method: "DELETE" }),
  duplicate: (id: string) =>
    apiRequest(`/api/saved-items/${id}/duplicate`, { method: "POST" }),
  saveFromExisting: (sourceType: string, sourceId: string, itemId: string) =>
    apiRequest("/api/saved-items/save-from-existing", {
      method: "POST",
      body: JSON.stringify({ sourceType, sourceId, itemId }),
    }),
};

// Template API calls
export const templateApi = {
  getAll: (params?: URLSearchParams) =>
    apiRequest(`/api/templates${params ? `?${params}` : ""}`),
  getById: (templateId: string) => apiRequest(`/api/templates/${templateId}`),
  render: (templateId: string, invoiceId: string, format: "html" | "pdf") =>
    apiRequest(`/api/templates/${templateId}/render`, {
      method: "POST",
      body: JSON.stringify({ invoiceId, format }),
    }),
};

// Contact API calls
export const contactApi = {
  parse: (text: string, format: "csv" | "vcard") =>
    apiRequest("/api/contacts/parse", {
      method: "POST",
      body: JSON.stringify({ text, format }),
    }),
  import: (contacts: any[]) =>
    apiRequest("/api/contacts/import", {
      method: "POST",
      body: JSON.stringify({ contacts }),
    }),
};

// Reports API calls
export const reportApi = {
  get: (params?: URLSearchParams) =>
    apiRequest(`/api/reports${params ? `?${params}` : ""}`),
  export: (params?: URLSearchParams) =>
    apiRequest(`/api/reports/export${params ? `?${params}` : ""}`),
};

// Settings API calls
export const settingsApi = {
  get: () => apiRequest("/api/settings"),
  update: (settings: any) =>
    apiRequest("/api/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    }),
  getColors: () => apiRequest("/api/settings/colors"),
  updateColors: (colors: any) =>
    apiRequest("/api/settings/colors", {
      method: "PUT",
      body: JSON.stringify(colors),
    }),
  getTemplates: () => apiRequest("/api/settings/templates"),
  updateTemplates: (templates: any) =>
    apiRequest("/api/settings/templates", {
      method: "PUT",
      body: JSON.stringify(templates),
    }),
  support: {
    get: () => apiRequest("/api/settings/support"),
    create: (supportRequest: any) =>
      apiRequest("/api/settings/support", {
        method: "POST",
        body: JSON.stringify(supportRequest),
      }),
  },
  supportContact: {
    get: () => apiRequest("/api/settings/support-contact"),
    update: (contact: any) =>
      apiRequest("/api/settings/support-contact", {
        method: "PUT",
        body: JSON.stringify(contact),
      }),
  },
};

export default {
  apiRequest,
  authApi,
  profileApi,
  clientApi,
  invoiceApi,
  estimateApi,
  expenseApi,
  paymentApi,
  savedItemApi,
  templateApi,
  contactApi,
  reportApi,
  settingsApi,
};
