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
        console.error("❌ Webhook Signature Error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const { transactionId, appId } = session.metadata;

            console.log(`Processing session for App: ${appId}, Transaction: ${transactionId}`);

            if (appId === "ROOTGPT") {
                const transaction = await Transaction.findOne({ 
                    _id: transactionId, 
                    isPaid: false 
                });

                if (transaction) {
                    const updatedUser = await User.findByIdAndUpdate(
                        transaction.userId, 
                        { $inc: { credits: transaction.credits } },
                        { new: true }
                    );

                    transaction.isPaid = true;
                    await transaction.save();
                    
                    console.log(`✅ Success! User ${updatedUser.email} now has ${updatedUser.credits} credits.`);
                } else {
                    console.log("⚠️ Transaction not found or already paid.");
                }
            } else {
                console.log("⚠️ Invalid appId in metadata.");
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error("❌ Error processing webhook:", error.message);
        res.status(500).send("Internal Server Error");
    }
};