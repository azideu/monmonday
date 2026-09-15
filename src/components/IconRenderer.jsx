import React from 'react';
import {
  Flower2,
  Leaf,
  Heart,
  Coffee,
  Tent,
  Car,
  UtensilsCrossed,
  Cake,
  Gift,
  Sparkles,
  Camera,
  Mail,
  Lock,
  Key,
} from 'lucide-react';

const iconMap = {
  flower: Flower2,
  leaf: Leaf,
  heart: Heart,
  coffee: Coffee,
  tent: Tent,
  car: Car,
  pizza: UtensilsCrossed,
  cake: Cake,
  gift: Gift,
  sparkles: Sparkles,
  camera: Camera,
  mail: Mail,
  lock: Lock,
  key: Key,
};

export default function IconRenderer({ name, className = "w-5 h-5", fallback = "sparkles" }) {
  const IconComponent = iconMap[name?.toLowerCase()] || iconMap[fallback] || Sparkles;
  return <IconComponent className={className} />;
}
