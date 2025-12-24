
import React from 'react';
import { InventoryItem } from './types';

export const LOCATIONS = [
  "Wake Forest", "Raleigh", "Morrisville", "Apex", "Cary", "Rolesville", 
  "Youngsville", "Franklinton", "Creedmoor", "Louisburg", "Holly Springs"
];

export const INVENTORY: InventoryItem[] = [
  {
    id: 'c1',
    name: 'White Resin Folding Chair',
    category: 'Chairs',
    price: 3.50,
    image: 'https://picsum.photos/seed/chair1/400/400',
    description: 'Padded seat, perfect for weddings.'
  },
  {
    id: 'c2',
    name: 'Natural Wood Crossback',
    category: 'Chairs',
    price: 8.00,
    image: 'https://picsum.photos/seed/chair2/400/400',
    description: 'Elegant rustic charm for any venue.'
  },
  {
    id: 't1',
    name: '60" Round Table',
    category: 'Tables',
    price: 12.00,
    image: 'https://picsum.photos/seed/table1/400/400',
    description: 'Seats 8 guests comfortably.'
  },
  {
    id: 't2',
    name: '8ft Banquet Table',
    category: 'Tables',
    price: 10.00,
    image: 'https://picsum.photos/seed/table2/400/400',
    description: 'Standard rectangular table for buffet or seating.'
  },
  {
    id: 'd1',
    name: 'Cafe String Lights (50ft)',
    category: 'Decor',
    price: 45.00,
    image: 'https://picsum.photos/seed/light1/400/400',
    description: 'Warm ambiance for outdoor events.'
  },
  {
    id: 'd2',
    name: 'Oak Dance Floor (12x12)',
    category: 'Flooring',
    price: 250.00,
    image: 'https://picsum.photos/seed/dance1/400/400',
    description: 'Professional grade interlocking panels.'
  }
];
