// src/screens/LobbyScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Sadece bu arayüzü ekle:
interface Props {
  navigation: any;
}

// export kısmını şöyle değiştir:
export const LobbyScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>DRAFT ARCHIVE</Text>
      <TouchableOpacity 
        style={styles.premiumButton} 
        onPress={() => navigation.navigate('Draft')}
      >
        <Text style={styles.buttonText}>DRAFT SALONU</Text>
      </TouchableOpacity>
    </View>
  );
};

// ... aşağısı (styles kısmı) aynen kalsın.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#D4AF37',
    fontSize: 40,
    fontWeight: '900',
    marginBottom: 50,
  },
  premiumButton: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#D4AF37',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
  },
  buttonText: {
    color: '#D4AF37',
    fontWeight: 'bold',
    fontSize: 18,
  }
});
