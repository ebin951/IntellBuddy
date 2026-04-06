import React, { useState } from 'react';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { saveToLocalStorage } from '../../utils/localStorage';
import { UserProfile } from '../../types'; // Assuming UserProfile is sufficient for mock user data

interface CheckoutFormProps {
    userId: string;
}

const ShoppingCartIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25v2.25m-3-3h.008v.008H4.5v-.008Zm0 3h.008v.008H4.5v-.008Zm0 3h.008v.008H7.5v-.008Zm0 3h.008v.008H7.5v-.008Zm0 3h.008v.008H7.5v-.008Zm3-6h.008v.008H10.5v-.008Zm0 3h.008v.008H10.5v-.008Zm0 3h.008v.008H10.5v-.008Zm3-6h.008v.008H13.5v-.008Zm0 3h.008v.008H13.5v-.008Zm0 3h.008v.008H13.5v-.008Zm3-6h.008v.008H16.5v-.008Zm0 3h.008v.008H16.5v-.008Zm0 3h.008v.008H16.5v-.008Zm3-6h.008v.008H19.5v-.008Zm0 3h.008v.008H19.5v-.008Zm0 3h.008v.008H19.5v-.008Zm3-6h.008v.008H22.5v-.008Zm0 3h.008v.008H22.5v-.008Zm0 3h.008v.008H22.5v-.008Z" />
    </svg>
);


const CheckoutForm: React.FC<CheckoutFormProps> = ({ userId }) => {
    const [productName, setProductName] = useState('AI Course Access');
    const [quantity, setQuantity] = useState<number | string>(1);
    const [pricePerUnit, setPricePerUnit] = useState<number | string>(49.99);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handlePlaceOrder = async () => {
        const qtyNum = Number(quantity);
        const priceNum = Number(pricePerUnit);

        if (!productName || isNaN(qtyNum) || qtyNum <= 0 || isNaN(priceNum) || priceNum <= 0) {
            setMessage({ type: 'error', text: 'Please fill in all valid order details.' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        // Simulate a successful order placement
        const mockOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
        const mockOrder = {
            id: mockOrderId,
            user_id: userId,
            product_name: productName,
            quantity: qtyNum,
            price_per_unit: priceNum,
            total_amount: qtyNum * priceNum,
            order_date: new Date().toISOString(),
            status: 'completed',
        };

        // Save to local storage for demonstration
        const existingOrders = JSON.parse(localStorage.getItem(`user_orders_${userId}`) || '[]');
        saveToLocalStorage(`user_orders_${userId}`, [...existingOrders, mockOrder]);

        setTimeout(() => {
            setMessage({ type: 'success', text: `Order placed successfully! Order ID: ${mockOrderId}` });
            // Reset form
            setProductName('AI Course Access');
            setQuantity(1);
            setPricePerUnit(49.99);
            setIsLoading(false);
        }, 1500); // Simulate network delay
    };

    return (
        <div className="max-w-2xl mx-auto animate-reveal space-y-8">
            <Card className="p-8">
                <div className="text-center mb-8">
                    <div className="bg-brand inline-block p-4 rounded-full shadow-[0_0_30px_rgba(56,189,248,0.3)] mb-4">
                        <ShoppingCartIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none italic">
                        Secure Checkout
                    </h2>
                    <p className="text-brand text-sm font-black uppercase tracking-widest mt-2">Powered Locally (for Demo)</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="productName" className="block text-sm font-black text-text-secondary uppercase tracking-widest mb-2">Product Name</label>
                        <input
                            type="text"
                            id="productName"
                            className="w-full bg-accent border border-white/10 rounded-xl p-4 text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-black text-text-secondary uppercase tracking-widest mb-2">Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                className="w-full bg-accent border border-white/10 rounded-xl p-4 text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="1"
                                disabled={isLoading}
                            />
                        </div>
                        <div>
                            <label htmlFor="pricePerUnit" className="block text-sm font-black text-text-secondary uppercase tracking-widest mb-2">Price Per Unit ($)</label>
                            <input
                                type="number"
                                id="pricePerUnit"
                                className="w-full bg-accent border border-white/10 rounded-xl p-4 text-text-primary focus:outline-none focus:ring-1 focus:ring-brand"
                                value={pricePerUnit}
                                onChange={(e) => setPricePerUnit(e.target.value)}
                                step="0.01"
                                min="0.01"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-black text-text-secondary uppercase tracking-widest mb-2">Total Amount</label>
                        <p className="w-full bg-accent/50 border border-white/10 rounded-xl p-4 text-text-primary font-bold text-lg">
                            ${(Number(quantity || 0) * Number(pricePerUnit || 0)).toFixed(2)}
                        </p>
                    </div>
                </div>

                {message && (
                    <div className={`mt-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} text-xs font-black uppercase text-center tracking-widest leading-relaxed`}>
                        {message.text}
                    </div>
                )}

                <Button
                    onClick={handlePlaceOrder}
                    isLoading={isLoading}
                    className="w-full py-4 text-lg font-black uppercase tracking-widest mt-8"
                >
                    Place Order
                </Button>
            </Card>
        </div>
    );
};

export default CheckoutForm;