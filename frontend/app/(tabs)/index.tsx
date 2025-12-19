import { useEffect, useState } from 'react'; /*Import React hooks: 
1. useState: if you update a variable in computer, when the screen refreshes, the variable will be reset. 
useState let the changes to be like sticky notes that reminds the screen to stay updated.
2. useEffect: use to set conditions to apply effects. 
*/
import { Text, View, StyleSheet, ScrollView, Dimensions, StatusBar, TouchableOpacity, TextInput } from 'react-native'; /* Import React Native components
**View is like boxes or containers that can hold other components.
**StyleSheet is used to define styles for components (colours, sizes, positions, etc.).
**Dimensions is used to get the dimensions of the screen (width, height, etc.),NOT to define the size of elements.
**StatusBar is used to set the style of the status bar (light-content, dark-content, etc.). You can change how the time, battery bar, etc. looks like in the app using this.
**Touchable Opacity is button.
*/
import Animated, { LinearTransition, FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated'; // Import Reanimated components, basically the movements/transitions of the app.
import { useSafeAreaInsets } from 'react-native-safe-area-context'; /* Import SafeAreaInsets hook
Safe areas are area that won't be cut off by the phone's notches (like camera holes) or home indicators.
*/
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons icon library. Ionicons are small icons like search button.

const { width } = Dimensions.get('window');

// Mock Data
const MOCK_CURRENT = { temp: 29, condition: 'Partly Cloudy', high: 32, low: 24, location: 'Petaling Jaya, Kuala Lumpur' };
const MOCK_HOURLY = [
  { time: 'Now', temp: 28, icon: 'sunny' },
  { time: '3 PM', temp: 29, icon: 'partly-sunny' },
  { time: '4 PM', temp: 29, icon: 'cloudy' },
  { time: '5 PM', temp: 27, icon: 'rainy' },
  { time: '6 PM', temp: 26, icon: 'thunderstorm' },
];
const MOCK_DAILY = [
  { day: 'Today', high: 32, low: 24, icon: 'partly-sunny' },
  { day: 'Tue', high: 31, low: 25, icon: 'rainy' },
  { day: 'Wed', high: 30, low: 24, icon: 'thunderstorm' },
  { day: 'Thu', high: 32, low: 25, icon: 'sunny' },
  { day: 'Fri', high: 33, low: 26, icon: 'sunny' },
];

export default function HomeScreen() {
  const [moved, setMoved] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMoved(true);
      // Fade in dashboard shortly after the title moves
      setTimeout(() => setShowDashboard(true), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []); //<---empty list: run only once

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View
        style={[
          styles.headerContainer,
          {
            paddingTop: moved ? insets.top : 0,
            justifyContent: moved ? 'flex-start' : 'center',
            height: moved ? 'auto' : '100%',
          },
        ]}
      >
        {!isSearching && (
          <Animated.View layout={LinearTransition.springify()} exiting={FadeOut.duration(200)}>
            <Text style={[styles.titleText, { fontSize: moved ? 24 : 32 }]}>
              Hello Weather! ☀️
            </Text>
          </Animated.View>
        )}

        {showDashboard && !isSearching && (
          <Animated.View
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(200)}
            style={[styles.searchButton, { top: insets.top + (moved ? 10 : 0) }]}
          >
            <TouchableOpacity onPress={() => setIsSearching(true)}>
              <Ionicons name="search" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {isSearching && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={[styles.searchBarContainer, { top: insets.top + 5 }]}
          >
            <TextInput
              style={styles.searchInput}
              placeholder="Search city..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              autoFocus
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity onPress={() => {
              setIsSearching(false);
              setSearchText('');
            }}>
              <Ionicons name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {showDashboard && (
        <Animated.View
          entering={FadeInDown.duration(1000)}
          style={[styles.dashboardContainer, { paddingBottom: insets.bottom + 20 }]}
        >
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Text style={styles.locationText}>{MOCK_CURRENT.location}</Text>
              <Text style={styles.tempText}>{MOCK_CURRENT.temp}°</Text>
              <Text style={styles.conditionText}>{MOCK_CURRENT.condition}</Text>
              <View style={styles.highLowContainer}>
                <Text style={styles.highLowText}>H:{MOCK_CURRENT.high}°  L:{MOCK_CURRENT.low}°</Text>
              </View>
            </View>

            {/* Hourly Forecast */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Hourly Forecast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hourlyScroll}>
                {MOCK_HOURLY.map((item, index) => (
                  <View key={index} style={styles.hourlyItem}>
                    <Text style={styles.hourlyTime}>{item.time}</Text>
                    <Ionicons name={item.icon as any} size={24} color="#fff" style={styles.weatherIcon} />
                    <Text style={styles.hourlyTemp}>{item.temp}°</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Daily Forecast */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>5-Day Forecast</Text>
              <View style={styles.dailyList}>
                {MOCK_DAILY.map((item, index) => (
                  <View key={index} style={styles.dailyItem}>
                    <Text style={styles.dailyDay}>{item.day}</Text>
                    <Ionicons name={item.icon as any} size={20} color="#fff" />
                    <View style={styles.dailyTemps}>
                      <Text style={styles.dailyLow}>{item.low}°</Text>
                      <View style={styles.tempBar} />
                      <Text style={styles.dailyHigh}>{item.high}°</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4d8bd7', // Fallback
  },
  headerContainer: {
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
    minHeight: 60, // Ensure space for header elements
  },
  titleText: {
    color: '#fff',
    fontWeight: 'bold',
    marginVertical: 10,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  searchButton: {
    position: 'absolute',
    right: 20,
    padding: 5,
  },
  searchBarContainer: {
    position: 'absolute',
    width: '90%',
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  dashboardContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  locationText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  tempText: {
    color: '#fff',
    fontSize: 90,
    fontWeight: '200',
  },
  conditionText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 20,
    fontWeight: '500',
    marginTop: -10,
  },
  highLowContainer: {
    marginTop: 5,
  },
  highLowText: {
    color: '#fff',
    fontSize: 16,
  },
  sectionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 15,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  hourlyScroll: {
    marginHorizontal: -5,
  },
  hourlyItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    minWidth: 50,
  },
  hourlyTime: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  weatherIcon: {
    marginBottom: 8,
  },
  hourlyTemp: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dailyList: {
    gap: 15
  },
  dailyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyDay: {
    color: '#fff',
    width: 60,
    fontSize: 16,
    fontWeight: '500'
  },
  dailyTemps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 120, // ample space for numbers
    justifyContent: 'flex-end',
  },
  dailyLow: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  dailyHigh: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  tempBar: {
    height: 4,
    width: 40,
    backgroundColor: 'rgba(255,255,255,0.3)', // Simulated visual bar
    borderRadius: 2,
  }
});