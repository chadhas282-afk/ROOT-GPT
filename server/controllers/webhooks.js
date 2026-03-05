import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/user.js";


export const stripeWebhooks = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Webhook Signature Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const { transactionId, appId } = session.metadata;

            if (appId === "ROOTGPT") {
                const transaction = await Transaction.findOne({ 
                    _id: transactionId, 
                    isPaid: false 
                });

                if (transaction) {
                    // Update User Credits
                    await User.updateOne(
                        { _id: transaction.userId }, 
                        { $inc: { credits: transaction.credits } }
                    );

                    transaction.isPaid = true;
                    await transaction.save();
                    
                    console.log(`✅ Success: Credits added for Transaction ${transactionId}`);
                } else {
                    console.log("❌ Transaction already processed or not found.");
                }
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error("Webhook Processing Error:", error);
        res.status(500).send(`Error: ${error.message}`);
    }
};