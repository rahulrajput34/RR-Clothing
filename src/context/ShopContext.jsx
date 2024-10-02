import { useEffect, useState, createContext } from 'react';
import { products } from "../assets/assets";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// Use context API for getting all the values of products from assets.js
export const ShopContext = createContext();

// Creating for getting values from 
const ShopContextProvider = (props) => {
    const currency = '$';
    const deliveryFees = 10;
    const taxRate = 0.13; // 13% tax
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const navigate = useNavigate();

    // ***********      ADD TO CART functionality     *****************
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Please select a size of product');
            return;
        }

        // Clone the current cart data to avoid direct mutation
        let cartData = structuredClone(cartItems);

        // Check if the item already exists in the cart
        if (cartData[itemId]) {
            // Check if the specific size of the item exists in the cart
            if (cartData[itemId][size]) {
                // If it exists, increase the quantity by 1
                cartData[itemId][size] += 1;
            } else {
                // If the size doesn't exist, add the size with quantity 1
                cartData[itemId][size] = 1;
            }
        } else {
            // If the item doesn't exist, create a new entry for the item
            cartData[itemId] = {};
            // Add the size with quantity 1
            cartData[itemId][size] = 1;
        }

        // Update the cart state with the new data
        setCartItems(cartData);
    };

    // *************    Get Cart Count Logic      ****************
    const getCartCount = () => {
        let totalCount = 0;

        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        return totalCount;
    };

    // ***********   Update quantity **********
    const updateQuantity = async (itemId, size, quantity) => {
        // Clone the current cart data to avoid direct mutation
        let cartData = structuredClone(cartItems);

        // Update the quantity for the specified item and size
        cartData[itemId][size] = quantity;

        // Update the cart state with the new data
        setCartItems(cartData);
    };

    // **********    Total amount with tax    ***************
    const getCartAmount = () => {
        let subtotal = 0;
        for (const items in cartItems) {
            // Find the product by id
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        let itemPrice = itemInfo.price;
                        let itemQuantity = cartItems[items][item];
                        subtotal += itemPrice * itemQuantity;
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }

        // Calculate the tax based on the subtotal
        const tax = subtotal * taxRate;

        // Return an object containing subtotal, tax, and total
        return {
            subtotal,
            tax,
            total: subtotal + tax + deliveryFees
        };
    };

    const value = {
        products,
        currency,
        deliveryFees,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
