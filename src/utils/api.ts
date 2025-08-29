/* eslint-disable @typescript-eslint/no-explicit-any */
// Optimized API utility functions with caching and request deduplication

import { cacheManager, authCache, cacheKeys } from './cache';
import { requestDeduplicator, generateRequestKey } from './request-deduplication';
import { performanceMonitor } from './performance-monitor';

// const API_URL = "http://localhost:3000";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Helper function to get Clerk token
const getClerkToken = async (): Promise<string | null> => {
  try {
    // For now, we'll rely on Clerk's session cookies
    // The backend should be able to read the session from cookies
    // This will work for browser-based requests
    return null;
  } catch (error) {
    console.warn('Failed to get Clerk token:', error);
    return null;
  }
};

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

interface ApiOptions extends RequestInit {
  useCache?: boolean;
  cacheTTL?: number;
  skipDeduplication?: boolean;
  cacheKey?: string;
}

// Enhanced API request function with caching and deduplication
export const apiRequest = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    useCache = true,
    cacheTTL,
    skipDeduplication = false,
    cacheKey,
    ...fetchOptions
  } = options;

  const method = fetchOptions.method || 'GET';
  const isGetRequest = method === 'GET';
  
  // Generate cache key if not provided
  const finalCacheKey = cacheKey || generateRequestKey(method, endpoint, fetchOptions.body as string);
  
  // Check cache for GET requests
  if (useCache && isGetRequest) {
    const cachedData = cacheManager.get<T>(finalCacheKey);
    if (cachedData) {
      // Track cache hit performance
      performanceMonitor.trackRequest(
        endpoint,
        method,
        0, // No response time for cache hits
        true,
        true, // cacheHit = true
      );
      return { data: cachedData };
    }
  }

  // Create the actual request function
  const makeRequest = async (): Promise<ApiResponse<T>> => {
    const startTime = performance.now();
    let cacheHit = false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      // Get authentication token
      const token = await getClerkToken();
      
      // Prepare headers
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(fetchOptions.headers as Record<string, string>),
      };

      // Add authorization header if token exists
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Debug logging
      console.log('API Request Debug:', {
        url: `${API_URL}${endpoint}`,
        method,
        hasToken: !!token,
        headers: Object.keys(headers),
        credentials: "include"
      });

      const response = await fetch(`${API_URL}${endpoint}`, {
        credentials: "include",
        headers,
        signal: controller.signal,
        ...fetchOptions,
      });

      clearTimeout(timeoutId);

      // Debug response
      console.log('API Response Debug:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      });

      const data = await response.json();
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      if (!response.ok) {
        performanceMonitor.trackRequest(
          endpoint,
          method,
          responseTime,
          false,
          cacheHit,
          "API_ERROR"
        );

        // Enhanced error logging
        console.error('API Error Details:', {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          data,
          headers: Object.fromEntries(response.headers.entries())
        });

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

      const result = { data: data as T, message: (data as any).message };

      // Cache successful GET requests
      if (useCache && isGetRequest && result.data) {
        cacheManager.set(finalCacheKey, result.data, cacheTTL);
      }

      performanceMonitor.trackRequest(
        endpoint,
        method,
        responseTime,
        true,
        cacheHit
      );

      return result;
    } catch (error) {
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      if (error instanceof Error && error.name === 'AbortError') {
        performanceMonitor.trackRequest(
          endpoint,
          method,
          responseTime,
          false,
          cacheHit,
          "TIMEOUT_ERROR"
        );

        return {
          error: {
            type: "TIMEOUT_ERROR",
            message: "Request timed out",
            code: "TIMEOUT_ERROR",
            timestamp: new Date().toISOString(),
          },
        };
      }

      performanceMonitor.trackRequest(
        endpoint,
        method,
        responseTime,
        false,
        cacheHit,
        "NETWORK_ERROR"
      );

      return {
        error: {
          type: "NETWORK_ERROR",
          message: error instanceof Error ? error.message : "Network error occurred",
          code: "NETWORK_ERROR",
          timestamp: new Date().toISOString(),
        },
      };
    }
  };

  // Use deduplication for GET requests unless explicitly skipped
  if (!skipDeduplication && isGetRequest) {
    return requestDeduplicator.deduplicate(finalCacheKey, makeRequest);
  }

  return makeRequest();
};

