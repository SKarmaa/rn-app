import React from 'react';
import { View, Text, Image } from 'react-native';
import { useUser } from "@clerk/clerk-expo";

const HomeScreen = () => {
  // Fetch User Data using useUser
  const { isLoaded, isSignedIn, user } = useUser();
  const userName = user?.fullName;
  const userEmail = user?.primaryEmailAddress?.toString();
  const phoneNumber = user?.primaryPhoneNumber?.toString();
  const userImage = user?.imageUrl;

  // If user data is not loaded or user is not signed in, return null
  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <View className={`flex-1 items-center`}>
      <View className="flex-row bg-white rounded-lg p-2 mt-2 mb-4 h-[78vh] w-[95vw] bg-cyan-200">
        <View className="w-24 h-24 rounded-full overflow-hidden">
          <Image
            source={{ uri: userImage }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="ml-5 mt-4">
          <Text className="text-xl mb-1 font-bold">{userName}</Text>
          <Text className="text-base mb-1">{userEmail}</Text>
          {phoneNumber && (
            <Text className="text-base mb-1">Phone: {phoneNumber}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;