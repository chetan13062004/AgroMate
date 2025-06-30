"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Package, Search, Loader2 } from "lucide-react";
import { useRentalCart } from "@/contexts/rental-cart-context";
import { useRouter } from "next/navigation";

import equipmentService from "@/lib/api/equipmentService";
import { Card, CardContent } from "@/components/ui/card";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

// Interface defining the structure for an equipment item
interface Equipment {
  _id: string;
  equipmentName: string;
  equipmentType: string;
  brand: string;
  condition: string;
  rentalPrice: number;
  images: string[];
  minRentalDuration?: number;
  maxRentalDuration?: number;
  availabilityStartDate: string;
  availabilityEndDate: string;
}

export default function RentalsPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [rentDialogOpen, setRentDialogOpen] = useState(false);
  const [selectedEq, setSelectedEq] = useState<Equipment | null>(null);
  const [rentalDays, setRentalDays] = useState<number>(1);
  const { addItem } = useRentalCart();
  const router = useRouter();

  // Fetch all available equipment when the component mounts
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await equipmentService.getAvailableEquipment();
        setEquipments(data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
        toast.error("Failed to load equipment list");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  // Filter equipment based on the search term using useMemo for efficiency
  const filteredEquipments = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return equipments; // Return all if search is empty
    
    return equipments.filter((eq) =>
      eq.equipmentName.toLowerCase().includes(term) ||
      eq.equipmentType.toLowerCase().includes(term) ||
      eq.brand.toLowerCase().includes(term)
    );
  }, [equipments, searchTerm]);

  // Display a loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900 flex items-center">
            <Package className="h-8 w-8 mr-3" /> Equipment Rentals
          </h1>
          <p className="text-green-700">Browse farm equipment available for rent</p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search by name, type, or brand..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredEquipments.length === 0 ? (
          // Display a message if no equipment is found
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Equipment Found</h3>
              <p className="text-gray-600">Please try a different search term or check back later.</p>
            </CardContent>
          </Card>
        ) : (
          // Display the grid of equipment cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEquipments.map((eq) => (
              <Card
                key={eq._id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full border group"
              >
                <div className="relative h-56 bg-gray-100">
                  <Image
                    src={eq.images?.[0] || "/placeholder.svg"}
                    alt={eq.equipmentName}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-900 truncate mb-1" title={eq.equipmentName}>
                    {eq.equipmentName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="outline">{eq.equipmentType}</Badge>
                    <Badge variant="secondary">{eq.condition}</Badge>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-600">Brand: <b>{eq.brand}</b></p>
                  </div>
                  <p className="font-bold text-xl text-green-700 mt-3">
                    ₹{eq.rentalPrice.toLocaleString()}
                    <span className="text-sm font-normal text-gray-500"> / day</span>
                  </p>
                  <Button size="sm" className="mt-3" onClick={() => { setSelectedEq(eq); setRentalDays(eq.minRentalDuration ?? 1); setRentDialogOpen(true); }}>
                    Rent Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Rent dialog */}
      <Dialog open={rentDialogOpen} onOpenChange={setRentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rent {selectedEq?.equipmentName}</DialogTitle>
          </DialogHeader>
          {selectedEq && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Number of days</label>
                <Input
                  type="number"
                  min={selectedEq.minRentalDuration ?? 1}
                  value={rentalDays}
                  onChange={(e) => setRentalDays(Number(e.target.value))}
                />
                {selectedEq.maxRentalDuration && (
                  <p className="text-xs text-gray-500 mt-1">Min {selectedEq.minRentalDuration} – Max {selectedEq.maxRentalDuration} days</p>
                )}
              </div>
              <p className="text-lg font-semibold">
                Total: ₹{(selectedEq.rentalPrice * (rentalDays || 0)).toLocaleString()}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => {
              if (selectedEq) {
                addItem({
                  id: selectedEq._id,
                  name: selectedEq.equipmentName,
                  price: selectedEq.rentalPrice,
                  image: selectedEq.images?.[0] || "/placeholder.svg",
                  days: rentalDays || 1,
                  availabilityStartDate: selectedEq.availabilityStartDate,
                  availabilityEndDate: selectedEq.availabilityEndDate,
                });
                router.push("/rent-cart");
              }
              setRentDialogOpen(false);
            }}>Add to Rent Cart</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}