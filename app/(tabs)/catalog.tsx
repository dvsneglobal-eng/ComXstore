
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { apiService } from '../../services/api';
import { Product } from '../../types';
import { router, useLocalSearchParams } from 'expo-router';
import { Search, ShoppingBag } from 'lucide-react-native';
import { formatCurrency } from '../../utils/formatters';

const CATEGORIES = ['All', 'Shoes', 'Style', 'Beauty', 'Tech'];

export default function Catalog() {
  const params = useLocalSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(params.category || 'All');

  useEffect(() => {
    apiService.fetchProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCat !== 'All') {
      result = result.filter(p => p.category === selectedCat);
    }
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(result);
  }, [products, selectedCat, search]);

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/product/${item.id}`)}
      className="flex-1 m-2 bg-white rounded-[24px] border border-slate-100 overflow-hidden shadow-sm"
    >
      <Image source={{ uri: item.image_url }} className="w-full aspect-square" />
      <View className="p-4">
        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.category}</Text>
        <Text className="font-bold text-slate-900 text-sm mb-2" numberOfLines={1}>{item.name}</Text>
        <Text className="text-lg font-black text-slate-900">{formatCurrency(item.price)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4">
        <Text className="text-3xl font-black text-slate-900 tracking-tight">Catalog</Text>
        
        {/* Search */}
        <View className="mt-6 flex-row items-center bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
          <Search size={20} color="#94a3b8" />
          <TextInput 
            placeholder="Search our collection..."
            value={search}
            onChangeText={setSearch}
            className="flex-1 ml-3 font-medium text-slate-900"
          />
        </View>

        {/* Categories */}
        <View className="mt-6">
          <FlatList 
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            renderItem={({ item }) => (
              <TouchableOpacity 
                onPress={() => setSelectedCat(item)}
                className={`px-6 py-3 rounded-xl mr-2 ${selectedCat === item ? 'bg-slate-900' : 'bg-slate-50 border border-slate-100'}`}
              >
                <Text className={`text-[10px] font-black uppercase tracking-widest ${selectedCat === item ? 'text-white' : 'text-slate-400'}`}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item}
          />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#0f172a" />
        </View>
      ) : (
        <FlatList 
          data={filtered}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          renderItem={renderProduct}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View className="py-20 items-center">
              <Text className="text-slate-400 font-bold">No items found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
