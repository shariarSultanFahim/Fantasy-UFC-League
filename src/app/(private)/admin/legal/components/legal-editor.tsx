"use client";

import { useEffect, useState } from "react";

import { RotateCcw, Save, Loader2 } from "lucide-react";
import { SerializedEditorState } from "lexical";

import { Editor } from "@/components/blocks/editor-00/editor";
import { Button } from "@/components/ui/button";

interface LegalEditorProps {
  initialContent?: SerializedEditorState;
  onSave: (content: SerializedEditorState | undefined) => void;
  isSaving?: boolean;
}

const defaultInitialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Start writing your legal document here...",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export function LegalEditor({ initialContent, onSave, isSaving }: LegalEditorProps) {
  const [content, setContent] = useState<SerializedEditorState | undefined>(
    initialContent || defaultInitialValue
  );

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const handleSave = () => {
    onSave(content);
  };

  const handleReset = () => {
    setContent(initialContent || defaultInitialValue);
  };

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="min-h-100">
        <Editor editorSerializedState={content} onSerializedChange={setContent} />
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-6">
        <Button
          variant="ghost"
          onClick={handleReset}
          disabled={isSaving}
          className="font-medium text-[#475467] hover:text-[#202c45]"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to {initialContent ? "Saved" : "Default"}
        </Button>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-[140px] text-white shadow-sm shadow-primary/20 hover:bg-primary/90"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
