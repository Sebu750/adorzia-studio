import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Package, MapPin, CreditCard, LogOut, 
  ChevronRight, Plus, Edit2, Trash2, Star,
  Mail, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MarketplaceLayout } from "@/components/marketplace/MarketplaceLayout";
import { OrderHistoryItem } from "@/components/shop/OrderHistoryItem";
import { AddressForm } from "@/components/shop/AddressForm";
import { useOrders, useSavedAddresses } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { ShippingAddress } from "@/hooks/useCheckout";
import { supabase } from "@/integrations/supabase/client";

export default function ShopAccount() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { orders, isLoading: loadingOrders } = useOrders();
  const { 
    addresses, 
    isLoading: loadingAddresses, 
    addAddress, 
    updateAddress, 
    deleteAddress,
    setDefaultAddress 
  } = useSavedAddresses();
  
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [newAddress, setNewAddress] = useState<ShippingAddress>({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Pakistan',
    phone: '',
  });
  const [isDefault, setIsDefault] = useState(false);

  // Redirect if not logged in
  if (!user) {
    return (
      <MarketplaceLayout>
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <User className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
            <p className="text-muted-foreground mb-8">
              Please sign in to view your account and order history.
            </p>
            <Button size="lg" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </MarketplaceLayout>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/shop');
  };

  const handleAddAddress = async () => {
    await addAddress.mutateAsync({
      ...newAddress,
      is_default: isDefault,
    });
    setIsAddAddressOpen(false);
    setNewAddress({
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Pakistan',
      phone: '',
    });
    setIsDefault(false);
  };

  const handleUpdateAddress = async () => {
    if (editingAddress) {
      await updateAddress.mutateAsync({
        id: editingAddress.id,
        ...newAddress,
        is_default: editingAddress.is_default,
      });
      setEditingAddress(null);
    }
  };

  const startEditAddress = (address: any) => {
    setEditingAddress(address);
    setNewAddress({
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
    <MarketplaceLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Account</h1>
            <p className="text-muted-foreground">
              Manage your orders, addresses, and account settings
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Profile Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.email}</h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    {orders?.length || 0} orders
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {addresses?.length || 0} addresses
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:w-auto">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Order History</h2>
            </div>

            {loadingOrders ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : orders && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <OrderHistoryItem key={order.id} order={order} index={index} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't placed any orders yet. Start shopping to see your order history.
                  </p>
                  <Button asChild>
                    <Link to="/shop">Start Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add New Address</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <AddressForm
                      value={newAddress}
                      onChange={setNewAddress}
                      showSaveOption={false}
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="default"
                        checked={isDefault}
                        onCheckedChange={(checked) => setIsDefault(checked as boolean)}
                      />
                      <Label htmlFor="default" className="text-sm font-normal">
                        Set as default address
                      </Label>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleAddAddress}
                      disabled={addAddress.isPending}
                    >
                      {addAddress.isPending ? 'Saving...' : 'Save Address'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loadingAddresses ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : addresses && addresses.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <Card key={address.id} className={address.is_default ? 'border-primary' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{address.name}</span>
                          {address.is_default && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => startEditAddress(address)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                            onClick={() => deleteAddress.mutate(address.id)}
                            disabled={deleteAddress.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address.line1}<br />
                        {address.line2 && <>{address.line2}<br /></>}
                        {address.city}, {address.state} {address.postal_code}<br />
                        {address.country}
                      </p>
                      {address.phone && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {address.phone}
                        </p>
                      )}
                      {!address.is_default && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto mt-2"
                          onClick={() => setDefaultAddress.mutate(address.id)}
                        >
                          Set as default
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No saved addresses</h3>
                  <p className="text-muted-foreground mb-6">
                    Add an address to speed up your checkout process.
                  </p>
                  <Button onClick={() => setIsAddAddressOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <h2 className="text-xl font-semibold">Account Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  To update your profile information, please contact support.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" asChild>
                  <Link to="/forgot-password">Reset Password</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Address Dialog */}
      <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <AddressForm
              value={newAddress}
              onChange={setNewAddress}
              showSaveOption={false}
            />
            <Button 
              className="w-full" 
              onClick={handleUpdateAddress}
              disabled={updateAddress.isPending}
            >
              {updateAddress.isPending ? 'Saving...' : 'Update Address'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MarketplaceLayout>
  );
}
