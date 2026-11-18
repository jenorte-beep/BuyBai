
"use client";

import { clearTokens, getUserId } from "@/lib/auth";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { apiClient } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Address {
  address_id: number;
  id: number;
  street: string;
  city: string;
  province: string;
  postal_code: string;
  created_at?: string;
  updated_at?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isChecking } = useAuthGuard({ requireAuth: true });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<Address | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // READ ALL ADDRESSES
  const fetchAddresses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiClient<Address[]>(
        CONFIG.ENDPOINTS.ADDRESS,
        {
          method: "GET",
          requiresAuth: true,
        }
      );

      setAddresses(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch addresses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isChecking) {
      fetchAddresses();
    }
  }, [isChecking, fetchAddresses]);

  // READ SINGLE ADDRESS
  const handleViewAddress = async (addressId: number) => {
    setError("");
    setSuccess("");

    try {
      const data = await apiClient<Address>(
        `${CONFIG.ENDPOINTS.ADDRESS}/${addressId}`,
        {
          method: "GET",
          requiresAuth: true,
        }
      );

      setSelectedAddress(data);
    } catch (err: any) {
      setError(err.message || "Failed to load address details.");
    }
  };

  // OPEN CREATE FORM
  const openCreateForm = () => {
    setEditingId(null);
    setStreet("");
    setCity("");
    setProvince("");
    setPostalCode("");
    setSelectedAddress(null);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  // OPEN UPDATE FORM
  const openEditForm = (address: Address) => {
    setEditingId(address.address_id);
    setStreet(address.street);
    setCity(address.city);
    setProvince(address.province);
    setPostalCode(address.postal_code);
    setSelectedAddress(null);
    setError("");
    setSuccess("");
    setIsFormOpen(true);
  };

  // CLOSE FORM
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setStreet("");
    setCity("");
    setProvince("");
    setPostalCode("");
  };

  // CREATE AND UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess("");

    const userId = getUserId();

    if (!userId) {
      setError("Unable to determine user ID. Please log in again.");
      setSubmitting(false);
      return;
    }

    try {
      const addressData = {
        id: Number(userId),
        street,
        city,
        province,
        postal_code: postalCode,
      };

      if (editingId !== null) {
        await apiClient(
          `${CONFIG.ENDPOINTS.ADDRESS}/${editingId}`,
          {
            method: "PUT",
            requiresAuth: true,
            body: JSON.stringify(addressData),
          }
        );

        setSuccess(`Address #${editingId} updated successfully.`);
      } else {
        await apiClient(CONFIG.ENDPOINTS.ADDRESS, {
          method: "POST",
          requiresAuth: true,
          body: JSON.stringify(addressData),
        });

        setSuccess("New address created successfully.");
      }

      closeForm();
      await fetchAddresses();
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE ADDRESS
  const handleDelete = async (addressId: number) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Address #${addressId}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await apiClient(
        `${CONFIG.ENDPOINTS.ADDRESS}/${addressId}`,
        {
          method: "DELETE",
          requiresAuth: true,
        }
      );

      if (selectedAddress?.address_id === addressId) {
        setSelectedAddress(null);
      }

      setSuccess(`Address #${addressId} deleted successfully.`);
      await fetchAddresses();
    } catch (err: any) {
      setError(err.message || "Failed to delete address.");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    clearTokens();
    router.push(CONFIG.ROUTES.LOGIN);
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Verifying session...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 bg-background">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* NAVBAR */}
        <header className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Address Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage customer addresses
            </p>
          </div>

          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </header>

        {/* NOTIFICATIONS */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 rounded-md border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 rounded-md border border-emerald-200 dark:border-emerald-900">
            {success}
          </div>
        )}

        {/* CREATE / UPDATE FORM */}
        {isFormOpen && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>
                  {editingId !== null
                    ? `Update Address #${editingId}`
                    : "Create New Address"}
                </CardTitle>

                <CardDescription>
                  Enter the customer address details below.
                </CardDescription>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={closeForm}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div className="space-y-2">
                    <Label htmlFor="street">Street</Label>
                    <Input
                      id="street"
                      placeholder="Enter Street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <Input
                      id="province"
                      placeholder="Enter Province"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      placeholder="Enter Postal Code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>

                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeForm}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" disabled={submitting}>
                    {submitting
                      ? "Saving..."
                      : editingId !== null
                      ? "Save Changes"
                      : "Create Address"}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        )}

        {/* SINGLE ADDRESS DETAILS */}
        {selectedAddress && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>
                  Address Details (#{selectedAddress.address_id})
                </CardTitle>
                <CardDescription>
                  Address information from the backend.
                </CardDescription>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedAddress(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

              <div>
                <span className="text-muted-foreground block">
                  Address ID
                </span>
                <span className="font-medium">
                  {selectedAddress.address_id}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block">
                  Customer ID
                </span>
                <span className="font-medium">
                  {selectedAddress.id}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block">
                  Street
                </span>
                <span className="font-medium">
                  {selectedAddress.street}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block">
                  City
                </span>
                <span className="font-medium">
                  {selectedAddress.city}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block">
                  Province
                </span>
                <span className="font-medium">
                  {selectedAddress.province}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground block">
                  Postal Code
                </span>
                <span className="font-medium">
                  {selectedAddress.postal_code}
                </span>
              </div>

            </CardContent>
          </Card>
        )}

        {/* ADDRESSES TABLE */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <CardTitle>Addresses</CardTitle>
              <CardDescription>
                All customer addresses stored in the backend.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={fetchAddresses}
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                Read / Refresh
              </Button>

              <Button onClick={openCreateForm}>
                <Plus className="w-4 h-4 mr-2" />
                Create Address
              </Button>
            </div>

          </CardHeader>

          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>

                <TableHeader>
                  <TableRow>
                    <TableHead>Address ID</TableHead>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Street</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>Postal Code</TableHead>
                    <TableHead className="text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow key="loading-row">
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-muted-foreground"
                      >
                        Loading addresses...
                      </TableCell>
                    </TableRow>
                  ) : addresses.length === 0 ? (
                    <TableRow key="empty-row">
                      <TableCell
                        colSpan={7}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No addresses found. Click "Create Address" to add one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    addresses.map((address, index) => (
                      <TableRow
                        key={`${address.address_id}-${index}`}
                      >
                        <TableCell className="font-medium">
                          {address.address_id}
                        </TableCell>

                        <TableCell>{address.id}</TableCell>

                        <TableCell>{address.street}</TableCell>

                        <TableCell>{address.city}</TableCell>

                        <TableCell>{address.province}</TableCell>

                        <TableCell>{address.postal_code}</TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleViewAddress(address.address_id)
                              }
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Read
                            </Button>

                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => openEditForm(address)}
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Update
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDelete(address.address_id)
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>

                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>

              </Table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
