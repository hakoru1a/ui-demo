/**
 * Example Service - Demonstrates how to use the BaseService
 * 
 * This is a template/example file. You can copy this pattern to create
 * your own service classes for different API endpoints.
 */

import { BaseService, ApiResult, PaginationResult, QueryRequest, Entity } from './core';

// ==================== TYPES ====================

/**
 * Example entity interface
 */
export interface ExampleItem extends Entity<number> {
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

/**
 * Request type for creating a new item
 */
export interface CreateItemRequest {
  name: string;
  description: string;
  status?: 'active' | 'inactive';
}

/**
 * Request type for updating an item
 */
export interface UpdateItemRequest {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

// ==================== SERVICE CLASS ====================

/**
 * Example Service Class
 * Extends BaseService to inherit all HTTP methods
 */
class ExampleService extends BaseService {
  /**
   * Get paginated list of items with optional filters
   * 
   * @param params - Query parameters (page, size, search, sort)
   * @returns Paginated result with items
   */
  async getItems(params?: QueryRequest): Promise<ApiResult<PaginationResult<ExampleItem>>> {
    return this.get<PaginationResult<ExampleItem>>('/api/items', params);
  }

  /**
   * Get a single item by ID
   * 
   * @param id - Item ID
   * @returns Single item result
   */
  async getItemById(id: number): Promise<ApiResult<ExampleItem>> {
    return this.get<ExampleItem>(`/api/items/${id}`);
  }

  /**
   * Create a new item
   * 
   * @param payload - Item data
   * @returns Created item result
   */
  async createItem(payload: CreateItemRequest): Promise<ApiResult<ExampleItem>> {
    return this.post<CreateItemRequest, ExampleItem>('/api/items', payload);
  }

  /**
   * Update an existing item
   * 
   * @param id - Item ID
   * @param payload - Updated data
   * @returns Updated item result
   */
  async updateItem(id: number, payload: UpdateItemRequest): Promise<ApiResult<ExampleItem>> {
    return this.put<UpdateItemRequest, ExampleItem>(`/api/items/${id}`, payload);
  }

  /**
   * Partially update an item
   * 
   * @param id - Item ID
   * @param payload - Partial data to update
   * @returns Updated item
   */
  async patchItem(id: number, payload: Partial<ExampleItem>): Promise<ExampleItem> {
    return this.patch<Partial<ExampleItem>, ExampleItem>(`/api/items/${id}`, payload);
  }

  /**
   * Delete an item
   * 
   * @param id - Item ID
   * @returns Delete operation result
   */
  async deleteItem(id: number): Promise<ApiResult<void>> {
    return this.delete<void>(`/api/items/${id}`);
  }

  /**
   * Upload a file with form data
   * 
   * @param id - Item ID
   * @param file - File to upload
   * @returns Updated item with file reference
   */
  async uploadItemFile(id: number, file: File): Promise<ApiResult<ExampleItem>> {
    return this.postFormData<{ file: File }, ExampleItem>(
      `/api/items/${id}/upload`,
      { file }
    );
  }

  /**
   * Download a file
   * 
   * @param id - Item ID
   * @returns Blob data
   */
  async downloadItemReport(id: number): Promise<Blob> {
    return this.getDownload(`/api/items/${id}/report`);
  }

  /**
   * Search items with custom query
   * 
   * @param query - Search query
   * @param cancellation - Optional cancellation token
   * @returns Search results
   */
  async searchItems(
    query: string,
    cancellation?: any
  ): Promise<ApiResult<PaginationResult<ExampleItem>>> {
    return this.get<PaginationResult<ExampleItem>>(
      '/api/items/search',
      { search: query },
      cancellation
    );
  }

  /**
   * Bulk create items
   * 
   * @param items - Array of items to create
   * @returns Created items
   */
  async bulkCreateItems(items: CreateItemRequest[]): Promise<ApiResult<ExampleItem[]>> {
    return this.post<CreateItemRequest[], ExampleItem[]>('/api/items/bulk', items);
  }

  /**
   * Get item statistics
   * 
   * @returns Statistics data
   */
  async getItemStats(): Promise<ApiResult<{ total: number; active: number; inactive: number }>> {
    return this.get<{ total: number; active: number; inactive: number }>('/api/items/stats');
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Export a singleton instance of the service
 * This ensures only one instance exists throughout the application
 */
export const exampleService = new ExampleService();

// ==================== USAGE EXAMPLES ====================

/**
 * Example 1: Fetching items with pagination
 * 
 * const result = await exampleService.getItems({
 *   page: 1,
 *   size: 10,
 *   search: 'test',
 *   sortBy: 'name',
 *   sortDirection: 'asc'
 * });
 * 
 * if (result.success) {
 *   console.log('Items:', result.data?.data);
 *   console.log('Pagination:', result.data?.meta);
 * }
 */

/**
 * Example 2: Creating an item
 * 
 * const result = await exampleService.createItem({
 *   name: 'New Item',
 *   description: 'Item description',
 *   status: 'active'
 * });
 * 
 * if (result.success) {
 *   console.log('Created item:', result.data);
 * } else {
 *   console.error('Error:', result.error);
 * }
 */

/**
 * Example 3: Error handling
 * 
 * const result = await exampleService.getItemById(123);
 * 
 * if (!result.success) {
 *   switch (result.status) {
 *     case 404:
 *       console.error('Item not found');
 *       break;
 *     case 401:
 *       console.error('Unauthorized');
 *       break;
 *     case 500:
 *       console.error('Server error');
 *       break;
 *     default:
 *       console.error('Error:', result.error);
 *   }
 * }
 */

/**
 * Example 4: Using with React hooks
 * 
 * function ItemList() {
 *   const [items, setItems] = useState<ExampleItem[]>([]);
 *   const [loading, setLoading] = useState(false);
 * 
 *   useEffect(() => {
 *     const loadItems = async () => {
 *       setLoading(true);
 *       const result = await exampleService.getItems({ page: 1, size: 10 });
 *       
 *       if (result.success && result.data) {
 *         setItems(result.data.data);
 *       }
 *       setLoading(false);
 *     };
 * 
 *     loadItems();
 *   }, []);
 * 
 *   return <div>{loading ? 'Loading...' : items.map(item => <div key={item.id}>{item.name}</div>)}</div>;
 * }
 */

/**
 * Example 5: Request cancellation
 * 
 * import axios from 'axios';
 * 
 * function SearchComponent() {
 *   useEffect(() => {
 *     const cancelTokenSource = axios.CancelToken.source();
 * 
 *     const search = async () => {
 *       const result = await exampleService.searchItems('query', cancelTokenSource.token);
 *       // Handle result
 *     };
 * 
 *     search();
 * 
 *     return () => {
 *       cancelTokenSource.cancel('Component unmounted');
 *     };
 *   }, []);
 * 
 *   return <div>Search Results</div>;
 * }
 */

