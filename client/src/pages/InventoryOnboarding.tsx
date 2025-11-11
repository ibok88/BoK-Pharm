import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Pill, Plus, Trash2, Upload, Store } from "lucide-react";
import { z } from "zod";
import type { Medication, Inventory } from "@shared/schema";

const inventoryFormSchema = z.object({
  medicationId: z.string().min(1, "Please select a medication"),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  price: z.coerce.number().min(0, "Price must be greater than 0"),
  originalPrice: z.coerce.number().optional(),
  inStock: z.boolean().default(true),
  expiryDate: z.string().optional(),
  batchNumber: z.string().optional(),
});

type InventoryFormData = z.infer<typeof inventoryFormSchema>;

interface InventoryResponse {
  items: Inventory[];
  needsSetup: boolean;
}

export default function InventoryOnboarding() {
  const { toast } = useToast();

  const { data: medications, isLoading: medicationsLoading } = useQuery<Medication[]>({
    queryKey: ["/api/medications"],
  });

  const { data: inventoryData, isLoading: inventoryLoading } = useQuery<InventoryResponse>({
    queryKey: ["/api/inventory"],
  });

  const setupPharmacyMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/auth/setup-pharmacy", "POST");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your pharmacy has been set up successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      quantity: 0,
      price: 0,
      inStock: true,
    },
  });

  const addInventoryMutation = useMutation({
    mutationFn: async (data: InventoryFormData) => {
      await apiRequest("/api/inventory", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Inventory item added successfully",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteInventoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest(`/api/inventory/${id}`, "DELETE");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Inventory item removed",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InventoryFormData) => {
    addInventoryMutation.mutate(data);
  };

  const inventory = inventoryData?.items || [];
  const needsSetup = inventoryData?.needsSetup || false;

  // Show pharmacy setup prompt if needed
  if (needsSetup && !inventoryLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Store className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Set Up Your Pharmacy</CardTitle>
            <CardDescription>
              Before you can manage inventory, you need to set up your pharmacy account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Setting up your pharmacy will:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Create your pharmacy profile</li>
                <li>Enable inventory management</li>
                <li>Allow you to start adding medications</li>
              </ul>
            </div>
            <Button
              className="w-full"
              onClick={() => setupPharmacyMutation.mutate()}
              disabled={setupPharmacyMutation.isPending}
              data-testid="button-setup-pharmacy"
            >
              {setupPharmacyMutation.isPending ? "Setting up..." : "Set Up Pharmacy"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
            <p className="text-muted-foreground">
              Easily add and manage your pharmacy inventory
            </p>
          </div>
          <Button variant="outline" data-testid="button-bulk-upload">
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload CSV
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Inventory Item</CardTitle>
              <CardDescription>
                Select a medication and set quantity and pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="medicationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-medication">
                              <SelectValue placeholder="Select medication" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {medicationsLoading ? (
                              <SelectItem value="loading" disabled>Loading...</SelectItem>
                            ) : medications?.length === 0 ? (
                              <SelectItem value="none" disabled>No medications available</SelectItem>
                            ) : (
                              medications?.map((med) => (
                                <SelectItem key={med.id} value={med.id}>
                                  {med.name} {med.strength} - {med.manufacturer}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              data-testid="input-quantity"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              data-testid="input-price"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="originalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Original Price (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            data-testid="input-original-price"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              data-testid="input-expiry-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="batchNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Batch Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ABC123"
                              {...field}
                              data-testid="input-batch-number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="inStock"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-in-stock"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>In Stock</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={addInventoryMutation.isPending}
                    data-testid="button-add-inventory"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {addInventoryMutation.isPending ? "Adding..." : "Add to Inventory"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
              <CardDescription>
                {inventory.length} items in your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inventoryLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading inventory...</p>
              ) : inventory.length === 0 ? (
                <div className="text-center py-8">
                  <Pill className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No inventory items yet</p>
                  <p className="text-sm text-muted-foreground">Add your first item to get started</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {inventory.map((item) => {
                    const medication = medications?.find(m => m.id === item.medicationId);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover-elevate"
                        data-testid={`inventory-item-${item.id}`}
                      >
                        <div className="flex-1">
                          <div className="font-medium">{medication?.name || "Unknown"}</div>
                          <div className="text-sm text-muted-foreground">
                            {medication?.strength} • Qty: {item.quantity}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">${item.price}</Badge>
                            {item.inStock ? (
                              <Badge variant="default" className="bg-green-500">In Stock</Badge>
                            ) : (
                              <Badge variant="destructive">Out of Stock</Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteInventoryMutation.mutate(item.id)}
                          data-testid={`button-delete-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {(!medications || medications.length === 0) && !medicationsLoading && (
          <Card className="border-dashed">
            <CardContent className="pt-6">
              <div className="text-center">
                <Pill className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No medications available</h3>
                <p className="text-muted-foreground mb-4">
                  Add common medications to your catalog to get started
                </p>
                <Button data-testid="button-add-medication">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Medication to Catalog
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
