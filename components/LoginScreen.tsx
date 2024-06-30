import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

// Enable device Browser
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  // Start OAuthFlow
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  // Handle onPress 'Continue with Google' Button
  const onPress = React.useCallback(async () => {
    try {
      // Create Session Id to track user
      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/dashboard', { scheme: 'myapp' }),
      });

      // Set Session Id active
      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      } else {
        // Handled at root with _layout with SignedIn/SignedOut
      }
    } catch (err) {
      console.error('OAuth error', err);
    }
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      {/* White Layer*/}
      <View className="w-full h-full bg-white">
        {/* Cyan layer */}
        <View className="absolute top-[-10vh] left-[-40vw] w-[150%] h-[150%] bg-[#ceeeff] transform rotate-[-30deg] z-10" />
        {/* Blue layer */}
        <View className="absolute bottom-[-60vh] w-[150%] h-[150%] bg-[#019bfe] transform rotate-[60deg] z-20" />
        {/* Logo */}
        <View className="absolute top-[18vh] left-[15vw] z-30 scale-75">
          <Image
            source={require('../assets/images/logo.png')} // Adjust the path to your logo image
            className="w-64 h-64"
            resizeMode="contain"
          />
        </View>
        {/* Login Button */}
        <TouchableOpacity className="absolute bottom-[15%] self-center flex-row px-5 py-2 bg-white rounded-full shadow-md z-30" onPress={onPress}>
          <Image
            source={require('../assets/images/google-logo.png')}
            className="w-6 h-6 mr-6"
          />
          <Text className="text-lg font-bold text-gray-700">Continue with Google</Text>
        </TouchableOpacity>
        {/* Info Icon */}
        <TouchableOpacity className="absolute px-[85vw] py-[5vh] z-30 scale-50">
          <Image
            source={require('../assets/images/info-icon.png')} // Adjust the path to your info icon image
          />
        </TouchableOpacity>
        {/* Terms of Use */}
        <TouchableOpacity className="absolute bottom-[7vh] self-center z-30">
          <Text className="text-white underline underline-offset-8">Terms of Use</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

