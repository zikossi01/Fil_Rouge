import React from 'react';
import CartView from '../components/cart/CartView.jsx';

const CartPage = ({ setCurrentView }) => {
  return <CartView setCurrentView={setCurrentView} />;
};

export default CartPage;