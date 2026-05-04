"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "../components/AdminPageHeader";
import { NewsletterList } from "./components/NewsletterList";
import { INewsletter } from "@/types/newsletter";
import { NewsletterFormModal } from "./components/NewsletterFormModal";

export default function NewsletterAdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState<INewsletter | undefined>(undefined);

  const handleEdit = (newsletter: INewsletter) => {
    setSelectedNewsletter(newsletter);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedNewsletter(undefined);
    setIsModalOpen(true);
  };

  return (
    <>
      <AdminPageHeader
        title="Newsletter Management"
        subtitle="Create and manage blog posts for the home page."
      >
        <Button
          onClick={handleCreate}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </AdminPageHeader>

      <div className="mt-8">
        <NewsletterList onEdit={handleEdit} />
      </div>

      <NewsletterFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newsletter={selectedNewsletter}
      />
    </>
  );
}
