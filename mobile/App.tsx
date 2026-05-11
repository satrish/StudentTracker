import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './src/screens/LoginScreen';
import TrackerScreen from './src/screens/TrackerScreen';
import SportsTrackerScreen from './src/screens/SportsTrackerScreen';
import MonthlyDashboardScreen from './src/screens/MonthlyDashboardScreen';
import type { Mode } from './src/types';

type Tab = 'tracker' | 'monthly';

export default function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('kids');
  const [tab, setTab] = useState<Tab>('tracker');
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('kdt_user').then((u) => {
      if (u) setUsername(u);
      setAuthLoaded(true);
    });
  }, []);

  const handleLogin = async (user: string) => {
    await AsyncStorage.setItem('kdt_user', user);
    setUsername(user);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('kdt_user');
    setUsername(null);
    setMode('kids');
    setTab('tracker');
  };

  const switchMode = () => {
    setMode((m) => (m === 'kids' ? 'sports' : 'kids'));
    setTab('tracker');
  };

  if (!authLoaded) return null;

  if (!username) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#4C1D95" />
        <LoginScreen onLogin={handleLogin} />
      </SafeAreaProvider>
    );
  }

  const isKids = mode === 'kids';
  const primaryColor = isKids ? '#4C1D95' : '#065F46';
  const activeTabColor = isKids ? '#F59E0B' : '#10B981';
  const inactiveTabColor = isKids ? '#C4B5FD' : '#6EE7B7';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={primaryColor} />

      <View style={styles.container}>
        {/* Screen content */}
        <View style={styles.content}>
          {tab === 'tracker' ? (
            isKids ? (
              <TrackerScreen
                username={username}
                onLogout={handleLogout}
                onSwitchMode={switchMode}
              />
            ) : (
              <SportsTrackerScreen
                username={username}
                onLogout={handleLogout}
                onSwitchMode={switchMode}
              />
            )
          ) : (
            <MonthlyDashboardScreen
              username={isKids ? username : `${username}_sports`}
            />
          )}
        </View>

        {/* Bottom tab bar */}
        <View style={[styles.tabBar, { backgroundColor: primaryColor, borderTopColor: isKids ? '#5B21B6' : '#047857' }]}>
          <TouchableOpacity style={styles.tabItem} onPress={() => setTab('tracker')}>
            <Text style={{ fontSize: 20, color: tab === 'tracker' ? activeTabColor : inactiveTabColor }}>
              {isKids ? '⭐' : '🏏'}
            </Text>
            <Text style={[styles.tabLabel, { color: tab === 'tracker' ? activeTabColor : inactiveTabColor }]}>
              {isKids ? 'Tracker' : 'Training'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => setTab('monthly')}>
            <Text style={{ fontSize: 20, color: tab === 'monthly' ? activeTabColor : inactiveTabColor }}>
              📅
            </Text>
            <Text style={[styles.tabLabel, { color: tab === 'monthly' ? activeTabColor : inactiveTabColor }]}>
              Monthly
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
