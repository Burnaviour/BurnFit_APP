import {
    initialize,
    requestPermission,
    readRecords,
    ReadRecordsOptions,
} from 'react-native-health-connect';

export interface HealthData {
    steps: number;
    calories: number;
}

export const HealthService = {
    async init() {
        try {
            const isInitialized = await initialize();
            return isInitialized;
        } catch (error) {
            console.error('Health Connect Init Error:', error);
            return false;
        }
    },

    async requestPermissions() {
        try {
            await requestPermission([
                { accessType: 'read', recordType: 'Steps' },
                { accessType: 'read', recordType: 'TotalCaloriesBurned' },
                { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
            ]);
            return true;
        } catch (error) {
            console.error('Permission Request Error:', error);
            return false;
        }
    },

    async getDailyStats(date: Date): Promise<HealthData> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const timeRangeFilter = {
            operator: 'between',
            startTime: startOfDay.toISOString(),
            endTime: endOfDay.toISOString(),
        } as const;

        // Steps
        const stepsRes = await readRecords('Steps', { timeRangeFilter });
        const totalSteps = stepsRes.reduce((acc, record) => acc + record.count, 0);

        // Total Calories (BMR + Active)
        // Note: Health Connect might split these. We'll try fetching Total first.
        const activeCalRes = await readRecords('ActiveCaloriesBurned', { timeRangeFilter });
        const totalActiveCal = activeCalRes.reduce((acc, record) => acc + record.energy.inKilocalories, 0);

        return {
            steps: totalSteps,
            calories: Math.round(totalActiveCal),
        };
    },
};
