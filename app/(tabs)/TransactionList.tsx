import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Button, Modal, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'; 
import DateTimePicker from '@react-native-community/datetimepicker'; 

interface Transaction {
  id: string;
  amount: string;
  remarks: string;
  timestamp: string;
  type: 'income' | 'expense';
}

const TransactionListScreen: React.FC = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<'income' | 'expense' | 'all'>('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTransactions();
    });

    return unsubscribe;
  }, []);

  //Filtering and Calculation
  useEffect(() => {
    const filtered = filterTransactions();
    setFilteredTransactions(filtered);
    calculateTotals(filtered);
  }, [transactions, filterType, startDate, endDate]);

  //Fetch Transaction Details from local storage 
  const fetchTransactions = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem('transactions');
      if (storedTransactions) {
        let parsedTransactions: Transaction[] = JSON.parse(storedTransactions);
        setTransactions(parsedTransactions);
        calculateTotals(parsedTransactions);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  // Calculate Totals
  const calculateTotals = (filteredTransactions: Transaction[]) => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        income += parseFloat(transaction.amount);
      } else {
        expense += parseFloat(transaction.amount);
      }
    });
    setTotalIncome(income);
    setTotalExpense(expense);
  };

  // Handle deletion of Transactions
  const deleteTransaction = async (id: string) => {
    try {
      const updatedTransactions = transactions.filter((transaction) => transaction.id !== id);
      await AsyncStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      setTransactions(updatedTransactions);
      const filtered = filterTransactions();
      setFilteredTransactions(filtered);
      calculateTotals(filtered);
      Alert.alert('Success', 'Transaction deleted successfully.');
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      Alert.alert('Error', 'Failed to delete transaction.');
    }
  };

  // Handle Filtering Logic
  const filterTransactions = () => {
    let filtered = transactions;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((transaction) => transaction.type === filterType);
    }

    // Apply date range filter
    if (startDate && endDate) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.timestamp);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    return filtered;
  };

  const toggleFilterModal = () => {
    setFilterModalVisible(!filterModalVisible);
  };

  const showStartDatePickerModal = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatePickerModal = () => {
    setShowEndDatePicker(true);
  };

  const handleStartDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios'); // Close date picker on iOS
    setStartDate(currentDate);
  };

  const handleEndDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios'); // Close date picker on iOS
    setEndDate(currentDate);
  };

  const clearFilters = () => {
    setFilterType('all');
    setStartDate(null);
    setEndDate(null);
    setFilterModalVisible(false);
  };

  return (
    <View className="flex-1">
      <View className="bg-white p-4 border-b-2 border-gray-300">
        <TouchableOpacity className="flex-row items-center" onPress={toggleFilterModal}>
          <AntDesign name="filter" size={24} color="black" />
          <Text className="ml-2 font-semibold">Filter</Text>
        </TouchableOpacity>
      </View>

      <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <TouchableOpacity
        className="flex-1 justify-center items-center"
        onPress={() => setFilterModalVisible(false)}
      >
        <View className="bg-white p-4 rounded-lg w-3/4 items-center">
          <Text className="text-lg font-semibold mb-2">Filter Options:</Text>
          <View className="mb-2">
          <Button title="All Transactions" onPress={() => setFilterType('all')} />
          </View>
          <View className="mb-2">
          <Button title="Income Transactions" onPress={() => setFilterType('income')} />
          </View>
          <View className="mb-2">
          <Button title="Expense Transactions" onPress={() => setFilterType('expense')} />
          </View>

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              className="border-2 border-gray-300 rounded p-2 w-16 mr-2 mb-2"
              onPress={showStartDatePickerModal}
            >
              <Text>{startDate ? startDate.toDateString() : 'Select Start Date'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="border-2 border-gray-300 rounded p-2 w-16 mb-2"
              onPress={showEndDatePickerModal}
            >
              <Text>{endDate ? endDate.toDateString() : 'Select End Date'}</Text>
            </TouchableOpacity>
          </View>
          <View className="mb-2">
          {showStartDatePicker && (
            <DateTimePicker
              testID="startDateTimePicker"
              value={startDate || new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleStartDateChange}
              
            />
          )}
          </View>
          {showEndDatePicker && (
            <DateTimePicker
              testID="endDateTimePicker"
              value={endDate || new Date()}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={handleEndDateChange}
            />
          )}
          <View className='pt-12'>
          <Button title="Clear Filters" onPress={clearFilters} />
          </View>
          
        </View>
      </TouchableOpacity>
    </Modal>

      <View className="bg-gray-100 p-4 border-b-2 border-gray-300">
        <Text className="text-lg font-semibold">Summary:</Text>
        <Text>Total Income: {totalIncome}</Text>
        <Text>Total Expense: {totalExpense}</Text>
        <Text>Gross: {totalIncome - totalExpense}</Text>
      </View>

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="border-b-2 border-gray-300 p-4"
            onPress={() => {
              Alert.alert(
                'Delete Transaction',
                'Are you sure you want to delete this transaction?',
                [
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                  {
                    text: 'Delete',
                    onPress: () => deleteTransaction(item.id),
                    style: 'destructive',
                  },
                ],
                { cancelable: true }
              );
            }}
          >
            <View>
              <Text>Amount: {item.amount}</Text>
              <Text>Remarks: {item.remarks}</Text>
              <Text>Type: {item.type}</Text>
              <Text>Timestamp: {new Date(item.timestamp).toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TransactionListScreen;
