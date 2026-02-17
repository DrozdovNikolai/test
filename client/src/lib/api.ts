const API_BASE_URL = import.meta.env.VITE_API_URL || "/apiv2";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  short_description: string;
  certificate_image: string | null;
  registration_num: string | null;
  reg_program_num: string | null;
  platform: string;
  created_at: string;
}

export interface CreateProductDTO {
  title: string;
  description: string;
  short_description: string;
  certificate_image?: string;
  registration_num?: string;
  reg_program_num?: string;
  platform: string;
}

export interface UpdateProductDTO {
  title?: string;
  description?: string;
  short_description?: string;
  certificate_image?: string;
  registration_num?: string;
  reg_program_num?: string;
  platform?: string;
}

export interface ProductStats {
  total: number;
  withCertificates: number;
  registered: number;
  byPlatform: Record<string, number>;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  const data: ApiResponse<T> = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.success === true && data.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

// Получить все продукты
export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: getHeaders(),
  });

  const result = await handleResponse<Product[]>(response);
  return result.data;
}

// Поиск продуктов
export async function searchProducts(query: string): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`,
    { headers: getHeaders() }
  );

  const result = await handleResponse<Product[]>(response);
  return result.data;
}

// Получить статистику
export async function getProductStats(): Promise<ProductStats> {
  const response = await fetch(`${API_BASE_URL}/products/stats`, {
    headers: getHeaders(),
  });

  const result = await handleResponse<ProductStats>(response);
  return result.data;
}

// Получить продукт по ID
export async function getProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    headers: getHeaders(),
  });

  const result = await handleResponse<Product>(response);
  return result.data;
}

// Создать новый продукт
export async function createProduct(productData: CreateProductDTO): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(productData),
  });

  const result = await handleResponse<Product>(response);
  return result.data;
}

// Обновить продукт
export async function updateProduct(id: number, productData: UpdateProductDTO): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(productData),
  });

  const result = await handleResponse<Product>(response);
  return result.data;
}

// Удалить продукт
export async function deleteProduct(id: number): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  const result = await handleResponse<any>(response);
  return result.success;
}

// Получить продукты по платформе
export async function getProductsByPlatform(platform: string): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/platform/${encodeURIComponent(platform)}`,
    { headers: getHeaders() }
  );

  const result = await handleResponse<Product[]>(response);
  return result.data;
}

// Получить продукты с сертификатами
export async function getProductsWithCertificates(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products/with-certificates`, {
    headers: getHeaders(),
  });

  const result = await handleResponse<Product[]>(response);
  return result.data;
}

// Получить зарегистрированные продукты
export async function getRegisteredProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products/registered`, {
    headers: getHeaders(),
  });

  const result = await handleResponse<Product[]>(response);
  return result.data;
}

// Инициализация базы данных (для разработки)
export async function initializeDatabase(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/init-db`, {
    method: 'POST',
    headers: getHeaders(),
  });

  const result = await handleResponse<any>(response);
  return result.success;
}

// Тест подключения к базе данных
export async function testDatabaseConnection(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/test-db`, {
    headers: getHeaders(),
  });

  const result = await handleResponse<any>(response);
  return result.data;
}

// Кастомный хук для работы с API
export function useApi() {
  return {
    checkHealth,
    fetchProducts,
    searchProducts,
    getProductStats,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByPlatform,
    getProductsWithCertificates,
    getRegisteredProducts,
    initializeDatabase,
    testDatabaseConnection,
  };
}