// Cache invalidation helpers
export const invalidateCache = {
  clients: () => cacheManager.invalidateResource('clients'),
  invoices: () => cacheManager.invalidateResource('invoices'),
  estimates: () => cacheManager.invalidateResource('estimates'),
  expenses: () => cacheManager.invalidateResource('expenses'),
  payments: () => cacheManager.invalidateResource('payments'),
  savedItems: () => cacheManager.invalidateResource('savedItems'),
  templates: () => cacheManager.invalidateResource('templates'),
  settings: () => cacheManager.invalidateResource('settings'),
  reports: () => cacheManager.invalidateResource('reports'),
  all: () => cacheManager.clear(),
};

// Auth-specific API calls with specialized caching
export const authApi = {
  checkSession: () => 
    apiRequest("/api/auth/session", { 
      useCache: true, 
      cacheTTL: 10 * 60 * 1000, // 10 minutes
      cacheKey: cacheKeys.auth.session()
    }),
  signOut: () => {
    authCache.clear(); // Clear auth cache on sign out
    return apiRequest("/api/auth/sign-out", { method: "POST" });
  },
  signInWithGoogle: () =>
    `${API_URL}/api/auth/sign-in/social?provider=google`,
};

// Profile API calls
export const profileApi = {
  get: () => apiRequest("/api/profile", { useCache: true, cacheTTL: 30 * 60 * 1000 }),
  create: (profile: any) =>
    apiRequest("/api/profile", {
      method: "POST",
      body: JSON.stringify(profile),
    }),
  update: (profile: any) => {
    invalidateCache.all(); // Invalidate all cache on profile update
    return apiRequest("/api/profile", {
      method: "PUT",
      body: JSON.stringify(profile),
    });
  },
};

