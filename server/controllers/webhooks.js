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
        console.error("Webhook Error:", err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
try {
    switch (event.type) {
        case "payment_intent.succeeded":
            const paymentIntent = event.data.object;
            const sessionList = await stripe.checkout.sessions.list({
                payment_intent: paymentIntent.id
            });
            const session = sessionList.data[0];
            const {transactionId , appId} = session.metadata;
            if (appId === "ROOTGPT") {
                const transaction = await Transaction.findOne({ _id: transactionId,
                    isPaid: false
                 });
                 await User.updateOne({ _id: transaction.userId }, { $inc: { credits: transaction.credits } });

                 transaction.isPaid = true;
                 await transaction.save();
            }else{
                return res.status(400).send("Invalid appId in metadata");
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
            break;
    }
    res.json({ received: true });
} catch (error) {
    console.error("Error handling webhook event:", error);
    res.status(500).send(`Error handling webhook event: ${error.message}`);
}
}