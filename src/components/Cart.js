import React from 'react';

const Cart = ({ cartItems, onRemoveFromCart, onCheckout }) => {
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="cart">
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    <ul>
                        {cartItems.map(item => (
                            <li key={item.id}>
                                <span>{item.name} - ${item.price} x {item.quantity}</span>
                                <button onClick={() => onRemoveFromCart(item.id)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
                    <button onClick={onCheckout}>Checkout</button>
                </div>
            )}
        </div>
    );
};

export default Cart;