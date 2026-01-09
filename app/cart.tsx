
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react-native';
import { formatCurrency } from '../utils/formatters';

export default function CartScreen() {
  const { cart, totalPrice, removeFromCart } = useCart();
  const { user } = useAuth();

  const handleCheckout = () => {
    if (!user) return router.push('/login');
    
    const itemsList = cart.map(i => `• ${i.name} (x${i.quantity})`).join('\n');
    const msg = `🛍️ *Order Request*\n\nItems:\n${itemsList}\n\nTotal: ${formatCurrency(totalPrice)}\n\nConfirming my order from WhatsStore!`;
    
    Linking.openURL(`https://wa.me/yournumber?text=${encodeURIComponent(msg)}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 py-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-slate-50 rounded-xl">
          <ArrowLeft size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text className="text-xl font-black text-slate-900">Your Bag</Text>
        <View className="w-10" />
      </View>

      <FlatList 
        data={cart}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center mb-6 bg-slate-50/50 p-4 rounded-3xl border border-slate-100">
            <Image source={{ uri: item.image_url }} className="w-20 h-20 rounded-2xl" />
            <View className="flex-1 ml-4">
              <Text className="font-bold text-slate-900 text-sm" numberOfLines={1}>{item.name}</Text>
              <Text className="text-slate-400 text-xs mt-1">Qty: {item.quantity}</Text>
              <Text className="font-black text-slate-900 mt-2">{formatCurrency(item.price)}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} className="p-2">
              <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View className="py-20 items-center">
            <ShoppingBag size={64} color="#e2e8f0" />
            <Text className="mt-4 text-slate-400 font-bold uppercase tracking-widest">Bag is empty</Text>
          </View>
        }
      />

      {cart.length > 0 && (
        <View className="p-8 border-t border-slate-50">
          <View className="flex-row justify-between mb-6">
            <Text className="text-slate-400 font-bold uppercase tracking-widest text-xs">Total Amount</Text>
            <Text className="text-3xl font-black text-slate-900">{formatCurrency(totalPrice)}</Text>
          </View>
          <TouchableOpacity 
            onPress={handleCheckout}
            className="w-full bg-emerald-500 h-16 rounded-[24px] items-center justify-center shadow-xl shadow-emerald-100"
          >
            <Text className="text-white font-black uppercase tracking-widest text-sm">Checkout on WhatsApp</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
