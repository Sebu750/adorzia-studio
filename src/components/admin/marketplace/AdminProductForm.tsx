import { useState, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateProduct, useUpdateProduct, useLinkProductToCollection, useCreateCollectionAndLink, useDesignerCollections } from "@/hooks/useAdminProducts";
import { useMarketplaceCategories } from "@/hooks/useMarketplaceProducts";
import { useAdminDesigners } from "@/hooks/useAdminDesigners";
import { Loader2, Upload, X, Image as ImageIcon, Package, Sparkles } from "lucide-react";
import { supabaseAdmin as supabase } from "@/integrations/supabase/admin-client";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  sale_price: z.coerce.number().optional().nullable(),
  sku: z.string().optional(),
  inventory_count: z.coerce.number().optional().nullable(),
  category_id: z.string().optional().nullable(),
  designer_id: z.string().optional().nullable(),
  status: z.enum(["draft", "live", "archived", "pending_review", "rejected"]),
  materials: z.string().optional(),
  care_instructions: z.string().optional(),
  images: z.array(z.string()).default([]),
  is_made_to_order: z.boolean().default(false),
  is_limited_edition: z.boolean().default(false),
  edition_size: z.coerce.number().optional().nullable(),
  collection_action: z.enum(["none", "existing", "new"]).default("none"),
  collection_id: z.string().optional().nullable(),
  new_collection_name: z.string().optional(),
  new_collection_description: z.string().optional(),
}).refine((data) => !data.is_limited_edition || (data.edition_size && data.edition_size > 0), {
  message: "Edition size is required and must be greater than 0 for limited edition products",
  path: ["edition_size"],
}).refine((data) => {
  if (data.collection_action === "existing") {
    return !!data.collection_id;
  }
  if (data.collection_action === "new") {
    return !!data.new_collection_name && data.new_collection_name.trim().length > 0;
  }
  return true;
}, {
  message: "Please select a collection or provide a name for the new collection",
  path: ["collection_id"],
});

type ProductFormData = z.infer<typeof productSchema>;

