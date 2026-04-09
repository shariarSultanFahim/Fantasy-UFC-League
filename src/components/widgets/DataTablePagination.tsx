"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui";

interface DataTablePaginationProps {
  page: number;
  limit: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

type PaginationToken = number | "ellipsis";

function buildPaginationTokens(page: number, totalPage: number): PaginationToken[] {
  const tokens: PaginationToken[] = [];
  const pushPage = (pageNumber: number) => {
    if (!tokens.includes(pageNumber)) {
      tokens.push(pageNumber);
    }
  };

  pushPage(1);
  pushPage(2);

  if (page - 1 > 2) {
    tokens.push("ellipsis");
  }

  for (let i = page - 1; i <= page + 1; i += 1) {
    if (i > 2 && i < totalPage) {
      pushPage(i);
    }
  }

  if (page + 1 < totalPage - 1) {
    tokens.push("ellipsis");
  }

  if (totalPage > 2) {
    pushPage(totalPage - 1);
  }

  if (totalPage > 1) {
    pushPage(totalPage);
  }

  return tokens;
}

export function DataTablePagination({ page, limit, totalItems, onPageChange }: DataTablePaginationProps) {
  const totalPage = Math.max(1, Math.ceil(totalItems / limit));
  const safePage = Math.min(Math.max(page, 1), totalPage);
  const tokens = buildPaginationTokens(safePage, totalPage);
  const start = totalItems === 0 ? 0 : (safePage - 1) * limit + 1;
  const end = Math.min(safePage * limit, totalItems);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-4 sm:flex-row sm:px-6">
      <p className="text-sm text-muted-foreground">
        Showing {start}-{end} of {totalItems}
      </p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(safePage - 1, 1))}
              disabled={safePage === 1}
            />
          </PaginationItem>

          {tokens.map((token, index) => {
            if (token === "ellipsis") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={token}>
                <PaginationLink isActive={token === safePage} onClick={() => onPageChange(token)}>
                  {token}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(safePage + 1, totalPage))}
              disabled={safePage === totalPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
