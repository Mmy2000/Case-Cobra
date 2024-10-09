import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Define the Stripe event type explicitly
export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Invalid signature", { status: 400 });
    }

    // Ensure STRIPE_WEBHOOK_SECRET is available
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing Stripe webhook secret");
    }

    // Initialize the Stripe event with a specific type
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed.", err);
      return new Response("Webhook signature verification failed", { status: 400 });
    }

    // Type checking for specific event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const customerEmail = session.customer_details?.email;
      if (!customerEmail) {
        throw new Error("Missing user email");
      }

      const { userId, orderId } = session.metadata || {};
      if (!userId || !orderId) {
        throw new Error("Invalid request metadata");
      }

      const billingAddress = session.customer_details?.address;
      const shippingAddress = session.shipping_details?.address;

      // Ensure shipping and billing addresses exist
      if (!billingAddress || !shippingAddress) {
        throw new Error("Missing address details");
      }

      // Update the order in the database
      const updatedOrder = await db.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          shippingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: shippingAddress.city!,
              country: shippingAddress.country!,
              postalCode: shippingAddress.postal_code!,
              street: shippingAddress.line1!,
              state: shippingAddress.state,
            },
          },
          billingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: billingAddress.city!,
              country: billingAddress.country!,
              postalCode: billingAddress.postal_code!,
              street: billingAddress.line1!,
              state: billingAddress.state,
            },
          },
        },
      });

      return NextResponse.json({ result: event, ok: true });
    }

    // If no event type matches
    return new Response("Unhandled event type", { status: 400 });

  } catch (err: unknown) {  // Use 'unknown' type for error
    if (err instanceof Error) {
      console.error("Error processing webhook:", err.message);
      return NextResponse.json(
        { message: 'Something went wrong', ok: false },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Unknown error occurred', ok: false },
      { status: 500 }
    );
  }
}