interface AdminProductFormProps {
  product?: {
    id: string;
    title: string;
    description?: string | null;
    price: number;
    sale_price?: number | null;
    sku?: string | null;
    inventory_count?: number | null;
    category_id?: string | null;
    designer_id?: string | null;
    status: string;
    materials?: string[] | null;
    care_instructions?: string | null;
    images?: string[] | null;
    is_made_to_order?: boolean | null;
    is_limited_edition?: boolean | null;
    edition_size?: number | null;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AdminProductForm({ product, onSuccess, onCancel }: AdminProductFormProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const linkProductToCollection = useLinkProductToCollection();
  const createCollectionAndLink = useCreateCollectionAndLink();
  const { data: categories } = useMarketplaceCategories();
  const { data: designers } = useAdminDesigners();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || "",
      description: product?.description || "",
      price: product?.price || 0,
      sale_price: product?.sale_price || null,
      sku: product?.sku || "",
      inventory_count: product?.inventory_count || null,
      category_id: product?.category_id || null,
      designer_id: product?.designer_id || null,
      status: (product?.status as ProductFormData["status"]) || "draft",
      materials: product?.materials?.join(", ") || "",
      care_instructions: product?.care_instructions || "",
      images: product?.images || [],
      is_made_to_order: product?.is_made_to_order ?? false,
      is_limited_edition: product?.is_limited_edition ?? false,
      edition_size: product?.edition_size || null,
      collection_action: "none",
      collection_id: null,
      new_collection_name: "",
      new_collection_description: "",
    },
  });

  // Watch designer_id to fetch collections
  const selectedDesignerId = useWatch({ control: form.control, name: "designer_id" });
  const collectionAction = useWatch({ control: form.control, name: "collection_action" });
  const { data: designerCollections } = useDesignerCollections(selectedDesignerId);

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      // Map status - only use valid DB enum values
      let dbStatus: "draft" | "live" | "archived" = "draft";
      if (data.status === "live") dbStatus = "live";
      else if (data.status === "archived" || data.status === "rejected") dbStatus = "archived";
      
      const productData = {
        title: data.title,
        description: data.description || null,
        price: data.price,
        sale_price: data.sale_price || null,
        sku: data.sku || null,
        inventory_count: data.inventory_count || null,
        category_id: data.category_id || null,
        designer_id: data.designer_id || null,
        status: dbStatus,
        is_adorzia_product: true, // All products are Adorzia-owned
        materials: data.materials ? data.materials.split(",").map(m => m.trim()) : null,
        care_instructions: data.care_instructions || null,
        images: data.images.length > 0 ? data.images : null,
        is_made_to_order: data.is_made_to_order,
        is_limited_edition: data.is_limited_edition,
        edition_size: data.is_limited_edition ? data.edition_size : null,
      };

      let savedProduct;
      if (product?.id) {
        savedProduct = await updateProduct.mutateAsync({ id: product.id, updates: productData });
      } else {
        savedProduct = await createProduct.mutateAsync(productData);
      }

      // Handle collection linking after product is saved
      if (savedProduct && data.collection_action !== "none") {
        if (data.collection_action === "existing" && data.collection_id) {
          await linkProductToCollection.mutateAsync({
            productId: savedProduct.id,
            collectionId: data.collection_id,
          });
        } else if (data.collection_action === "new" && data.new_collection_name) {
          await createCollectionAndLink.mutateAsync({
            collection: {
              name: data.new_collection_name,
              description: data.new_collection_description,
              designer_id: data.designer_id,
            },
            productId: savedProduct.id,
          });
        }
      }

      onSuccess?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Image upload handlers
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);
    const currentImages = form.getValues("images") || [];
    const newImages: string[] = [];

    try {
      // Get current user for the upload path
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        // Use user's ID as the folder prefix to satisfy RLS policy
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      }

      form.setValue("images", [...currentImages, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  const images = form.watch("images") || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Product title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Product description" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Product Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormControl>
                    <div className="space-y-4">
                      {/* Image Preview Grid */}
                      {images.length > 0 && (
                        <div className="grid grid-cols-4 gap-4">
                          {images.map((image, index) => (
                            <div key={index} className="relative aspect-square rounded-lg border overflow-hidden group">
                              <img
                                src={image}
                                alt={`Product image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Upload Area */}
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-admin-border/60 rounded-lg p-8 text-center cursor-pointer hover:border-admin-foreground/40 transition-colors"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e.target.files)}
                        />
                        {isUploadingImages ? (
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-admin-muted-foreground" />
                            <p className="text-sm text-admin-muted-foreground">Uploading images...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8 text-admin-muted-foreground" />
                            <p className="text-sm text-admin-muted-foreground">
                              Click to upload images
                            </p>
                            <p className="text-xs text-admin-muted-foreground/60">
                              Supports multiple images
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Designer & Collection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Designer & Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="designer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designer</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value === "__none__" ? null : value);
                      // Clear collection selection when designer changes
                      form.setValue("collection_id", null);
                    }} 
                    value={field.value || "__none__"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select designer (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none__">No Designer</SelectItem>
                      {designers?.map((designer) => (
                        <SelectItem key={designer.id} value={designer.id}>
                          {designer.brand_name ? `${designer.name} (${designer.brand_name})` : designer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a designer to assign this product to their profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Collection Selection */}
            {selectedDesignerId && (
              <FormField
                control={form.control}
                name="collection_action"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collection</FormLabel>
                    <FormControl>
                      <Tabs value={field.value} onValueChange={(v) => field.onChange(v as "none" | "existing" | "new")}>
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="none">No Collection</TabsTrigger>
                          <TabsTrigger value="existing">Existing</TabsTrigger>
                          <TabsTrigger value="new">New Collection</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="none" className="mt-4">
                          <p className="text-sm text-admin-muted-foreground">
                            This product will not be added to any collection.
                          </p>
                        </TabsContent>
                        
                        <TabsContent value="existing" className="mt-4 space-y-4">
                          <FormField
                            control={form.control}
                            name="collection_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Select Collection</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Choose a collection" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {designerCollections?.map((collection) => (
                                      <SelectItem key={collection.id} value={collection.id}>
                                        {collection.name}
                                      </SelectItem>
                                    ))}
                                    {(!designerCollections || designerCollections.length === 0) && (
                                      <SelectItem value="__empty__" disabled>
                                        No collections found for this designer
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TabsContent>
                        
                        <TabsContent value="new" className="mt-4 space-y-4">
                          <FormField
                            control={form.control}
                            name="new_collection_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Collection Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Summer Collection 2024" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="new_collection_description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe the collection..." 
                                    className="min-h-[80px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TabsContent>
                      </Tabs>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sale_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sale Price ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="Optional"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="inventory_count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Unlimited"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Type - Made to Order / Limited Edition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Product Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="is_made_to_order"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Made-to-Order</FormLabel>
                    <FormDescription>
                      This product is crafted specifically for each customer after ordering
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_limited_edition"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Limited Edition</FormLabel>
                    <FormDescription>
                      This product has a limited production run
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("is_limited_edition") && (
              <FormField
                control={form.control}
                name="edition_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Edition Size</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Number of pieces"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Total number of pieces in this limited edition
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="materials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Materials</FormLabel>
                  <FormControl>
                    <Input placeholder="Cotton, Silk, Polyester (comma separated)" {...field} />
                  </FormControl>
                  <FormDescription>Comma separated list of materials</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="care_instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Care Instructions</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Hand wash cold, lay flat to dry..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Publishing */}
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || isUploadingImages}>
            {(isSubmitting || isUploadingImages) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {product?.id ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
