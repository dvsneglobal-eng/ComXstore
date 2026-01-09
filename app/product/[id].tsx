
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { apiService } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { Product } from '../../types';
import { ArrowLeft, ShoppingBag, MessageCircle, Star } from 'lucide-react-native';
import { formatCurrency } from '../../utils/formatters';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    apiService.fetchProductById(id as string)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <View className="flex-1 bg-white items-center justify-center">
      <ActivityIndicator color="#0f172a" />
    </View>
  );

  if (!product) return (
    <View className="flex-1 bg-white items-center justify-center p-8">
      <Text className="text-xl font-black text-slate-900">Product not found</Text>
      <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-slate-900 px-8 py-3 rounded-xl">
        <Text className="text-white font-bold">Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="relative">
          <Image source={{ uri: product.image_url }} className="w-full aspect-[4/5]" />
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-12 left-6 w-12 h-12 bg-white/80 rounded-2xl items-center justify-center backdrop-blur"
          >
            <ArrowLeft color="#0f172a" size={24} />
          </TouchableOpacity>
        </View>

        <View className="px-8 py-10 space-y-6">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-4">
              <Text className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">{product.category}</Text>
              <Text className="text-3xl font-black text-slate-900 leading-tight">{product.name}</Text>
            </View>
            <Text className="text-2xl font-black text-slate-900">{formatCurrency(product.price)}</Text>
          </View>

          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <Star size={16} color="#fbbf24" fill="#fbbf24" />
              <Text className="ml-2 font-black text-slate-900 text-xs">4.8</Text>
            </View>
            <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">In Stock: {product.stock}</Text>
          </View>

          <View>
            <Text className="text-xs font-black text-slate-900 uppercase tracking-widest mb-3">Description</Text>
            <Text className="text-slate-500 leading-relaxed font-medium">{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Bar */}
      <View className="p-8 border-t border-slate-50 flex-row gap-4 bg-white">
        <TouchableOpacity 
          onPress={() => {
            addToCart(product);
            router.push('/cart');
          }}
          className="flex-1 bg-slate-900 h-16 rounded-[24px] items-center justify-center flex-row gap-3 shadow-xl shadow-slate-200"
        >
          <ShoppingBag color="white" size={20} />
          <Text className="text-white font-black uppercase tracking-widest text-xs">Add to Bag</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.push('/support')}
          className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-[24px] items-center justify-center"
        >
          <MessageCircle color="#2563eb" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