// Client API calls with caching
export const clientApi = {
  getAll: (params?: URLSearchParams) => {
    const paramString = params?.toString();
    return apiRequest(`/api/clients${paramString ? `?${paramString}` : ""}`, {
      useCache: true,
      cacheKey: cacheKeys.clients.all(paramString),
    });
  },
  getById: (id: string) => 
    apiRequest(`/api/clients/${id}`, {
      useCache: true,
      cacheKey: cacheKeys.clients.byId(id),
    }),
  create: (client: any) => {
    invalidateCache.clients();
    return apiRequest("/api/clients", {
      method: "POST",
      body: JSON.stringify(client),
    });
  },
  update: (id: string, client: any) => {
    invalidateCache.clients();
    return apiRequest(`/api/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(client),
    });
  },
  delete: (id: string) => {
    invalidateCache.clients();
    return apiRequest(`/api/clients/${id}`, { method: "DELETE" });
  },
};

// Invoice API calls with optimized caching
export const invoiceApi = {
  getAll: (params?: URLSearchParams) => {
    const paramString = params?.toString();
    return apiRequest(`/api/invoices${paramString ? `?${paramString}` : ""}`, {
      useCache: true,
      cacheKey: cacheKeys.invoices.all(paramString),
    });
  },
  getById: (id: string) => 
    apiRequest(`/api/invoices/${id}`, {
      useCache: true,
      cacheKey: cacheKeys.invoices.byId(id),
    }),
  getByStatus: (status: string, params?: URLSearchParams) => {
    const paramString = params?.toString();
    return apiRequest(`/api/invoices/status/${status}${paramString ? `?${paramString}` : ""}`, {
      useCache: true,
      cacheKey: cacheKeys.invoices.byStatus(status, paramString),
    });
  },
  search: (params?: URLSearchParams) => {
    const paramString = params?.toString();
    return apiRequest(`/api/invoices/search${paramString ? `?${paramString}` : ""}`, {
      useCache: true,
      cacheKey: cacheKeys.invoices.search(paramString),
    });
  },
  getOutstanding: () => 
    apiRequest("/api/invoices/outstanding", {
      useCache: true,
      cacheKey: cacheKeys.invoices.outstanding(),
      cacheTTL: 2 * 60 * 1000, // 2 minutes for real-time data
    }),
  getOverdue: () => 
    apiRequest("/api/invoices/overdue", {
      useCache: true,
      cacheKey: cacheKeys.invoices.overdue(),
      cacheTTL: 2 * 60 * 1000, // 2 minutes for real-time data
    }),
  getStats: () => 
    apiRequest("/api/invoices/stats", {
      useCache: true,
      cacheKey: cacheKeys.invoices.stats(),
      cacheTTL: 5 * 60 * 1000, // 5 minutes for stats
    }),
  create: (invoice: any) => {
    invalidateCache.invoices();
    return apiRequest("/api/invoices", {
      method: "POST",
      body: JSON.stringify(invoice),
    });
  },
  update: (id: string, invoice: any) => {
    invalidateCache.invoices();
    return apiRequest(`/api/invoices/${id}`, {
      method: "PUT",
      body: JSON.stringify(invoice),
    });
  },
  delete: (id: string) => {
    invalidateCache.invoices();
    return apiRequest(`/api/invoices/${id}`, { method: "DELETE" });
  },
  duplicate: (id: string) => {
    invalidateCache.invoices();
    return apiRequest(`/api/invoices/${id}/duplicate`, { method: "POST" });
  },
  markPaid: (id: string) => {
    invalidateCache.invoices();
    invalidateCache.payments();
    return apiRequest(`/api/invoices/${id}/pay`, { method: "POST" });
  },
  send: (id: string) => {
    invalidateCache.invoices();
    return apiRequest(`/api/invoices/${id}/send`, { method: "POST" });
  },
  updateStatus: (id: string, status: string) => {
    invalidateCache.invoices();
    return apiRequest(`/api/invoices/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
  convertToEstimate: (id: string) => {
    invalidateCache.invoices();
    invalidateCache.estimates();
    return apiRequest(`/api/invoices/${id}/convert-to-estimate`, { method: "POST" });
  },
};

// Estimate API calls
export const estimateApi = {
  getAll: (params?: URLSearchParams) => {
    const paramString = params?.toString();
    return apiRequest(`/api/estimates${paramString ? `?${paramString}` : ""}`, {
      useCache: true,
      cacheKey: cacheKeys.estimates.all(paramString),
    });
  },
  getById: (id: string) => 
    apiRequest(`/api/estimates/${id}`, {
      useCache: true,
      cacheKey: cacheKeys.estimates.byId(id),
    }),
  getStats: () => 
    apiRequest("/api/estimates/stats", {
      useCache: true,
      cacheKey: cacheKeys.estimates.stats(),
      cacheTTL: 5 * 60 * 1000,
    }),
  create: (estimate: any) => {
    invalidateCache.estimates();
    return apiRequest("/api/estimates", {
      method: "POST",
      body: JSON.stringify(estimate),
    });
  },
  update: (id: string, estimate: any) => {
    invalidateCache.estimates();
    return apiRequest(`/api/estimates/${id}`, {
      method: "PUT",
      body: JSON.stringify(estimate),
    });
  },
  delete: (id: string) => {
    invalidateCache.estimates();
    return apiRequest(`/api/estimates/${id}`, { method: "DELETE" });
  },
  duplicate: (id: string) => {
    invalidateCache.estimates();
    return apiRequest(`/api/estimates/${id}/duplicate`, { method: "POST" });
  },
  convertToInvoice: (id: string) => {
    invalidateCache.estimates();
    invalidateCache.invoices();
    return apiRequest(`/api/estimates/${id}/convert-to-invoice`, { method: "POST" });
  },
};

// Expense API calls with optimized caching
export const expenseApi = {
  getAll: (params?: URLSearchParams) => {
    const paramString = params?.toString();
    return apiRequest(`/api/expenses${paramString ? `?${paramString}` : ""}`, {
      useCache: true,
      cacheKey: cacheKeys.expenses.all(paramString),
    });
  },
  getById: (id: string) => 
    apiRequest(`/api/expenses/${id}`, {
      useCache: true,
      cacheKey: cacheKeys.expenses.byId(id),
    }),
  getCategories: () => 
    apiRequest("/api/expenses/categories", {
      useCache: true,
      cacheKey: cacheKeys.expenses.categories(),
      cacheTTL: 60 * 60 * 1000, // 1 hour for categories
    }),
  getStats: (params?: URLSearchParams) => {
    const paramString = params?.toString();
    return apiRequest(`/api/expenses/stats${paramString ? `?${paramString}` : ""}`, {
      useCache: true,
      cacheKey: cacheKeys.expenses.stats(paramString),
      cacheTTL: 5 * 60 * 1000,
    });
  },
  create: (expense: any) => {
    invalidateCache.expenses();
    return apiRequest("/api/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
    });
  },
  update: (id: string, expense: any) => {
    invalidateCache.expenses();
    return apiRequest(`/api/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(expense),
    });
  },
  delete: (id: string) => {
    invalidateCache.expenses();
    return apiRequest(`/api/expenses/${id}`, { method: "DELETE" });
  },
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
  getReceiptUrl: (imageUrl: string) =>
    apiRequest("/api/expenses/receipt-url", {
      method: "POST",
      body: JSON.stringify({ imageUrl }),
    }),
};

// Payment API calls
export const paymentApi = {
  getAll: (params?: URLSearchParams) => {
    const paramString = params?.toString();
    return apiRequest(`/api/payments${paramString ? `?${paramString}` : ""}`, {
      useCache: true,
      cacheKey: cacheKeys.payments.all(paramString),
    });
  },
  getById: (id: string) => 
    apiRequest(`/api/payments/${id}`, {
      useCache: true,
      cacheKey: cacheKeys.payments.byId(id),
    }),
  getHistory: (invoiceId: string) => 
    apiRequest(`/api/payments/history/invoice/${invoiceId}`, {
      useCache: true,
      cacheKey: cacheKeys.payments.history(invoiceId),
    }),
  getUpcoming: () => 
    apiRequest("/api/payments/upcoming", {
      useCache: true,
      cacheKey: cacheKeys.payments.upcoming(),
      cacheTTL: 2 * 60 * 1000, // 2 minutes for real-time data
    }),
  create: (payment: any) => {
    invalidateCache.payments();
    return apiRequest("/api/payments", {
      method: "POST",
      body: JSON.stringify(payment),
    });
  },
  update: (id: string, payment: any) => {
    invalidateCache.payments();
    return apiRequest(`/api/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(payment),
    });
  },
  delete: (id: string) => {
    invalidateCache.payments();
    return apiRequest(`/api/payments/${id}`, { method: "DELETE" });
  },

  // Payment Schedule APIs
  schedule: {
    create: (schedule: any) => {
      invalidateCache.payments();
      return apiRequest("/api/payments/schedule", {
        method: "POST",
        body: JSON.stringify(schedule),
      });
    },
    getByInvoice: (invoiceId: string) => 
      apiRequest(`/api/payments/schedule/invoice/${invoiceId}`, {
        useCache: true,
        cacheTTL: 5 * 60 * 1000,
      }),
    updateItem: (itemId: string, item: any) => {
      invalidateCache.payments();
      return apiRequest(`/api/payments/schedule/item/${itemId}`, {
        method: "PUT",
        body: JSON.stringify(item),
      });
    },
    deleteItem: (itemId: string) => {
      invalidateCache.payments();
      return apiRequest(`/api/payments/schedule/item/${itemId}`, { method: "DELETE" });
    },
    markPaid: (itemId: string, paidDate?: string) => {
      invalidateCache.payments();
      return apiRequest(`/api/payments/schedule/item/${itemId}/mark-paid`, {
        method: "PATCH",
        body: JSON.stringify({ paidDate }),
      });
    },
  },
};

