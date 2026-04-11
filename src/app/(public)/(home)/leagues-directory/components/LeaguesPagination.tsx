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

interface LeaguesPaginationProps {
  page: number;
  limit: number;
  totalCount: number;
  totalPage: number;
  onPageChange: (nextPage: number) => void;
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

  for (let index = page - 1; index <= page + 1; index += 1) {
    if (index > 2 && index < totalPage) {
      pushPage(index);
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

export function LeaguesPagination({
  page,
  limit,
  totalCount,
  totalPage,
  onPageChange
}: LeaguesPaginationProps) {
  if (totalPage === 0) {
    return null;
  }

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalCount);
  const tokens = buildPaginationTokens(page, totalPage);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-4 sm:flex-row sm:px-6">
      <p className="text-sm text-muted-foreground">
        Showing {start}-{end} of {totalCount}
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
