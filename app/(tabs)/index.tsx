
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { apiService } from '../../services/api';
import { Product } from '../../types';
import { router } from 'expo-router';
import { ShoppingBag, Zap } from 'lucide-react-native';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.fetchFeaturedProducts()
      .then(setFeatured)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6">
        {/* Hero Section */}
        <View className="mt-6 h-64 rounded-[40px] bg-slate-900 overflow-hidden relative">
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' }} 
            className="w-full h-full opacity-60"
          />
          <View className="absolute inset-0 p-8 justify-end">
            <View className="bg-white/10 self-start px-3 py-1 rounded-lg border border-white/20">
              <Text className="text-white text-[10px] font-black uppercase tracking-widest">Premium 2025</Text>
            </View>
            <Text className="text-white text-3xl font-black mt-3 leading-tight">Elevate Your{"\n"}Style Game.</Text>
          </View>
        </View>

        {/* Action Header */}
        <View className="flex-row items-center justify-between mt-10">
          <Text className="text-xl font-black text-slate-900">Departments</Text>
          <TouchableOpacity onPress={() => router.push('/catalog')}>
            <Text className="text-blue-600 text-xs font-black uppercase tracking-widest">Browse All</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6 -mx-6 px-6">
          {['Shoes', 'Style', 'Beauty', 'Tech'].map((item) => (
            <TouchableOpacity 
              key={item} 
              className="mr-4 items-center gap-2"
              onPress={() => router.push({ pathname: '/catalog', params: { category: item } })}
            >
              <View className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl items-center justify-center">
                <Text className="text-2xl">{item === 'Shoes' ? '👟' : item === 'Style' ? '👕' : item === 'Beauty' ? '💄' : '📱'}</Text>
              </View>
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Section */}
        <Text className="text-xl font-black text-slate-900 mt-10">Featured</Text>
        <FlatList
          data={featured}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-6 -mx-6 px-6 mb-10"
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => router.push(`/product/${item.id}`)}
              className="mr-4 w-64 bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm"
            >
              <Image source={{ uri: item.image_url }} className="w-full aspect-[4/5]" />
              <View className="p-5">
                <Text className="font-bold text-slate-900 text-sm">{item.name}</Text>
                <View className="flex-row items-center justify-between mt-3">
                  <Text className="text-lg font-black text-slate-900">${item.price}</Text>
                  <View className="w-10 h-10 bg-slate-900 rounded-xl items-center justify-center">
                    <ShoppingBag color="white" size={18} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
