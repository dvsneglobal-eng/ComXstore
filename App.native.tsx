
import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * Expo Native Wrapper for WhatsStore
 * This file serves as the entry point when running in Expo Go.
 * It points to the hosted Firebase URL of the web app.
 */

// Replace this with your actual Firebase Hosting URL once deployed
const WEB_APP_URL = 'https://whats-store-platform.web.app'; 

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <SafeAreaView style={styles.safeArea}>
        <WebView 
          source={{ uri: WEB_APP_URL }}
          style={styles.webview}
          // Allows WhatsApp deep links to open the native WhatsApp app
          originWhitelist={['*']}
          onShouldStartLoadWithRequest={(request) => {
            if (request.url.startsWith('https://wa.me') || request.url.startsWith('whatsapp:')) {
              return false; // Let the OS handle the deep link
            }
            return true;
          }}
          // Optimization settings for mobile
          allowsBackForwardNavigationGestures={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          startInLoadingState={true}
          renderLoading={() => <View style={styles.loadingPlaceholder} />}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
  },
  loadingPlaceholder: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#ffffff',
  },
});
