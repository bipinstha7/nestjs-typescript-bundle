import { CardElement } from '@stripe/react-stripe-js';
import usePaymentForm from './form.hooks';

export default function PaymentForm() {
  const { handleSubmit } = usePaymentForm();

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button>Pay</button>
    </form>
  );
}
