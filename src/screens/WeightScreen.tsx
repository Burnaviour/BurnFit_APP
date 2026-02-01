import React, { useState } from 'react';
import { ScrollView, View, TouchableOpacity, Dimensions } from 'react-native';
import { ScreenWrapper, Typo, Card, GlassCard } from '../components/ui';
import { theme } from '../theme';
import { useFitnessStore } from '../store';
import { LineChart } from 'react-native-gifted-charts';
import { ChevronLeft, Share2, Plus, Trash2, ZoomIn } from 'lucide-react-native';
import { InputModal } from '../components/InputModal';

const { width } = Dimensions.get('window');

export default function WeightScreen({ navigation }: any) {
    const { weightHistory, userHeight, addWeight } = useFitnessStore();
    const [modalVisible, setModalVisible] = useState(false);

    // Get current weight (latest entry)
    const currentWeightEntry = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1] : null;
    const currentWeight = currentWeightEntry?.weight || 0;
    const previousWeight = weightHistory.length > 1 ? weightHistory[weightHistory.length - 2].weight : currentWeight;
    const weightDiff = currentWeight - previousWeight;

    // BMI Calculation
    // BMI = weight (kg) / (height (m) * height (m))
    const calculateBMI = (weight: number, heightCm: number) => {
        if (!weight || !heightCm) return { value: 0, status: 'Unknown', color: theme.colors.textSecondary };
        const heightM = heightCm / 100;
        const bmi = weight / (heightM * heightM);

        let status = 'Normal';
        let color = theme.colors.primary; // Greenish

        if (bmi < 18.5) { status = 'Underweight'; color = theme.colors.accent; } // Blueish
        else if (bmi >= 25 && bmi < 30) { status = 'Overweight'; color = theme.colors.secondary; } // Orange/Yellow
        else if (bmi >= 30) { status = 'Obese'; color = theme.colors.danger; } // Red

        return { value: bmi.toFixed(1), status, color };
    };

    const bmiData = calculateBMI(currentWeight, userHeight || 175);

    // Chart Data
    const chartData = weightHistory.map(w => ({
        value: w.weight,
        label: new Date(w.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        dataPointText: `${w.weight}`,
        hideDataPoint: false,
    }));

    const handleSaveWeight = async (weight: number) => {
        await addWeight(weight, new Date().toISOString().split('T')[0]);
        setModalVisible(false);
    };

    return (
        <ScreenWrapper>
            <InputModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleSaveWeight}
                title="Log Weight"
                unit="kg"
                placeholder={`${currentWeight || 70}`}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Navigation */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
                        <ChevronLeft color={theme.colors.text} size={24} />
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Typo.Title>My Weight</Typo.Title>
                        <Typo.Body style={{ fontSize: 12 }}>{new Date().toLocaleDateString()}</Typo.Body>
                    </View>
                    <TouchableOpacity style={{ padding: 8 }}>
                        <Share2 color={theme.colors.text} size={24} />
                    </TouchableOpacity>
                </View>

                {/* Main Weight Display */}
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <Typo.Header style={{ fontSize: 64, lineHeight: 70 }}>
                        {currentWeight}
                        <Typo.Title style={{ fontSize: 24, color: theme.colors.textSecondary }}> kg</Typo.Title>
                    </Typo.Header>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: -10 }}>
                        <Typo.Body style={{ fontSize: 16 }}>BMI {bmiData.value}</Typo.Body>
                        <View style={{ paddingHorizontal: 8, paddingVertical: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
                            <Typo.Body style={{ fontSize: 12, color: bmiData.color }}>{bmiData.status}</Typo.Body>
                        </View>
                    </View>
                </View>

                {/* Chart Section */}
                <View style={{ height: 250, marginBottom: 20 }}>
                    <LineChart
                        data={chartData.length > 0 ? chartData : [{ value: 0 }]}
                        areaChart
                        curved
                        color={bmiData.color}
                        startFillColor={bmiData.color}
                        endFillColor={bmiData.color}
                        startOpacity={0.2}
                        endOpacity={0.0}
                        thickness={2}
                        hideRules
                        hideAxesAndRules
                        yAxisColor="transparent"
                        xAxisColor="transparent"
                        width={width}
                        height={200}
                        pointerConfig={{
                            pointerStripHeight: 160,
                            pointerStripColor: theme.colors.textSecondary,
                            pointerStripWidth: 2,
                            pointerColor: theme.colors.textSecondary,
                            radius: 6,
                            pointerLabelWidth: 100,
                            pointerLabelHeight: 90,
                            activatePointersOnLongPress: true,
                            autoAdjustPointerLabelPosition: false,
                            pointerLabelComponent: (items: any) => {
                                return (
                                    <View style={{
                                        height: 90,
                                        width: 100,
                                        justifyContent: 'center',
                                        marginTop: -30,
                                        marginLeft: -40,
                                    }}>
                                        <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: 'white' }}>
                                            <Typo.Title style={{ color: 'black', fontSize: 14, textAlign: 'center' }}>
                                                {items[0].value} kg
                                            </Typo.Title>
                                        </View>
                                    </View>
                                );
                            },
                        }}
                    />
                </View>

                {/* Recent Changes Card */}
                <Card>
                    <Typo.Title style={{ marginBottom: 16 }}>Recent weight changes</Typo.Title>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Typo.Title style={{ fontSize: 24, color: weightDiff <= 0 ? theme.colors.primary : theme.colors.danger }}>
                                {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)} <Typo.Body style={{ fontSize: 14 }}>kg</Typo.Body>
                            </Typo.Title>
                            <Typo.Body style={{ fontSize: 12 }}>Since last entry</Typo.Body>
                        </View>
                        {/* Placeholder for long term comparison if data exists */}
                        <View>
                            <Typo.Title style={{ fontSize: 24, color: theme.colors.primary }}>
                                {currentWeight} <Typo.Body style={{ fontSize: 14 }}>kg</Typo.Body>
                            </Typo.Title>
                            <Typo.Body style={{ fontSize: 12 }}>Current</Typo.Body>
                        </View>
                    </View>
                </Card>

                {/* Comparison Card (Placeholder logic) */}
                <Card>
                    <Typo.Title style={{ marginBottom: 8 }}>Compared with similar users</Typo.Title>
                    <Typo.Body style={{ fontSize: 12, marginBottom: 20 }}>Compared with users of the same height and age</Typo.Body>

                    <View style={{ alignItems: 'center' }}>
                        <Typo.Title style={{ color: theme.colors.primary, marginBottom: 10 }}>
                            99% <Typo.Body>of people are lighter than me</Typo.Body>
                        </Typo.Title>
                        {/* Simplified distribution curve shape using View/BorderRadius tricks or SVG would go here. 
                            For now, just a bar representation */}
                        <View style={{ width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                            <View style={{ width: '90%', height: '100%', backgroundColor: theme.colors.primary, borderRadius: 2 }} />
                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                            <Typo.Body style={{ fontSize: 10 }}>Lighter</Typo.Body>
                            <Typo.Body style={{ fontSize: 10 }}>Heavier</Typo.Body>
                        </View>
                    </View>
                </Card>

                {/* Bottom Actions */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20, marginBottom: 40 }}>
                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: theme.colors.card, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                            <ZoomIn color={theme.colors.text} size={24} />
                        </View>
                        <Typo.Body style={{ fontSize: 12 }}>Zoom out</Typo.Body>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => setModalVisible(true)}>
                        <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                            <Plus color={'white'} size={32} />
                        </View>
                        <Typo.Body style={{ fontSize: 12 }}>Add weight</Typo.Body>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignItems: 'center' }}>
                        <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: theme.colors.card, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                            <Trash2 color={theme.colors.text} size={24} />
                        </View>
                        <Typo.Body style={{ fontSize: 12 }}>Delete</Typo.Body>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </ScreenWrapper>
    );
}
