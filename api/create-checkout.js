const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { priceId, mode, bundleName } = req.body;
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://thesnusfellas.com';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode || 'payment',
      currency: 'gbp',
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/#bundles`,
      shipping_address_collection: { allowed_countries: ['GB'] },
      custom_text: {
        submit: {
          message: 'By completing this purchase you confirm you are 18 years of age or older.'
        }
      },
      metadata: { bundle: bundleName || 'Unknown' }
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
