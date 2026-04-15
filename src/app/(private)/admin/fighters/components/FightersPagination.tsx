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

interface FightersPaginationProps {
  page: number;
  limit: number;
  totalPage: number;
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

export function FightersPagination({
  page,
  limit,
  totalPage,
  onPageChange
}: FightersPaginationProps) {
  const tokens = buildPaginationTokens(page, totalPage);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-4 sm:flex-row sm:px-6">
      <p className="text-sm text-muted-foreground">
        Showing {(page - 1) * limit + 1}-{Math.min(page * limit, totalPage * limit)}
      </p>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              size="sm"
              onClick={() => onPageChange(Math.max(page - 1, 1))}
              disabled={page === 1}
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
                <PaginationLink
                  size="sm"
                  isActive={token === page}
                  onClick={() => onPageChange(token)}
                >
                  {token}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              size="sm"
              onClick={() => onPageChange(Math.min(page + 1, totalPage))}
              disabled={page === totalPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
