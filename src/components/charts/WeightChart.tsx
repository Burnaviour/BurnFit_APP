import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { theme } from '../../theme';
import { Typo } from '../ui';

const { width } = Dimensions.get('window');

interface WeightChartProps {
    data: { value: number; label: string }[];
}

export function WeightChart({ data }: WeightChartProps) {
    // Process data
    const chartData = data.length > 0 ? data.map(d => ({
        value: d.value,
        label: new Date(d.label).toLocaleDateString('en-US', { weekday: 'short' }),
        dataPointText: `${d.value}`
    })) : [{ value: 0, label: 'No Data' }];

    const latestWeight = data.length > 0 ? data[data.length - 1].value : 0;

    return (
        <View style={{ backgroundColor: theme.colors.card, borderRadius: 24, padding: 16, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <View>
                    <Typo.Title>Weight Trend</Typo.Title>
                    <Typo.Body style={{ fontSize: 12 }}>Last 7 Days</Typo.Body>
                </View>
                <Typo.Title style={{ color: theme.colors.primary, fontSize: 24 }}>
                    {latestWeight} <Typo.Body style={{ fontSize: 14 }}>kg</Typo.Body>
                </Typo.Title>
            </View>

            <LineChart
                data={chartData}
                areaChart
                curved
                color={theme.colors.primary}
                thickness={3}
                startFillColor={theme.colors.primary}
                endFillColor={theme.colors.primary}
                startOpacity={0.3}
                endOpacity={0.05}
                initialSpacing={10}
                noOfSections={4}
                yAxisTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
                xAxisLabelTextStyle={{ color: theme.colors.textSecondary, fontSize: 10 }}
                xAxisColor="transparent"
                yAxisColor="transparent"
                rulesColor={theme.colors.border}
                rulesType="dashed"
                width={width - 80} // Adjust for padding
                height={180}
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
                            <View
                                style={{
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
    );
}
