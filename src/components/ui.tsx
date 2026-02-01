import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

export const Card = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
    <View style={[styles.card, style]}>{children}</View>
);

export const GlassCard = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
    <BlurView intensity={20} tint="dark" style={[styles.glassCard, style]}>
        {children}
    </BlurView>
);

export const ScreenWrapper = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
    <LinearGradient
        colors={[theme.colors.background, '#1a1a1a']}
        style={{ flex: 1 }}
    >
        <SafeAreaView style={[styles.screen, style]} edges={['top', 'left', 'right']}>
            {children}
        </SafeAreaView>
    </LinearGradient>
);

export const Typo = {
    Header: ({ children, style, numberOfLines }: { children: React.ReactNode; style?: TextStyle; numberOfLines?: number }) => (
        <Text style={[theme.typography.header, style]} numberOfLines={numberOfLines}>{children}</Text>
    ),
    Title: ({ children, style, numberOfLines }: { children: React.ReactNode; style?: TextStyle; numberOfLines?: number }) => (
        <Text style={[theme.typography.title, style]} numberOfLines={numberOfLines}>{children}</Text>
    ),
    Body: ({ children, style, numberOfLines }: { children: React.ReactNode; style?: TextStyle; numberOfLines?: number }) => (
        <Text style={[theme.typography.body, style]} numberOfLines={numberOfLines}>{children}</Text>
    ),
};

export const Button = ({ title, onPress, variant = 'primary' }: { title: string; onPress: () => void; variant?: 'primary' | 'secondary' }) => (
    <TouchableOpacity
        style={[styles.button, { backgroundColor: variant === 'primary' ? theme.colors.primary : 'rgba(255,255,255,0.1)' }]}
        onPress={() => {
            Haptics.selectionAsync();
            onPress();
        }}
    >
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.m,
    },
    glassCard: {
        backgroundColor: 'rgba(28, 28, 30, 0.6)',
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.m,
        marginBottom: theme.spacing.m,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)'
    },
    screen: {
        flex: 1,
        padding: theme.spacing.m,
    },
    button: {
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        alignItems: 'center',
    },
    buttonText: {
        color: theme.colors.text,
        fontWeight: '600',
        fontSize: 16,
    }
});
