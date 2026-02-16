import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AddressForm } from "./AddressForm";
import { OrderSummary } from "./OrderSummary";
import { ShippingAddress, useCheckout } from "@/hooks/useCheckout";
import { useCart } from "@/hooks/useCart";
import { useSavedAddresses } from "@/hooks/useOrders";

interface CheckoutFormProps {
  onComplete: (orderId: string) => void;
}

const STEPS = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

export function CheckoutForm({ onComplete }: CheckoutFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Pakistan',
    phone: '',
  });
  const [saveAddress, setSaveAddress] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const { cart, itemCount } = useCart();
  const { 
    createCheckoutSession, 
    confirmPayment, 
    applyPromoCode, 
    removePromoCode,
    isLoading: checkoutLoading 
  } = useCheckout();
  const { addresses } = useSavedAddresses();

  const subtotal = cart?.subtotal || 0;
  const shippingCost = subtotal >= 200 ? 0 : 10;
  const discountAmount = cart?.discount_amount || 0;
  const total = subtotal + shippingCost - discountAmount;

  const handleNext = async () => {
    if (currentStep === 0) {
      // Validate shipping info
      if (!email || !shippingAddress.name || !shippingAddress.line1 || 
          !shippingAddress.city || !shippingAddress.state || !shippingAddress.postal_code) {
        return;
      }
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Create checkout session
      try {
        if (cart?.id) {
          await createCheckoutSession(
            { shippingAddress, email, saveAddress },
            cart.id
          );
        }
        setCurrentStep(2);
      } catch (error) {
        // Error handled in hook
      }
    } else if (currentStep === 2) {
      // Complete order
      try {
        const result = await confirmPayment(cart?.id || '');
        if (result?.orderId) {
          onComplete(result.orderId);
        }
      } catch (error) {
        // Error handled in hook
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleApplyPromo = async (code: string) => {
    if (cart?.id && code) {
      await applyPromoCode(code, cart.id);
      setPromoCode(code);
    }
  };

  const handleRemovePromo = async () => {
    if (cart?.id) {
      await removePromoCode(cart.id);
      setPromoCode('');
    }
  };

  const selectSavedAddress = (address: any) => {
    setShippingAddress({
      name: address.name,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country || 'Pakistan',
      phone: address.phone || '',
    });
  };

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8">
      {/* Main Form */}
      <div>
        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`ml-2 text-sm ${
                  index <= currentStep ? 'font-medium' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
              {index < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          {/* Step 1: Shipping */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                
                {/* Saved Addresses */}
                {addresses && addresses.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-2">Saved Addresses</p>
                    <div className="grid gap-2">
                      {addresses.map((address) => (
                        <button
                          key={address.id}
                          onClick={() => selectSavedAddress(address)}
                          className="text-left p-3 border rounded-lg hover:border-primary transition-colors"
                        >
                          <p className="font-medium text-sm">{address.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {address.line1}, {address.city}, {address.state}
                          </p>
                          {address.is_default && (
                            <span className="text-xs text-primary">Default</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <AddressForm
                  value={shippingAddress}
                  onChange={setShippingAddress}
                  showSaveOption={true}
                  onSaveChange={setSaveAddress}
                  saveAddress={saveAddress}
                />
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <div className="border rounded-lg p-6 bg-muted/30">
                <div className="flex items-center gap-3 mb-4">
                  <Lock className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Secure Payment</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your payment information is processed securely. We do not store your card details.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4 flex items-center gap-3 cursor-pointer bg-primary/5 border-primary">
                  <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="font-medium">Credit/Debit Card (Stripe)</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                You will be redirected to our secure payment processor to complete your payment.
              </p>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">Contact</h3>
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="text-sm text-primary hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">{email}</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">Ship to</h3>
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="text-sm text-primary hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {shippingAddress.name}<br />
                    {shippingAddress.line1}<br />
                    {shippingAddress.line2 && <>{shippingAddress.line2}<br /></>}
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}<br />
                    Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                  I agree to the{' '}
                  <a href="/shop/policies" target="_blank" className="text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/shop/policies" target="_blank" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={checkoutLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={
              checkoutLoading ||
              (currentStep === 0 && (!email || !shippingAddress.name || !shippingAddress.line1)) ||
              (currentStep === 2 && !agreeToTerms)
            }
            className="flex-1"
          >
            {checkoutLoading ? (
              'Processing...'
            ) : currentStep === 2 ? (
              `Complete Order - ${formatCurrency(total)}`
            ) : (
              <>
                Continue
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Order Summary Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <OrderSummary
            items={cart?.items || []}
            subtotal={subtotal}
            shippingCost={shippingCost}
            discountAmount={discountAmount}
            promoCode={promoCode || undefined}
            onApplyPromo={handleApplyPromo}
            onRemovePromo={handleRemovePromo}
            isApplyingPromo={checkoutLoading}
          />
        </div>
      </div>
    </div>
  );
}

// Helper function for formatting
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
