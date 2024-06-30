import React, { useState } from 'react';
import { View, TextInput, Keyboard, Alert, TouchableWithoutFeedback, TouchableOpacity, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage


const TransactionFormScreen: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  const saveTransaction = async (transactionData: { amount: string; remarks: string; type: 'income' | 'expense' }) => {
    try {
      const timestamp = new Date().toISOString();
      const { amount, remarks, type } = transactionData;
      
      // Generate a unique ID for the transaction
      const id = amount+timestamp+remarks;
  
      // Construct transaction object with id
      const transaction = { id, amount, remarks, timestamp, type };
  
      // Save transaction to AsyncStorage
      const storedTransactions = await AsyncStorage.getItem('transactions');
      const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
      transactions.push(transaction);
      await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
  
      console.log('Transaction saved successfully:', transaction);
      return true;
    } catch (error) {
      console.error('Failed to save transaction:', error);
      return false;
    }
  };

  // Handle Save on button press
  const handleSave = async (type: 'income' | 'expense') => {
    if (!amount.trim()) {
      Alert.alert('Error', 'Please enter an amount.');
      return;
    }

    const transactionData = { amount, remarks, type };
    // Call save function
    const success = await saveTransaction(transactionData);

    if (success) {
      setAmount('');
      setRemarks('');
      Keyboard.dismiss();
      console.log('Transaction saved successfully.');
    } else {
      Alert.alert('Error', 'Failed to save transaction.');
    }
  };

  return (
    // Dismiss keyboard on pressing outside the component
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 justify-center items-center ">
        <TextInput
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={(text) => setAmount(text)}
          className="border-2 rounded-lg p-3 mb-4 w-80 text-center"
        />
        <TextInput
          placeholder="Enter remarks"
          value={remarks}
          onChangeText={(text) => setRemarks(text)}
          className="border-2 rounded-lg p-3 mb-4 w-80 text-center"
        />
        <View className="flex-row justify-around w-64">
          <TouchableOpacity
            className="bg-blue-500 rounded-lg py-3 px-6"
            onPress={() => handleSave('expense')}
          >
            <Text className="text-white">Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-green-500 rounded-lg py-3 px-6"
            onPress={() => handleSave('income')}
          >
            <Text className="text-white">Income</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TransactionFormScreen;
