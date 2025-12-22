import { NavItemType } from 'types/menu';

import admin from './admin';
import business from './business';
import factory from './factory';
import forest from './forest';
import inventory from './inventory';
import sales from './sales';
import transport from './transport';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: NavItemType[] } = {
  items: [forest, transport, factory, business, sales, inventory, admin]
};

export default menuItems;
