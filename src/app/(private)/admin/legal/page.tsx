"use client";

import { FileText, ShieldUser, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SerializedEditorState } from "lexical";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLegalDocument, useUpsertLegalDocument } from "@/lib/actions/legal";

import { AdminPageHeader } from "../components/AdminPageHeader";
import { LegalEditor } from "./components/legal-editor";

export default function LegalPage() {
  const { data: termsData, isLoading: isLoadingTerms } = useLegalDocument("TERMS_AND_CONDITIONS");
  const { data: privacyData, isLoading: isLoadingPrivacy } = useLegalDocument("PRIVACY_POLICY");
  const { mutate: upsertLegal, isPending: isSaving } = useUpsertLegalDocument();

  const handleSave = (type: "TERMS_AND_CONDITIONS" | "PRIVACY_POLICY", content: SerializedEditorState | undefined) => {
    if (!content) return;

    upsertLegal(
      {
        type,
        content: JSON.stringify(content),
      },
      {
        onSuccess: () => {
          toast.success(`${type === "TERMS_AND_CONDITIONS" ? "Terms & Conditions" : "Privacy Policy"} updated successfully.`);
        },
        onError: (error: any) => {
          toast.error(error?.message || "Failed to save legal document.");
        },
      }
    );
  };

  const parseContent = (content: string | undefined) => {
    if (!content) return undefined;
    try {
      return JSON.parse(content) as SerializedEditorState;
    } catch (e) {
      console.error("Failed to parse legal content", e);
      return undefined;
    }
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
            {isLoadingTerms ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <LegalEditor
                initialContent={parseContent(termsData?.data?.content)}
                onSave={(content) => handleSave("TERMS_AND_CONDITIONS", content)}
                isSaving={isSaving}
              />
            )}
          </TabsContent>

          <TabsContent
            value="privacy"
            className="mt-0 focus-visible:ring-0 focus-visible:outline-none"
          >
            {isLoadingPrivacy ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <LegalEditor
                initialContent={parseContent(privacyData?.data?.content)}
                onSave={(content) => handleSave("PRIVACY_POLICY", content)}
                isSaving={isSaving}
              />
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}
