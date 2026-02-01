import React from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { theme } from '../../theme';
import { Typo } from '../ui';

const { width } = Dimensions.get('window');

interface CalorieChartProps {
    data?: { value: number; label: string }[];
}

export function CalorieTrendChart({ data }: CalorieChartProps) {
    const chartData = data && data.length > 0 ? data : [{ value: 0, label: '-' }];

    return (
        <View style={{ backgroundColor: theme.colors.card, borderRadius: 24, padding: 16, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <View>
                    <Typo.Title>Calorie Intake</Typo.Title>
                    <Typo.Body style={{ fontSize: 12 }}>Last 7 Days</Typo.Body>
                </View>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary }} />
                    <Typo.Body style={{ fontSize: 10 }}>Good</Typo.Body>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.danger }} />
                    <Typo.Body style={{ fontSize: 10 }}>High</Typo.Body>
                </View>
            </View>

            <BarChart
                data={chartData}
                barWidth={22}
                noOfSections={3}
                barBorderRadius={4}
                frontColor={theme.colors.primary}
                yAxisTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
                xAxisColor="transparent"
                yAxisColor="transparent"
                rulesColor={theme.colors.border}
                rulesType="solid"
                width={width - 80}
                height={150}
                isAnimated
            />
        </View>
    );
}
