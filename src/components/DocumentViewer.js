// DocumentViewer.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function DocumentViewer({ route }) {
  const { uri, fileType } = route.params;

  return (
    <View style={styles.container}>
      {fileType === 'pdf' ? (
        // PDF Viewer
        <Pdf
          source={{ uri }}
          style={styles.pdf}
          onError={(error) => {
            console.log('PDF load error:', error);
          }}
        />
      ) : (
        // WebView for DOC, DOCX, and TXT files
        <WebView
          source={{ uri }}
          style={styles.webView}
          originWhitelist={['*']}
          startInLoadingState={true}
          renderError={() => (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load document.</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webView: {
    flex: 1,
    width: '100%',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
