import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { theme } from '../theme';
import { Typo } from './ui';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface MacroRingProps {
    radius?: number;
    stroke?: number;
    progress: number; // 0 to 1
    color?: string;
    label?: string;
    value?: string;
    suffix?: string;
}

export function MacroRing({
    radius = 60,
    stroke = 12,
    progress,
    color = theme.colors.primary,
    label,
    value,
    suffix
}: MacroRingProps) {
    const animatedValue = useRef(new Animated.Value(0)).current;

    // Geometry
    const innerRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * innerRadius;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: progress,
            duration: 1000,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        }).start();
    }, [progress]);

    // Interpolate dashoffset
    // strokeDashoffset = circumference * (1 - progress)
    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Svg height={radius * 2} width={radius * 2}>
                <G rotation="-90" origin={`${radius}, ${radius}`}>
                    {/* Background Circle */}
                    <Circle
                        cx={radius}
                        cy={radius}
                        r={innerRadius}
                        stroke={theme.colors.border}
                        strokeWidth={stroke}
                        fill="transparent"
                        strokeOpacity={0.3}
                    />
                    {/* Progress Circle */}
                    <AnimatedCircle
                        cx={radius}
                        cy={radius}
                        r={innerRadius}
                        stroke={color}
                        strokeWidth={stroke}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            {/* Inner Content */}
            <View style={{ position: 'absolute', alignItems: 'center' }}>
                {value && (
                    <Typo.Title style={{ fontSize: 24, fontWeight: '700' }}>
                        {value}
                    </Typo.Title>
                )}
                {suffix && (
                    <Typo.Body style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                        {suffix}
                    </Typo.Body>
                )}
                {label && (
                    <Typo.Body style={{ fontSize: 12, marginTop: 4 }}>
                        {label}
                    </Typo.Body>
                )}
            </View>
        </View>
    );
}
