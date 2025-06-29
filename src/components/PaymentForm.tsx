import React, { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { CreditCard, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

interface PaymentFormProps {
  amount: number
  mentorId: string
  onSuccess: (paymentIntentId: string) => void
}

export default function PaymentForm({ amount, mentorId, onSuccess }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      toast.error('Stripe not loaded')
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      toast.error('Card element not found')
      return
    }

    setLoading(true)

    try {
      // For demo purposes, we'll simulate a successful payment
      // In a real app, you'd create a payment intent on your backend
      const mockPaymentIntentId = `pi_mock_${Date.now()}`
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Payment successful!')
      onSuccess(mockPaymentIntentId)
    } catch (error: any) {
      console.error('Payment error:', error)
      toast.error(error.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <CreditCard className="h-4 w-4 inline mr-2" />
          Card Details
        </label>
        <div className="p-3 border border-gray-300 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-500">
        <Lock className="h-4 w-4 mr-2" />
        Your payment information is secure and encrypted
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          `Pay ₹${amount} and Start Session`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By proceeding, you agree to our terms of service and privacy policy
      </p>
    </form>
  )
}