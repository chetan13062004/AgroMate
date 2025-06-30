"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import equipmentService from "@/lib/api/equipmentService";
import { toast } from "sonner";
import Image from "next/image";
import { Plus, Edit, Trash, Loader2 } from "lucide-react";

interface Equipment {
  _id: string;
  equipmentName: string;
  equipmentType: string;
  brand: string;
  modelNumber: string;
  condition: string;
  fuelType: string;
  rentalPrice: number;
  minRentalDuration: number;
  maxRentalDuration?: number;
  availabilityStartDate: string;
  availabilityEndDate: string;
  pickupMethod: string;
  images: string[];
}

interface NewEquipmentForm {
  totalCost: number;
  equipmentName: string;
  equipmentType: string;
  brand: string;
  modelNumber: string;
  condition: string;
  fuelType: string;
  rentalPrice: number;
  minRentalDuration: number;
  maxRentalDuration: number | "";
  availabilityStartDate: string;
  availabilityEndDate: string;
  pickupMethod: string;
  images: File[];
}

export default function EquipmentPage() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<Equipment | null>(null);
  const [newEq, setNewEq] = useState<NewEquipmentForm>({
    equipmentName: "",
    equipmentType: "Tractor",
    brand: "",
    modelNumber: "",
    condition: "Good",
    fuelType: "Diesel",
    rentalPrice: 0,
    minRentalDuration: 1,
    maxRentalDuration: "",
    availabilityStartDate: "",
    availabilityEndDate: "",
    pickupMethod: "Self-pickup",
    images: [],
    totalCost: 0,
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await equipmentService.getMyEquipment();
        setEquipments(data);
      } catch (e) {
        toast.error("Failed to load equipment");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }
    setNewEq((prev) => ({ ...prev, images: files }));
    setPreviewUrls(files.map((f) => URL.createObjectURL(f)));
  };

  const resetForm = () => {
    setNewEq({
      equipmentName: "",
      equipmentType: "Tractor",
      brand: "",
      modelNumber: "",
      condition: "Good",
      fuelType: "Diesel",
      rentalPrice: 0,
      minRentalDuration: 1,
      maxRentalDuration: "",
      availabilityStartDate: "",
      availabilityEndDate: "",
      pickupMethod: "Self-pickup",
      images: [],
      totalCost: 0,
    });
    setPreviewUrls([]);
    setSelected(null);
    setEditing(false);
  };

  const buildFormData = (): FormData => {
    // compute totalCost before building form data
    const computedTotal = newEq.rentalPrice * newEq.minRentalDuration;
    const eqWithCost = { ...newEq, totalCost: computedTotal };

    const fd = new FormData();
    Object.entries(eqWithCost).forEach(([k, v]) => {
      if (k === "images") return;
      fd.append(k, String(v));
    });
    newEq.images.forEach((file) => fd.append("images", file));
    return fd;
  };

  const submitHandler = async () => {
    if (!newEq.equipmentName || !newEq.brand) {
      toast.error("Please fill required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const fd = buildFormData();
      let saved: Equipment;
      if (editing && selected) {
        saved = await equipmentService.updateEquipment(selected._id, fd);
        setEquipments((prev) => prev.map((e) => (e._id === saved._id ? saved : e)));
      } else {
        saved = await equipmentService.createEquipment(fd);
        setEquipments((prev) => [saved, ...prev]);
      }
      toast.success("Saved successfully");
      setDialogOpen(false);
      resetForm();
    } catch (e) {
      toast.error("Save failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const editHandler = (eq: Equipment) => {
    setSelected(eq);
    setEditing(true);
    setDialogOpen(true);
    setNewEq({
      equipmentName: eq.equipmentName,
      equipmentType: eq.equipmentType,
      brand: eq.brand,
      modelNumber: eq.modelNumber,
      condition: eq.condition,
      fuelType: eq.fuelType,
      rentalPrice: eq.rentalPrice,
      minRentalDuration: eq.minRentalDuration,
      maxRentalDuration: eq.maxRentalDuration || "",
      availabilityStartDate: eq.availabilityStartDate.split("T")[0],
      availabilityEndDate: eq.availabilityEndDate.split("T")[0],
      pickupMethod: eq.pickupMethod,
      images: [],
      totalCost: eq.rentalPrice * eq.minRentalDuration,
    });
    setPreviewUrls(eq.images);
  };

  const deleteHandler = async (id: string) => {
    if (window.confirm("Delete this equipment?")) {
      await equipmentService.deleteEquipment(id);
      setEquipments((prev) => prev.filter((e) => e._id !== id));
    }
  };

  const list = useMemo(() => equipments, [equipments]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Equipment Rentals</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Equipment
        </Button>
      </div>

      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : list.length === 0 ? (
        <p>No equipment listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-28">
          {list.map((eq) => (
            <Card key={eq._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {eq.equipmentName}
                  <Badge variant="outline">{eq.equipmentType}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {eq.images[0] && (
                  <div className="relative w-full h-40">
                    <Image src={eq.images[0]} alt={eq.equipmentName} fill className="object-cover rounded" />
                  </div>
                )}
                <p>Brand: {eq.brand}</p>
                <p>Model: {eq.modelNumber}</p>
                <p>Price: ₹{eq.rentalPrice}/day</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="outline" onClick={() => editHandler(eq)}>
                    <Edit className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteHandler(eq._id)}>
                    <Trash className="h-3 w-3 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open: boolean) => {
          if (!open) resetForm();
          setDialogOpen(open);
        }}>
        <DialogContent className="max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Equipment" : "Add Equipment"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label>Equipment Name</Label>
              <Input value={newEq.equipmentName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEq({ ...newEq, equipmentName: e.target.value })} />
            </div>
            <div>
              <Label>Equipment Type</Label>
              <Select value={newEq.equipmentType} onValueChange={(v: string) => setNewEq({ ...newEq, equipmentType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Tractor','Tiller','Sprayer','Seeder','Harvester','Plough','Other'].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Brand / Manufacturer</Label>
              <Input value={newEq.brand} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEq({ ...newEq, brand: e.target.value })} />
            </div>
            <div>
              <Label>Model Number</Label>
              <Input value={newEq.modelNumber} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEq({ ...newEq, modelNumber: e.target.value })} />
            </div>
            <div>
              <Label>Condition</Label>
              <Select value={newEq.condition} onValueChange={(v: string) => setNewEq({ ...newEq, condition: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['New','Good','Average'].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Fuel Type</Label>
              <Select value={newEq.fuelType} onValueChange={(v: string) => setNewEq({ ...newEq, fuelType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Diesel','Petrol','Manual'].map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rental Price (₹/day)</Label>
              <Input type="number" min={0} value={newEq.rentalPrice} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEq({ ...newEq, rentalPrice: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Min Rental Duration (days)</Label>
              <Input type="number" min={1} value={newEq.minRentalDuration} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEq({ ...newEq, minRentalDuration: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Total Cost (₹)</Label>
              <Input readOnly value={newEq.rentalPrice * newEq.minRentalDuration} />
            </div>
            <div>
              <Label>Max Rental Duration (days, optional)</Label>
              <Input type="number" min={1} value={newEq.maxRentalDuration} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEq({ ...newEq, maxRentalDuration: e.target.value === '' ? '' : Number(e.target.value) })} />
            </div>
            <div>
              <Label>Availability Start</Label>
              <Input type="date" value={newEq.availabilityStartDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEq({ ...newEq, availabilityStartDate: e.target.value })} />
            </div>
            <div>
              <Label>Availability End</Label>
              <Input type="date" value={newEq.availabilityEndDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEq({ ...newEq, availabilityEndDate: e.target.value })} />
            </div>
            <div>
              <Label>Pickup Method</Label>
              <Select value={newEq.pickupMethod} onValueChange={(v: string) => setNewEq({ ...newEq, pickupMethod: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Self-pickup','Delivery available'].map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Images (1-4)</Label>
              <Input type="file" accept="image/*" multiple onChange={handleImageChange} />
              <div className="flex gap-2 mt-2">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative w-24 h-24">
                    <Image src={url} alt="preview" fill className="object-cover rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button disabled={isSubmitting} onClick={submitHandler}>
              {isSubmitting && <Loader2 className="animate-spin h-4 w-4 mr-2" />}Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
