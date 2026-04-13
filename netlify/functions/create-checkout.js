const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { priceId, mode, bundleName } = JSON.parse(event.body);
    const baseUrl = process.env.URL || 'https://thesnusfellas.co.uk';

    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: mode || 'payment',
      currency: 'gbp',
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/#bundles`,
      shipping_address_collection: {
        allowed_countries: ['GB'],
      },
      custom_text: {
        submit: {
          message: 'By completing this purchase you confirm you are 18 years of age or older.'
        }
      },
      metadata: {
        bundle: bundleName || 'Unknown'
      }
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error('Stripe error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
