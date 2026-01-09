
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
  /**
   * Generates a context-aware response for the WhatsStore platform.
   */
  async getChatResponse(message: string, context: { 
    userPhone?: string; 
    cartItems?: any[]; 
    currentPage?: string;
    lastOrders?: any[];
    focusedProduct?: any;
  }) {
    try {
      const cartContext = context.cartItems?.length 
        ? `CART: ${context.cartItems.length} items. Total: ${context.cartItems.reduce((s, i) => s + (i.price * i.quantity), 0)}.`
        : "CART: Empty.";
      
      const orderContext = context.lastOrders?.length
        ? `ORDERS: ${context.lastOrders.map(o => `ID #${o.id.slice(-4)} (${o.status})`).join(', ')}.`
        : "ORDERS: None yet.";

      const productContext = context.focusedProduct 
        ? `FOCUSED_PRODUCT: ${context.focusedProduct.name} ($${context.focusedProduct.price}). Desc: ${context.focusedProduct.description}`
        : "FOCUSED_PRODUCT: None.";

      const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: message,
        config: {
          systemInstruction: `You are the "WhatsStore AI Concierge", the primary support layer for this mobile-first shopping platform.

          APP ROUTES (Use markdown links: [Label](/path)):
          - Home: [/](/)
          - All Products: [Catalog](/products)
          - Your Profile/Settings: [Account Settings](/profile)
          - Support Hub (You are here): [Support](/support)
          - Shopping Bag: [Cart](/cart)

          MISSION: Answer questions about products, orders, and technical setup.

          1. TECHNICAL ISSUES (Backend Sync):
          - If the user says they can't see products or it says "Preview Only", explain they need to set their Backend URL.
          - Tell them: "Go to [Account Settings](/profile) and enter your n8n Backend URL in the 'System Config' section."

          2. ORDER FINALIZATION (The WhatsApp Trust Layer):
          - Always remind users: "You can browse and build your bag here, but for security and delivery coordination, orders are finalized on WhatsApp."
          - If they ask "How do I pay?", tell them: "After confirming your cart, tap 'Confirm on WhatsApp'. The store owner will provide payment instructions there."

          3. NAVIGATION ASSISTANCE:
          - "Where is my history?" -> "View your [Profile](/profile) for recent orders."
          - "Show me shoes" -> "Check our [Catalog](/products?category=Shoes) section."

          4. PRODUCT EXPERTISE:
          - Use FOCUSED_PRODUCT data if available. If not, suggest they browse the [Catalog](/products).

          CURRENT SESSION:
          - User: ${context.userPhone || 'Guest'}
          - ${cartContext}
          - ${orderContext}
          - ${productContext}
          - Page: ${context.currentPage}

          TONE: Professional, concise, mobile-friendly (use emojis ✨ ✅ 📱). Max 2-3 sentences per response.`,
          temperature: 0.4,
        },
      });
      return response.text;
    } catch (error) {
      console.error("AI Assistant Error:", error);
      return "I'm refreshing my system! 🚀 If you need immediate help, please reach out to us directly on WhatsApp.";
    }
  }
};
