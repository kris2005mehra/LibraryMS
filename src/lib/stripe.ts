import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)

export { stripePromise }

export const createPaymentIntent = async (amount: number, mentorId: string) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to cents
        mentorId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create payment intent')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}