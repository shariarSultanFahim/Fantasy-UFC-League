"use client";

import { FileText, Info, ShieldUser } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AdminPageHeader } from "../components/AdminPageHeader";
import { LegalEditor } from "./components/legal-editor";

export default function LegalPage() {
  const handleSave = (type: "about" | "terms" | "privacy", content: unknown) => {
    console.log(`Saving ${type}...`, content);
    // In a real app, you would make an API call here.
  };

  return (
    <>
      <AdminPageHeader
        title="Legal Content Management"
        subtitle="Edit the legal documents displayed to your users."
      />
      <Card className="overflow-hidden rounded-3xl border-slate-100 bg-white p-6 shadow-sm sm:p-8">
        <Tabs defaultValue="terms" className="w-full">
          <TabsList className="mb-8 flex h-auto w-full rounded-none border-b border-slate-100 bg-transparent p-0">
            <TabsTrigger
              value="about"
              className="flex-1 rounded-none border-b-2 border-transparent py-4 text-base font-bold text-[#8e98a8] transition-all data-[state=active]:border-[#3dbcf9] data-[state=active]:bg-transparent data-[state=active]:text-[#3dbcf9] data-[state=active]:shadow-none"
            >
              <Info className="mr-2 h-4 w-4" />
              About
            </TabsTrigger>
            <TabsTrigger
              value="terms"
              className="flex-1 rounded-none border-b-2 border-transparent py-4 text-base font-bold text-[#8e98a8] transition-all data-[state=active]:border-[#3dbcf9] data-[state=active]:bg-transparent data-[state=active]:text-[#3dbcf9] data-[state=active]:shadow-none"
            >
              <FileText className="mr-2 h-4 w-4" />
              Terms & Conditions
            </TabsTrigger>
            <TabsTrigger
              value="privacy"
              className="flex-1 rounded-none border-b-2 border-transparent py-4 text-base font-bold text-[#8e98a8] transition-all data-[state=active]:border-[#3dbcf9] data-[state=active]:bg-transparent data-[state=active]:text-[#3dbcf9] data-[state=active]:shadow-none"
            >
              <ShieldUser className="mr-2 h-4 w-4" />
              Privacy Policy
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="terms"
            className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
          >
            <LegalEditor onSave={(content) => handleSave("terms", content)} />
          </TabsContent>

          <TabsContent
            value="privacy"
            className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
          >
            <LegalEditor onSave={(content) => handleSave("privacy", content)} />
          </TabsContent>
          <TabsContent
            value="about"
            className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
          >
            <LegalEditor onSave={(content) => handleSave("about", content)} />
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}
