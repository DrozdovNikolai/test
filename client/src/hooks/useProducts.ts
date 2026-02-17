import { useState, useEffect } from 'react';

export interface Product {
    id: number;
    title: string;
    short_description: string;
    platform: string;
    registration_num: string | null;
    reg_program_num: string | null;
    certificate_image: string | null;
    description: string;
}

interface ApiResponse {
    success: boolean;
    data: Product[];
    count: number;
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch('/apiv2/products');
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const result: ApiResponse = await response.json();
                
                if (result.success && Array.isArray(result.data)) {
                    setProducts(result.data);
                } else {
                    console.error('Unexpected API response structure:', result);
                    setProducts([]);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Unknown error';
                setError(errorMessage);
                console.error('Error fetching products:', err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
}