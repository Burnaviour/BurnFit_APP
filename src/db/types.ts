export interface Product {
    id: string; // Barcode or UUID
    name: string;
    brand?: string;
    serving_size?: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    search_terms?: string;
    image_url?: string;
}

export interface DailyLog {
    id: number;
    date: string; // ISO 8601 YYYY-MM-DD
    product_id?: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    amount_g: number;
    timestamp: number;
}

export interface UserProfile {
    id: number;
    weight_kg: number;
    height_cm: number;
    age: number;
    gender: 'male' | 'female' | 'other';
    activity_level: string;
    goal_calories: number;
    goal_protein: number;
    goal_carbs: number;
    goal_fat: number;
}

export interface WeightEntry {
    id: number;
    weight: number;
    date: string; // ISO 8601 YYYY-MM-DD
}

export interface ActivityLog {
    id: number;
    calories_burned: number;
    steps: number;
    date: string; // ISO 8601 YYYY-MM-DD
}
