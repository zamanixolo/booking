export interface UserType {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  imageurl?: string;
  role: string; // use string instead of Prisma enum
  provider?: any | null;
  createdAt: string;
  updatedAt: string;
}

// Helper to format user object
function formatUser(user: any): UserType {
  return {
    id: user.id,
    clerkId: user.clerkId || "",
    email: user.email || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || undefined,
    imageurl: user.imageurl || undefined,
    role: user.role || "CLIENT",
    provider: user.provider || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// ---------------------------
// Fetch helper for D1
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
// Create a new user
// ---------------------------
export const createUser = async (data: Partial<UserType>): Promise<UserType> => {
  if (!data.clerkId) throw new Error("clerkId is required");
   data.id = data.clerkId;
  const columns = Object.keys(data).join(",");
  const values = Object.values(data)
    .map((v) => `'${v?.toString().replace("'", "''")}'`)
    .join(",");
  const sql = `INSERT INTO User (${columns}) VALUES (${values}) RETURNING *;`;
  const result = await runQuery(sql);
  
  return formatUser(result[0]);
};

// ---------------------------
// Get all users
// ---------------------------
export const getUsers = async (): Promise<UserType[]> => {
  const rows = await runQuery("SELECT * FROM User;");
  return rows.map(formatUser);
};

// ---------------------------
// Get user by ID
// ---------------------------
export const getUserById = async (id: string): Promise<UserType | null> => {
  const rows = await runQuery(`SELECT * FROM User WHERE id='${id}' LIMIT 1;`);
  if (!rows.length) return null;
  return formatUser(rows[0]);
};

// ---------------------------
// Get user by Clerk ID
// ---------------------------
export const getUserByClerkId = async (clerkId: string): Promise<UserType | null> => {
  const rows = await runQuery(`SELECT * FROM User WHERE clerkId='${clerkId}' LIMIT 1;`);

  if (!rows[0].results[0]) return null;

  return rows[0].results[0];
};

// ---------------------------
// Update user by ID
// ---------------------------
export const updateUser = async (
  id: string,
  data: Partial<UserType>
): Promise<UserType> => {
  const updates = Object.entries(data)
    .map(([k, v]) => `${k}='${v?.toString().replace("'", "''")}'`)
    .join(",");
  const sql = `UPDATE User SET ${updates}, updatedAt=CURRENT_TIMESTAMP WHERE id='${id}' RETURNING *;`;
  const result = await runQuery(sql);
  return formatUser(result[0]);
};

// ---------------------------
// Update user by Clerk ID
// ---------------------------
export const updateUserByClerkId = async (
  clerkId: string,
  data: Partial<UserType>
): Promise<UserType> => {
  const updates = Object.entries(data)
    .map(([k, v]) => `${k}='${v?.toString().replace("'", "''")}'`)
    .join(",");
  const sql = `UPDATE User SET ${updates}, updatedAt=CURRENT_TIMESTAMP WHERE clerkId='${clerkId}' RETURNING *;`;
  const result = await runQuery(sql);
  return formatUser(result[0]);
};
