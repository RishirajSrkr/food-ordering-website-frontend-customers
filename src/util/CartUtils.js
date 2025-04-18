export const calculateCartTotals = (cartItems, quantities) => {
    const subTotal = cartItems.reduce((acc, food) => acc + food.price * quantities[food.id], 0);
    const shippingCharge = subTotal > 500 ? 0 : 30;
    const tax = subTotal * 0.10; // 10% tax
    const totalAmount = subTotal + shippingCharge + tax;

    return {
        subTotal,
        shippingCharge,
        tax,
        totalAmount
    }
}