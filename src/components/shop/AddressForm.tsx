import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShippingAddress } from "@/hooks/useCheckout";

interface AddressFormProps {
  value: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
  showSaveOption?: boolean;
  onSaveChange?: (save: boolean) => void;
  saveAddress?: boolean;
}

const PAKISTAN_CITIES = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad",
  "Gujranwala", "Multan", "Peshawar", "Quetta", "Sialkot"
];

const PAKISTAN_PROVINCES = [
  { code: "PB", name: "Punjab" },
  { code: "SN", name: "Sindh" },
  { code: "KP", name: "Khyber Pakhtunkhwa" },
  { code: "BL", name: "Balochistan" },
  { code: "ICT", name: "Islamabad Capital Territory" },
];

export function AddressForm({ 
  value, 
  onChange, 
  showSaveOption = false, 
  onSaveChange,
  saveAddress = false 
}: AddressFormProps) {
  const handleChange = (field: keyof ShippingAddress, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={value.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div>
        <Label htmlFor="line1">Address Line 1 *</Label>
        <Input
          id="line1"
          value={value.line1}
          onChange={(e) => handleChange('line1', e.target.value)}
          placeholder="Street address, house number"
          required
        />
      </div>

      <div>
        <Label htmlFor="line2">Address Line 2 (Optional)</Label>
        <Input
          id="line2"
          value={value.line2 || ''}
          onChange={(e) => handleChange('line2', e.target.value)}
          placeholder="Apartment, suite, unit, etc."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City *</Label>
          <select
            id="city"
            value={value.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select city</option>
            {PAKISTAN_CITIES.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="state">Province *</Label>
          <select
            id="state"
            value={value.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="">Select province</option>
            {PAKISTAN_PROVINCES.map(province => (
              <option key={province.code} value={province.code}>{province.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postal_code">Postal Code *</Label>
          <Input
            id="postal_code"
            value={value.postal_code}
            onChange={(e) => handleChange('postal_code', e.target.value)}
            placeholder="54000"
            required
          />
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value="Pakistan"
            disabled
            className="bg-muted"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          value={value.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+92 3XX XXXXXXX"
          required
        />
      </div>

      {showSaveOption && onSaveChange && (
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="save-address"
            checked={saveAddress}
            onCheckedChange={(checked) => onSaveChange(checked as boolean)}
          />
          <Label htmlFor="save-address" className="text-sm font-normal cursor-pointer">
            Save this address for future orders
          </Label>
        </div>
      )}
    </div>
  );
}
