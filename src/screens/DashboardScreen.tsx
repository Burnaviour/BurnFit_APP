import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, RefreshControl, StatusBar, TouchableOpacity } from 'react-native';
import { ScreenWrapper, Typo, Card, GlassCard } from '../components/ui';
import { RefreshCcw, Plus, Flame, Footprints } from 'lucide-react-native';
import { MacroRing } from '../components/MacroRing';
import { WeightChart } from '../components/charts/WeightChart';
import { CalorieTrendChart } from '../components/charts/CalorieTrendChart';
import { theme } from '../theme';
import { useFitnessStore } from '../store';
import { InputModal } from '../components/InputModal';

export default function DashboardScreen({ navigation }: any) {
    const { todayStats, weightHistory, activityLogs, fetchData, addWeight, addActivity } = useFitnessStore();
    const [refreshing, setRefreshing] = useState(false);
    const [weightModalVisible, setWeightModalVisible] = useState(false);
    const [activityModalVisible, setActivityModalVisible] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    // Derived Data
    const goalCalories = 2000;
    const remaining = goalCalories - (todayStats.caloriesBurned || 0); // Simplified logic: Goal - Burned? Or Goal - Eaten + Burned?
    // Let's assume remaining calls is for intake: Goal - Eaten (TODO: Add Eaten logic)
    // For now, let's use the ring for "Calories Burned" vs "Goal" to keep it consistent with "Activity Status"
    // OR: "Kcal Left" implies Intake. Let's fix the logic later when Food log is ready.
    // For now: value={todayStats.caloriesBurned} label="Burned"

    // Placeholder food data (until Food Log is implemented)
    const foodData = {
        calories: 1500,
        protein: 120,
        carbs: 150,
        fat: 50
    };

    const handleSaveWeight = async (weight: number) => {
        await addWeight(weight, new Date().toISOString().split('T')[0]);
        setWeightModalVisible(false);
    };

    const handleSaveActivity = async (calories: number) => {
        // Simple manual add: just calories for now, steps optional or 0
        await addActivity(calories, 0, new Date().toISOString().split('T')[0]);
        setActivityModalVisible(false);
    };

    return (
        <ScreenWrapper>
            <StatusBar barStyle="light-content" />
            <InputModal
                visible={weightModalVisible}
                onClose={() => setWeightModalVisible(false)}
                onSubmit={handleSaveWeight}
                title="Log Weight"
                unit="kg"
                placeholder="70.0"
            />
            <InputModal
                visible={activityModalVisible}
                onClose={() => setActivityModalVisible(false)}
                onSubmit={handleSaveActivity}
                title="Log Activity"
                unit="kcal"
                placeholder="300"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <View>
                        <Typo.Body>Welcome Back,</Typo.Body>
                        <Typo.Header>Daily Insight</Typo.Header>
                    </View>
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: 8, borderRadius: 50 }}>
                        <RefreshCcw color={theme.colors.textSecondary} size={20} onPress={onRefresh} />
                    </View>
                </View>

                {/* Hero Ring: Calories */}
                <GlassCard style={{ alignItems: 'center', paddingVertical: 32, marginBottom: 24, borderRadius: 32 }}>
                    <MacroRing
                        radius={100}
                        stroke={18}
                        progress={(todayStats.caloriesBurned || 0) / goalCalories}
                        color={theme.colors.primary}
                        value={`${Math.round(remaining)}`}
                        label="Kcal Remaining"
                    />

                    <View style={{ flexDirection: 'row', marginTop: 24, width: '100%', justifyContent: 'space-around' }}>
                        <View style={{ alignItems: 'center' }}>
                            <Typo.Body style={{ fontSize: 12 }}>Eaten</Typo.Body>
                            <Typo.Title style={{ fontSize: 18 }}>{Math.round(foodData.calories)}</Typo.Title>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Typo.Body style={{ fontSize: 12 }}>Burned</Typo.Body>
                            <Typo.Title style={{ fontSize: 18, color: theme.colors.accent }}>{todayStats.caloriesBurned}</Typo.Title>
                        </View>
                    </View>
                </GlassCard>

                {/* Macros Row */}
                <Typo.Title style={{ marginBottom: 16 }}>Macronutrients</Typo.Title>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
                    {/* Protein */}
                    <GlassCard style={{ flex: 1, alignItems: 'center', marginRight: 8, paddingVertical: 16, borderRadius: 24 }}>
                        <MacroRing radius={30} stroke={6} progress={0.5} color={theme.colors.secondary} />
                        <View style={{ marginTop: 8, alignItems: 'center' }}>
                            <Typo.Title style={{ fontSize: 14 }}>{Math.round(foodData.protein)}g</Typo.Title>
                            <Typo.Body style={{ fontSize: 12 }}>Protein</Typo.Body>
                        </View>
                    </GlassCard>

                    {/* Carbs */}
                    <GlassCard style={{ flex: 1, alignItems: 'center', marginHorizontal: 4, paddingVertical: 16, borderRadius: 24 }}>
                        <MacroRing radius={30} stroke={6} progress={0.6} color={theme.colors.accent} />
                        <View style={{ marginTop: 8, alignItems: 'center' }}>
                            <Typo.Title style={{ fontSize: 14 }}>{Math.round(foodData.carbs)}g</Typo.Title>
                            <Typo.Body style={{ fontSize: 12 }}>Carbs</Typo.Body>
                        </View>
                    </GlassCard>

                    {/* Fat */}
                    <GlassCard style={{ flex: 1, alignItems: 'center', marginLeft: 8, paddingVertical: 16, borderRadius: 24 }}>
                        <MacroRing radius={30} stroke={6} progress={0.3} color={theme.colors.danger} />
                        <View style={{ marginTop: 8, alignItems: 'center' }}>
                            <Typo.Title style={{ fontSize: 14 }}>{Math.round(foodData.fat)}g</Typo.Title>
                            <Typo.Body style={{ fontSize: 12 }}>Fat</Typo.Body>
                        </View>
                    </GlassCard>
                </View>

                {/* Quick Actions */}
                <View style={{ marginBottom: 20 }}>
                    <Card style={{ padding: 16, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)', padding: 10, borderRadius: 50 }}>
                                <Plus color={theme.colors.secondary} size={24} />
                            </View>
                            <View>
                                <Typo.Title style={{ fontSize: 16 }}>Track Food</Typo.Title>
                                <Typo.Body style={{ fontSize: 12 }}>Log your next meal</Typo.Body>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('Tabs', { screen: 'Food' })}>
                            <Typo.Title style={{ fontSize: 14, color: theme.colors.primary }}>Add +</Typo.Title>
                        </TouchableOpacity>
                    </Card>
                </View>

                {/* Charts Area */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Weight')}>
                        <Typo.Title>Weight Chart</Typo.Title>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setWeightModalVisible(true)}>
                        <Typo.Body style={{ color: theme.colors.primary }}>+ Log Weight</Typo.Body>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Weight')}>
                    <WeightChart data={weightHistory.map(w => ({ value: w.weight, label: w.date }))} />
                </TouchableOpacity>

                <Typo.Title style={{ marginBottom: 16 }}>Calorie Trend</Typo.Title>
                <CalorieTrendChart data={[]} />

                {/* Activity Overview */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                    <Typo.Title>Activity Status</Typo.Title>
                    <TouchableOpacity onPress={() => setActivityModalVisible(true)}>
                        <Typo.Body style={{ color: theme.colors.primary }}>+ Log Activity</Typo.Body>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Card style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={{ padding: 10, backgroundColor: 'rgba(255, 78, 78, 0.1)', borderRadius: 50 }}>
                            <Flame color={theme.colors.secondary} size={24} />
                        </View>
                        <View>
                            <Typo.Body>Burned</Typo.Body>
                            <Typo.Title>{todayStats.caloriesBurned} <Typo.Body style={{ fontSize: 12 }}>kCal</Typo.Body></Typo.Title>
                        </View>
                    </Card>
                    <Card style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={{ padding: 10, backgroundColor: 'rgba(78, 255, 136, 0.1)', borderRadius: 50 }}>
                            <Footprints color={theme.colors.accent} size={24} />
                        </View>
                        <View>
                            <Typo.Body>Steps</Typo.Body>
                            <Typo.Title>{todayStats.steps}</Typo.Title>
                        </View>
                    </Card>
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
}
