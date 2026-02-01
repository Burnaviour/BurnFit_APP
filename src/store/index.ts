import { create } from 'zustand';
import { getDB } from '../db';
import { WeightEntry, ActivityLog, DailyLog } from '../db/types';

interface FitnessState {
    // Data
    weightHistory: WeightEntry[];
    activityLogs: ActivityLog[];
    todayStats: {
        caloriesBurned: number;
        steps: number;
        weight: number | null;
    };
    userHeight: number | null;

    // Actions
    fetchData: () => Promise<void>;
    addWeight: (weight: number, date: string) => Promise<void>;
    addActivity: (calories: number, steps: number, date: string) => Promise<void>;
}

export const useFitnessStore = create<FitnessState>((set, get) => ({
    weightHistory: [],
    activityLogs: [],
    todayStats: {
        caloriesBurned: 0,
        steps: 0,
        weight: null,
    },
    userHeight: 175, // Default backup

    fetchData: async () => {
        try {
            const db = await getDB();
            const today = new Date().toISOString().split('T')[0];

            // Fetch User Profile
            const [profileRes] = await db.executeSql('SELECT height_cm FROM user_profile WHERE id = 1');
            const height = profileRes.rows.item(0)?.height_cm || 175;

            // Fetch Weight History
            const [weightRes] = await db.executeSql('SELECT * FROM weight_history ORDER BY date DESC LIMIT 7');
            const weightHistory: WeightEntry[] = [];
            for (let i = 0; i < weightRes.rows.length; i++) {
                weightHistory.push(weightRes.rows.item(i));
            }

            // Fetch Today's Activity
            const [activityRes] = await db.executeSql(
                'SELECT SUM(calories_burned) as calories, SUM(steps) as steps FROM activity_logs WHERE date = ?',
                [today]
            );

            const currentWeight = weightHistory.find(w => w.date === today)?.weight || weightHistory[0]?.weight || null;

            set({
                weightHistory: weightHistory.reverse(), // For chart (oldest to newest)
                userHeight: height,
                todayStats: {
                    caloriesBurned: activityRes.rows.item(0).calories || 0,
                    steps: activityRes.rows.item(0).steps || 0,
                    weight: currentWeight,
                }
            });

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    },

    addWeight: async (weight: number, date: string) => {
        try {
            const db = await getDB();
            // Check if entry exists for today
            const [existing] = await db.executeSql('SELECT id FROM weight_history WHERE date = ?', [date]);

            if (existing.rows.length > 0) {
                await db.executeSql('UPDATE weight_history SET weight = ? WHERE date = ?', [weight, date]);
            } else {
                await db.executeSql('INSERT INTO weight_history (weight, date) VALUES (?, ?)', [weight, date]);
            }

            await get().fetchData();
        } catch (error) {
            console.error('Failed to add weight:', error);
        }
    },

    addActivity: async (calories: number, steps: number, date: string) => {
        try {
            const db = await getDB();
            await db.executeSql(
                'INSERT INTO activity_logs (calories_burned, steps, date) VALUES (?, ?, ?)',
                [calories, steps, date]
            );
            await get().fetchData();
        } catch (error) {
            console.error('Failed to add activity:', error);
        }
    },
}));
