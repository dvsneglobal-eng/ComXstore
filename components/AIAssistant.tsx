
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { aiService } from '../services/ai';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Send, X, RefreshCcw, Sparkles } from 'lucide-react-native';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi! I'm your WhatsStore AI Concierge. How can I help you today? ✨" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();
  const { cart } = useCart();
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const context = {
      userPhone: user?.phone,
      cartItems: cart,
      currentPage: 'Native App',
    };

    const response = await aiService.getChatResponse(userMsg, context);
    setMessages(prev => [...prev, { role: 'ai', text: response || "Something went wrong." }]);
    setIsTyping(false);
  };

  return (
    <>
      <TouchableOpacity 
        onPress={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-slate-900 rounded-2xl items-center justify-center shadow-2xl"
        style={{ position: 'absolute', bottom: 100, right: 24 }}
      >
        <Sparkles color="white" size={24} />
      </TouchableOpacity>

      <Modal visible={isOpen} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-white">
          <View className="px-6 py-4 border-b border-slate-50 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-slate-900 rounded-lg items-center justify-center mr-3">
                <Sparkles color="white" size={16} />
              </View>
              <Text className="font-black text-slate-900 uppercase tracking-widest text-sm">AI Concierge</Text>
            </View>
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <X size={24} color="#64748b" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            ref={scrollRef}
            className="flex-1 bg-slate-50/30 p-6"
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((msg, i) => (
              <View key={i} className={`mb-6 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <View className={`max-w-[85%] p-5 rounded-[24px] ${msg.role === 'user' ? 'bg-slate-900 rounded-tr-none' : 'bg-white border border-slate-100 rounded-tl-none shadow-sm'}`}>
                  <Text className={`${msg.role === 'user' ? 'text-white' : 'text-slate-800'} text-sm leading-relaxed`}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}
            {isTyping && (
              <ActivityIndicator color="#0f172a" style={{ alignSelf: 'flex-start', marginLeft: 10 }} />
            )}
          </ScrollView>

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View className="p-6 bg-white border-t border-slate-50 flex-row items-center gap-3">
              <TextInput 
                className="flex-1 bg-slate-50 rounded-2xl px-5 py-4 font-medium text-slate-900"
                placeholder="Ask anything..."
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity 
                onPress={handleSend}
                className="w-12 h-12 bg-slate-900 rounded-2xl items-center justify-center"
              >
                <Send size={20} color="white" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

import { SafeAreaView } from 'react-native-safe-area-context';
