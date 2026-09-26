import {
  Wrench,
  Zap,
  Hammer,
  Sparkles,
  Bug,
  Snowflake,
  PaintRoller,
  Car,
  Refrigerator,
  Laptop,
  Scissors,
  Truck,
} from 'lucide-react';

// Maps a service category name from the API to a Lucide icon.
const RULES = [
  [/plumb/i, Wrench],
  [/electric/i, Zap],
  [/carpent|wood|furniture/i, Hammer],
  [/clean/i, Sparkles],
  [/pest/i, Bug],
  [/\bac\b|air ?condition|cool/i, Snowflake],
  [/paint/i, PaintRoller],
  [/car|vehicle/i, Car],
  [/appliance|fridge|refrigerator|washing machine/i, Refrigerator],
  [/laptop|computer|mobile/i, Laptop],
  [/salon|beauty|spa|groom/i, Scissors],
  [/shift|mover|packer/i, Truck],
];

export const getCategoryIcon = (name = '') => {
  const rule = RULES.find(([re]) => re.test(name));
  return rule ? rule[1] : Wrench;
};
