export interface ProviderType {
  id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email?: string;
  imageurl?: string;
  bio?: string;
  role: string; // string instead of Prisma enum
  userId?: string;
  isAvailable: boolean;
  rating: number;
  totalReviews: number;
  user?: any | null;
  bookings?: any[];
  bookingSettings?: any[];
  createdAt: string;
  updatedAt: string;
}

// Helper to format provider
function formatProvider(p: any): ProviderType|undefined {
  if(!p){return}
  return {
    id: p.id,
    clerkId: p.clerkId || "",
    firstName: p.firstName,
    lastName: p.lastName,
    email: p.email || undefined,
    imageurl: p.imageurl || undefined,
    bio: p.bio || undefined,
    role: p.role || "TRAINER",
    userId: p.userId || undefined,
    isAvailable: p.isAvailable ?? true,
    rating: p.rating ?? 0,
    totalReviews: p.totalReviews ?? 0,
    user: p.user || null,
    bookings: p.bookings || [],
    bookingSettings: p.bookingSettings || [],
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

// ---------------------------
// D1 fetch helper
// ---------------------------
async function runQuery(sql: string) {
  const res = await fetch(process.env.CLOUDFLAIRAPI!, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.CLOUDFLARE_D1_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`D1 query failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const data:any = await res.json();
  return data.result || [];
}

// ---------------------------
// CREATE provider
// ---------------------------
export const createProvider = async (data: Partial<ProviderType>): Promise<ProviderType> => {
  const columns = Object.keys(data).join(",");
  const values = Object.values(data)
    .map((v) => `'${v?.toString().replace("'", "''")}'`)
    .join(",");
  const sql = `INSERT INTO Provider (${columns}) VALUES (${values}) RETURNING *;`;
  const result = await runQuery(sql);

  return result[0].results[0];
};

// ---------------------------
// READ all providers
// ---------------------------
export const getAllProviders = async (): Promise<ProviderType[]> => {
  const rows = await runQuery("SELECT * FROM Provider;");
  return rows[0].results
};

// ---------------------------
// READ provider by ID
// ---------------------------
export const getProviderById = async (id: string): Promise<ProviderType | null> => {
  const rows = await runQuery(`SELECT * FROM Provider WHERE id='${id}' LIMIT 1;`);
  if (!rows.length) return null;
  return formatProvider(rows[0]);
};

// ---------------------------
// READ provider by Clerk ID
// ---------------------------
export const getProviderByClerkId = async (clerkId: string): Promise<ProviderType | null> => {
  const rows = await runQuery(`SELECT * FROM Provider WHERE clerkId='${clerkId}' LIMIT 1;`);
 
  if (!rows.length) return null;
  return formatProvider(rows[0].results[0]);
};

// ---------------------------
// READ available providers
// ---------------------------
export const getProviderAvailable = async (): Promise<ProviderType[]> => {
  const rows = await runQuery("SELECT * FROM Provider WHERE isAvailable=1;");
  return rows[0].results;
};

// ---------------------------
// UPDATE provider by ID
// ---------------------------
export const updateProvider = async (
  id: string,
  data: Partial<ProviderType>
): Promise<ProviderType> => {
  const updates = Object.entries(data)
    .map(([k, v]) => `${k}='${v?.toString().replace("'", "''")}'`)
    .join(",");
  const sql = `UPDATE Provider SET ${updates}, updatedAt=CURRENT_TIMESTAMP WHERE id='${id}' RETURNING *;`;
  const result = await runQuery(sql);
  return formatProvider(result[0]);
};

// ---------------------------
// DELETE provider by ID
// ---------------------------
export const deleteProvider = async (id: string): Promise<void> => {
  await runQuery(`DELETE FROM Provider WHERE id='${id}';`);
};
