"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

export default function MarketingPage() {
  const [product, setProduct] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!product.trim()) return;
    setIsLoading(true);
    setError(null);
    setDescription(null);
    try {
      const res = await fetch("/api/marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to generate description");
      }
      const data = await res.json();
      setDescription(data.marketingDescription);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2" /> Generate Marketing Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter product name e.g. Fresh Tomatoes"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />
          <Button disabled={isLoading} onClick={generate} className="w-full">
            {isLoading ? "Generating..." : "Generate"}
          </Button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {description && (
            <Textarea readOnly value={description} className="h-32" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