// Saved Items API calls
export const savedItemApi = {
  getAll: (params?: URLSearchParams) => {
    const paramString = params?.toString();
    return apiRequest(`/api/saved-items${paramString ? `?${paramString}` : ""}`, {
      useCache: true,
      cacheKey: cacheKeys.savedItems.all(paramString),
    });
  },
  getById: (id: string) => 
    apiRequest(`/api/saved-items/${id}`, {
      useCache: true,
      cacheKey: cacheKeys.savedItems.byId(id),
    }),
  getFrequentlyUsed: () => 
    apiRequest("/api/saved-items/frequently-used", {
      useCache: true,
      cacheKey: cacheKeys.savedItems.frequentlyUsed(),
      cacheTTL: 10 * 60 * 1000, // 10 minutes
    }),
  create: (item: any) => {
    invalidateCache.savedItems();
    return apiRequest("/api/saved-items", {
      method: "POST",
      body: JSON.stringify(item),
    });
  },
  update: (id: string, item: any) => {
    invalidateCache.savedItems();
    return apiRequest(`/api/saved-items/${id}`, {
      method: "PUT",
      body: JSON.stringify(item),
    });
  },
  delete: (id: string) => {
    invalidateCache.savedItems();
    return apiRequest(`/api/saved-items/${id}`, { method: "DELETE" });
  },
  duplicate: (id: string) => {
    invalidateCache.savedItems();
    return apiRequest(`/api/saved-items/${id}/duplicate`, { method: "POST" });
  },
  saveFromExisting: (sourceType: string, sourceId: string, itemId: string) => {
    invalidateCache.savedItems();
    return apiRequest("/api/saved-items/save-from-existing", {
      method: "POST",
      body: JSON.stringify({ sourceType, sourceId, itemId }),
    });
  },
};

