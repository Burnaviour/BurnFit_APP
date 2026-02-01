import React, { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Home, Search, Calendar, User } from 'lucide-react-native';

import { theme } from './theme';
import { initDatabase } from './db';
import { seedFoods } from './db/seed';
import { SplashScreen } from './components/SplashScreen';

// Screens
import DashboardScreen from './screens/DashboardScreen';
import FoodSearchScreen from './screens/FoodSearchScreen';
import DailyLogScreen from './screens/DailyLogScreen';
import SettingsScreen from './screens/SettingsScreen';
import WeightScreen from './screens/WeightScreen';

// Types
type RootStackParamList = {
    Tabs: undefined;
    AddFood: undefined;
    Weight: undefined;
};

type TabParamList = {
    Dashboard: undefined;
    Food: undefined;
    Diary: undefined;
    Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.card,
                    borderTopColor: theme.colors.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                    tabBarLabel: "Overview"
                }}
            />
            <Tab.Screen
                name="Diary"
                component={DailyLogScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
                    tabBarLabel: "Diary"
                }}
            />
            <Tab.Screen
                name="Food"
                component={FoodSearchScreen}
                options={{
                    tabBarLabel: "Find Food",
                    tabBarButton: () => null,
                    tabBarItemStyle: { display: 'none' }
                }}
            />

            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                    tabBarLabel: "Profile"
                }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                console.log("App: Initializing database...");
                await initDatabase();
                console.log("App: Database initialized.");

                // Seeding disabled per user request
                // console.log("App: Starting seed...");
                // seedFoods().catch(e => console.error("App: Seeding failed:", e));
            } catch (e) {
                console.error("App: Init Error:", e);
            } finally {
                setIsReady(true);
            }
        };

        init();
    }, []);

    const appTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            background: theme.colors.background,
            card: theme.colors.card,
            text: theme.colors.text,
            border: theme.colors.border,
            primary: theme.colors.primary,
        }
    };

    if (!isReady) {
        return <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />;
    }

    return (
        <SafeAreaProvider>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
            <NavigationContainer theme={appTheme}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Tabs" component={TabNavigator} />
                    <Stack.Screen
                        name="AddFood"
                        component={FoodSearchScreen}
                        options={{ presentation: 'modal', headerShown: false }}
                    />
                    <Stack.Screen name="Weight" component={WeightScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
