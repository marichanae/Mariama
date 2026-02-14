import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  type: 'PHYSICAL' | 'DIGITAL';
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  total: number;
  totalQuantity: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem: CartContextValue['addItem'] = (item, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((c) => c.productId === item.productId);
      if (existing) {
        return current.map((c) =>
          c.productId === item.productId
            ? { ...c, quantity: c.quantity + quantity }
            : c,
        );
      }
      return [...current, { ...item, quantity }];
    });
  };

  const removeItem: CartContextValue['removeItem'] = (productId) => {
    setItems((current) => current.filter((c) => c.productId !== productId));
  };

  const clear: CartContextValue['clear'] = () => setItems([]);

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const totalQuantity = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    clear,
    total,
    totalQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