// Template API calls
export const templateApi = {
  getAll: (params?: URLSearchParams) => {
    const paramString = params?.toString();
    return apiRequest(`/api/templates${paramString ? `?${paramString}` : ""}`, {
      useCache: true,
      cacheKey: cacheKeys.templates.all(paramString),
    });
  },
  getById: (templateId: string) => 
    apiRequest(`/api/templates/${templateId}`, {
      useCache: true,
      cacheKey: cacheKeys.templates.byId(templateId),
    }),
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
  get: (params?: URLSearchParams) => {
    const paramString = params?.toString();
    return apiRequest(`/api/reports${paramString ? `?${paramString}` : ""}`, {
      useCache: true,
      cacheKey: cacheKeys.reports.all(paramString),
      cacheTTL: 10 * 60 * 1000, // 10 minutes for reports
    });
  },
  export: (params?: URLSearchParams) =>
    apiRequest(`/api/reports/export${params ? `?${params}` : ""}`),
};

// Settings API calls with longer cache times
export const settingsApi = {
  get: () => 
    apiRequest("/api/settings", {
      useCache: true,
      cacheKey: cacheKeys.settings.all(),
      cacheTTL: 30 * 60 * 1000, // 30 minutes
    }),
  update: (settings: any) => {
    invalidateCache.settings();
    return apiRequest("/api/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },
  getColors: () => 
    apiRequest("/api/settings/colors", {
      useCache: true,
      cacheKey: cacheKeys.settings.colors(),
      cacheTTL: 30 * 60 * 1000,
    }),
  updateColors: (colors: any) => {
    invalidateCache.settings();
    return apiRequest("/api/settings/colors", {
      method: "PUT",
      body: JSON.stringify(colors),
    });
  },
  getTemplates: () => 
    apiRequest("/api/settings/templates", {
      useCache: true,
      cacheKey: cacheKeys.settings.templates(),
      cacheTTL: 30 * 60 * 1000,
    }),
  updateTemplates: (templates: any) => {
    invalidateCache.settings();
    return apiRequest("/api/settings/templates", {
      method: "PUT",
      body: JSON.stringify(templates),
    });
  },
  support: {
    get: () => 
      apiRequest("/api/settings/support", {
        useCache: true,
        cacheKey: cacheKeys.settings.support(),
        cacheTTL: 30 * 60 * 1000,
      }),
    create: (supportRequest: any) =>
      apiRequest("/api/settings/support", {
        method: "POST",
        body: JSON.stringify(supportRequest),
      }),
  },
  supportContact: {
    get: () => 
      apiRequest("/api/settings/support-contact", {
        useCache: true,
        cacheKey: cacheKeys.settings.supportContact(),
        cacheTTL: 30 * 60 * 1000,
      }),
    update: (contact: any) => {
      invalidateCache.settings();
      return apiRequest("/api/settings/support-contact", {
        method: "PUT",
        body: JSON.stringify(contact),
      });
    },
  },
};

// Cache management utilities
export const cacheUtils = {
  clearAll: () => cacheManager.clear(),
  getStats: () => cacheManager.getStats(),
  invalidate: invalidateCache,
  clearPendingRequests: () => requestDeduplicator.clear(),
  getPendingCount: () => requestDeduplicator.getPendingCount(),
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
  cacheUtils,
};
