const BASE_URL = "https://api.jgrants-portal.go.jp/exp/v1/public";

export interface JGrantsSubsidy {
  id: string;
  title: string;
  subsidy_max_limit?: number;
  acceptance_start_datetime?: string;
  acceptance_end_datetime?: string;
  target_area_search?: string;
  industry?: string;
  use_purpose?: string;
  detail?: string;
  supplementary?: string;
  url_1?: string;
  ministry_name?: string;
}

interface JGrantsListResponse {
  result: JGrantsSubsidy[];
  totalCount?: number;
}

interface JGrantsDetailResponse {
  result: JGrantsSubsidy;
}

export async function searchSubsidies(
  keyword: string,
  options?: {
    acceptance?: "1" | "2";
    limit?: number;
  }
): Promise<JGrantsSubsidy[]> {
  const params = new URLSearchParams();
  params.set("keyword", keyword);
  if (options?.acceptance) {
    params.set("acceptance", options.acceptance);
  }
  if (options?.limit) {
    params.set("limit", String(options.limit));
  }

  const res = await fetch(`${BASE_URL}/subsidies?${params.toString()}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`JGrants API error: ${res.status}`);
  }

  const data: JGrantsListResponse = await res.json();
  return data.result ?? [];
}

export async function getSubsidyDetail(id: string): Promise<JGrantsSubsidy | null> {
  const res = await fetch(`${BASE_URL}/subsidies/id/${id}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`JGrants API error: ${res.status}`);
  }

  const data: JGrantsDetailResponse = await res.json();
  return data.result ?? null;
}
