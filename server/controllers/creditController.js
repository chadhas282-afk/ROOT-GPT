import Transaction from "../models/Transaction.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: "$10",
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support']
    },
    {
        _id: "pro",
        name: "Pro",
        price: "$20",
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support']
    },
    {
        _id: "premium",
        name: "Premium",
        price: "$30",
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support']
    }
];

export const getPlans = (req, res) => {
    try {
        res.json({ success: true, plans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const purchasePlan = async (req, res) => {
    try {
        const { planId } = req.body;
        const userId = req.user._id;
        
        // 1. Get origin and strip the trailing slash immediately in one go
        const rawOrigin = req.headers.origin || "http://localhost:5173";
        const cleanOrigin = rawOrigin.replace(/\/$/, ""); 

        const plan = plans.find(p => p._id === planId);
        if (!plan) {
            return res.status(404).json({ success: false, message: "Plan not found" });
        }

        const numericPrice = Number(plan.price.replace('$', ''));

        const transaction = await Transaction.create({
            userId: userId,
            planId: plan._id,
            amount: numericPrice,
            credits: plan.credits,
            isPaid: false
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: { name: `${plan.name} Plan` },
                        unit_amount: numericPrice * 100,
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            // 2. Use cleanOrigin here (No double slashes!)
            success_url: `${cleanOrigin}/loading?session_id={CHECKOUT_SESSION_ID}&transactionId=${transaction._id}`,
            cancel_url: `${cleanOrigin}/`,
            metadata: { 
                transactionId: transaction._id.toString(),
                userId: userId.toString()
            },
        });

        res.json({ success: true, url: session.url });

    } catch (error) {
        console.error("Purchase Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};