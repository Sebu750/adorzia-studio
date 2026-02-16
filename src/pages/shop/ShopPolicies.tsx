import { motion } from "framer-motion";
import { Shield, Truck, RefreshCw, FileText, Cookie } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import AnimatedHeading from "@/components/public/AnimatedHeading";

export default function ShopPolicies() {
  return (
    <MarketplaceLayout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <AnimatedHeading className="font-display text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Policies & Terms
              </AnimatedHeading>
              <p className="text-lg text-muted-foreground">
                Important information about shopping with us, shipping, returns, and your privacy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Policies Tabs */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Tabs defaultValue="privacy" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="cookies">Cookies</TabsTrigger>
            </TabsList>

            {/* Privacy Policy */}
            <TabsContent value="privacy">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Privacy Policy</h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-muted-foreground mb-4">
                      Last updated: January 2025
                    </p>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-3">1. Information We Collect</h3>
                    <p className="text-muted-foreground mb-4">
                      We collect information you provide directly to us, including:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                      <li>Name, email address, and phone number</li>
                      <li>Shipping and billing addresses</li>
                      <li>Payment information (processed securely by Stripe)</li>
                      <li>Order history and preferences</li>
                      <li>Communications with us</li>
                    </ul>

                    <h3 className="text-lg font-semibold mt-6 mb-3">2. How We Use Your Information</h3>
                    <p className="text-muted-foreground mb-4">
                      We use your information to:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                      <li>Process and fulfill your orders</li>
                      <li>Communicate about your orders and account</li>
                      <li>Send marketing communications (with your consent)</li>
                      <li>Improve our services and website</li>
                      <li>Prevent fraud and ensure security</li>
                    </ul>

                    <h3 className="text-lg font-semibold mt-6 mb-3">3. Information Sharing</h3>
                    <p className="text-muted-foreground mb-4">
                      We do not sell your personal information. We share information only with:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                      <li>Designers (only what's necessary to fulfill orders)</li>
                      <li>Payment processors (Stripe)</li>
                      <li>Shipping carriers</li>
                      <li>Service providers who assist our operations</li>
                    </ul>

                    <h3 className="text-lg font-semibold mt-6 mb-3">4. Your Rights</h3>
                    <p className="text-muted-foreground mb-4">
                      You have the right to access, correct, or delete your personal information. 
                      Contact us at privacy@adorzia.com to exercise these rights.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Terms of Service */}
            <TabsContent value="terms">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Terms of Service</h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-muted-foreground mb-4">
                      Last updated: January 2025
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">1. Acceptance of Terms</h3>
                    <p className="text-muted-foreground mb-4">
                      By accessing and using Adorzia, you accept and agree to be bound by these 
                      Terms of Service. If you do not agree to these terms, please do not use our services.
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">2. Account Registration</h3>
                    <p className="text-muted-foreground mb-4">
                      To make purchases, you must create an account. You are responsible for:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                      <li>Providing accurate and complete information</li>
                      <li>Maintaining the security of your account</li>
                      <li>All activities that occur under your account</li>
                      <li>Notifying us immediately of any unauthorized use</li>
                    </ul>

                    <h3 className="text-lg font-semibold mt-6 mb-3">3. Product Information</h3>
                    <p className="text-muted-foreground mb-4">
                      We strive to display accurate product information, including descriptions, 
                      images, and pricing. However, we do not guarantee that all information is 
                      accurate, complete, or current. Colors may vary depending on your display.
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">4. Intellectual Property</h3>
                    <p className="text-muted-foreground mb-4">
                      All content on Adorzia, including designs, text, graphics, and logos, is 
                      the property of Adorzia or our designers and is protected by copyright and 
                      other intellectual property laws.
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">5. Limitation of Liability</h3>
                    <p className="text-muted-foreground mb-4">
                      Adorzia shall not be liable for any indirect, incidental, special, or 
                      consequential damages arising from your use of our services or products.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Return Policy */}
            <TabsContent value="returns">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Return Policy</h2>
                  <div className="prose prose-slate max-w-none">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg mb-6">
                      <RefreshCw className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">14-Day Return Window</p>
                        <p className="text-sm text-blue-700">
                          Return unworn items within 14 days of delivery
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Eligible Returns</h3>
                    <p className="text-muted-foreground mb-4">
                      Items may be returned if they meet the following criteria:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                      <li>Unworn, unwashed, and in original condition</li>
                      <li>All original tags attached</li>
                      <li>Original packaging included</li>
                      <li>Returned within 14 days of delivery</li>
                    </ul>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Non-Returnable Items</h3>
                    <p className="text-muted-foreground mb-4">
                      The following items cannot be returned:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                      <li>Custom or personalized orders</li>
                      <li>Intimate apparel (for hygiene reasons)</li>
                      <li>Items marked as "Final Sale"</li>
                      <li>Items damaged by wear or washing</li>
                    </ul>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Return Process</h3>
                    <ol className="list-decimal list-inside text-muted-foreground mb-4 space-y-2">
                      <li>Contact us at returns@adorzia.com to initiate a return</li>
                      <li>Package items securely with original tags attached</li>
                      <li>Include the return form provided in your package</li>
                      <li>Ship to the address provided in your return authorization</li>
                      <li>Refunds are processed within 5-7 business days of receipt</li>
                    </ol>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Refund Information</h3>
                    <p className="text-muted-foreground mb-4">
                      Refunds will be issued to the original payment method. Original shipping 
                      costs are non-refundable unless the return is due to our error. Return 
                      shipping costs are the responsibility of the customer unless the item 
                      arrived damaged or incorrect.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipping Policy */}
            <TabsContent value="shipping">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Shipping Policy</h2>
                  <div className="prose prose-slate max-w-none">
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg mb-6">
                      <Truck className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900">Free Shipping Over $200</p>
                        <p className="text-sm text-green-700">
                          Complimentary shipping on all orders over $200
                        </p>
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Production Time</h3>
                    <p className="text-muted-foreground mb-4">
                      Since our products are made-to-order by independent designers, please allow 
                      7-14 business days for production before shipping. Custom orders may require 
                      additional time.
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Shipping Methods & Rates</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="p-3 font-medium">Destination</th>
                            <th className="p-3 font-medium">Method</th>
                            <th className="p-3 font-medium">Time</th>
                            <th className="p-3 font-medium">Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr>
                            <td className="p-3">Pakistan (Major Cities)</td>
                            <td className="p-3">Standard</td>
                            <td className="p-3">3-5 business days</td>
                            <td className="p-3">$10 or Free over $200</td>
                          </tr>
                          <tr>
                            <td className="p-3">Pakistan (Remote Areas)</td>
                            <td className="p-3">Standard</td>
                            <td className="p-3">5-7 business days</td>
                            <td className="p-3">$15 or Free over $200</td>
                          </tr>
                          <tr>
                            <td className="p-3">International</td>
                            <td className="p-3">Express</td>
                            <td className="p-3">10-20 business days</td>
                            <td className="p-3">Calculated at checkout</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Order Tracking</h3>
                    <p className="text-muted-foreground mb-4">
                      Once your order ships, you will receive an email with tracking information. 
                      You can also track your order through your account dashboard or our order 
                      tracking page.
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">International Orders</h3>
                    <p className="text-muted-foreground mb-4">
                      International orders may be subject to customs duties, taxes, and fees. 
                      These charges are the responsibility of the recipient and are not included 
                      in the order total. Delivery times may vary due to customs processing.
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Delayed or Lost Packages</h3>
                    <p className="text-muted-foreground mb-4">
                      If your package hasn't arrived within the expected timeframe, please contact 
                      us at shipping@adorzia.com. We will investigate with the carrier and work 
                      to resolve any issues.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cookie Policy */}
            <TabsContent value="cookies">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Cookie Policy</h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-muted-foreground mb-4">
                      Last updated: January 2025
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">What Are Cookies</h3>
                    <p className="text-muted-foreground mb-4">
                      Cookies are small text files stored on your device when you visit our website. 
                      They help us provide you with a better experience and understand how you use our site.
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Types of Cookies We Use</h3>
                    
                    <h4 className="font-medium mt-4 mb-2">Essential Cookies</h4>
                    <p className="text-muted-foreground mb-4">
                      These cookies are necessary for the website to function properly. They enable 
                      core functionality such as security, network management, and accessibility. 
                      You cannot opt out of these cookies.
                    </p>

                    <h4 className="font-medium mt-4 mb-2">Analytics Cookies</h4>
                    <p className="text-muted-foreground mb-4">
                      We use analytics cookies to understand how visitors interact with our website. 
                      This helps us improve our site and your shopping experience. All data is 
                      collected anonymously.
                    </p>

                    <h4 className="font-medium mt-4 mb-2">Marketing Cookies</h4>
                    <p className="text-muted-foreground mb-4">
                      These cookies track your browsing habits to enable us to show advertising 
                      that is more likely to be of interest to you. We only set these cookies 
                      with your consent.
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Managing Cookies</h3>
                    <p className="text-muted-foreground mb-4">
                      You can control and manage cookies in your browser settings. Please note that 
                      removing or blocking cookies may impact your user experience and some features 
                      may not function properly.
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-3">Third-Party Cookies</h3>
                    <p className="text-muted-foreground mb-4">
                      We use services from third parties that may set cookies on your device, including:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                      <li>Google Analytics (usage analytics)</li>
                      <li>Stripe (secure payment processing)</li>
                      <li>Social media platforms (sharing features)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </MarketplaceLayout>
  );
}
