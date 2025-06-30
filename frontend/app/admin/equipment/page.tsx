"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, Timer, CheckCircle2, Clock } from "lucide-react";
import { equipmentService } from "@/lib/api/equipmentService";

interface EquipmentRow {
  id: string;
  equipmentName: string;
  ownerName: string;
  availabilityStartDate: string;
  availabilityEndDate: string;
  status: "Available" | "Not Available";
}

export default function AdminEquipmentHistoryPage() {
  const [equipments, setEquipments] = useState<EquipmentRow[]>([]);

  useEffect(() => {
    const loadEquipments = async () => {
      try {
        const list = await equipmentService.getAvailableEquipment();
        const today = new Date();
        const rows: EquipmentRow[] = list.map((eq: any) => {
          const start = new Date(eq.availabilityStartDate);
          const end = new Date(eq.availabilityEndDate);
          return {
            id: eq._id ?? eq.id,
            equipmentName: eq.equipmentName,
            ownerName: typeof eq.owner === "object" ? (eq.owner?.name ?? "Unknown") : (eq.owner ?? "—"),
            availabilityStartDate: eq.availabilityStartDate,
            availabilityEndDate: eq.availabilityEndDate,
            status: today >= start && today <= end ? "Available" : "Not Available",
          } as EquipmentRow;
        });
        setEquipments(rows);
      } catch (err) {
        console.error("Error loading equipments:", err);
      }
    };

    loadEquipments();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 min-h-screen">
      <h1 className="text-3xl font-bold">Equipment Rental History</h1>

      {equipments.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <Package className="h-12 w-12 mx-auto mb-4" />
          No equipment rentals found.
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Current & Past Rentals</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3">Equipment</th>
                  <th className="py-2 px-3">Renter</th>
                  <th className="py-2 px-3">From</th>
                  <th className="py-2 px-3">To</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {equipments.map((eq) => (
                  <tr key={eq.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 whitespace-nowrap">{eq.equipmentName}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{eq.ownerName}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{new Date(eq.availabilityStartDate).toLocaleDateString()}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{new Date(eq.availabilityEndDate).toLocaleDateString()}</td>
                    <td className="py-2 px-3 whitespace-nowrap flex items-center gap-1">
                      {eq.status === "Available" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                      {eq.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
