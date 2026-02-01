import { Product } from '../db/types';

const BASE_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

export const FoodService = {
    /**
     * Search for food items using OpenFoodFacts API
     * @param query Search term (e.g. "Banana")
     * @returns List of mapped Product objects
     */
    searchRemote: async (query: string): Promise<Product[]> => {
        try {
            // Use v2 Search API
            const url = `https://world.openfoodfacts.org/api/v2/search?categories_tags_en=${encodeURIComponent(query)}&fields=code,product_name,brands,nutriments,serving_size,image_front_small_url,image_url&json=true&page_size=20`;
            // Fallback to cleaner v2 search if tags fail, usually standard search is:
            const searchUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20`;

            const response = await fetch(searchUrl, {
                headers: {
                    'User-Agent': 'FitnessApp/1.0 (com.fitnessapp; android)',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                console.warn(`FoodService: API returned ${response.status}`);
                return [];
            }

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (jsonError) {
                console.warn('FoodService: Failed to parse JSON', text.substring(0, 100));
                return [];
            }

            if (!data.products) return [];

            return data.products.map((item: any) => ({
                id: `off_${item.code}`,
                name: item.product_name || 'Unknown Food',
                brand: item.brands || '',
                calories: item.nutriments?.['energy-kcal_100g'] || item.nutriments?.['energy-kcal'] || 0,
                protein: item.nutriments?.proteins_100g || item.nutriments?.proteins || item.nutriments?.protein_100g || 0,
                carbs: item.nutriments?.carbohydrates_100g || item.nutriments?.carbohydrates || 0,
                fat: item.nutriments?.fat_100g || item.nutriments?.fat || 0,
                serving_size: item.serving_size || '100g',
                image_url: item.image_front_small_url || item.image_url || null
            }));
        } catch (error) {
            console.error('FoodService Search Error:', error);
            return [];
        }
    }
};
