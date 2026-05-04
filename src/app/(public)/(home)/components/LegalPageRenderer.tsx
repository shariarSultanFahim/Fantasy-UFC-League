"use client";

import { useLegalDocument } from "@/lib/actions/legal";
import { LegalDocumentType } from "@/types/legal";
import { Editor } from "@/components/blocks/editor-00/editor";
import { SerializedEditorState } from "lexical";
import { Loader2 } from "lucide-react";

interface LegalPageRendererProps {
  type: LegalDocumentType;
  fallback: React.ReactNode;
}

export function LegalPageRenderer({ type, fallback }: LegalPageRendererProps) {
  const { data, isLoading, error } = useLegalDocument(type);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If there's an error or no data (e.g., 404), show the fallback
  if (error || !data?.data?.content) {
    return <>{fallback}</>;
  }

  try {
    const serializedState = JSON.parse(data.data.content) as SerializedEditorState;
    return (
      <div className="prose prose-slate max-w-none">
        <Editor
          editorSerializedState={serializedState}
          readOnly={true}
          namespace={`LegalView-${type}`}
        />
      </div>
    );
  } catch (e) {
    console.error("Failed to parse legal content", e);
    return <>{fallback}</>;
  }
}
