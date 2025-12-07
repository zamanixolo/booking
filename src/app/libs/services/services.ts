export interface ServiceType {
  id: string
  name: string
  description?: string
  duration?: number
  price?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ---------------------------
// Helper to format service
// ---------------------------
function formatService(s: any): ServiceType {
  return {
    id: s.id,
    name: s.name,
    description: s.description || undefined,
    duration: s.duration ?? undefined,
    price: s.price ?? undefined,
    isActive: s.isActive ?? true,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }
}

// ---------------------------
// D1 runQuery helper
// ---------------------------
async function runQuery(sql: string) {
  const res = await fetch(process.env.CLOUDFLAIRAPI!, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.CLOUDFLARE_D1_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`D1 query failed: ${res.status} ${res.statusText} - ${text}`)
  }

  const data: any = await res.json()
  return data.result || []
}

// ---------------------------
// CREATE service
// ---------------------------
export const createService = async (data: Partial<ServiceType>): Promise<ServiceType> => {
  const columns = Object.keys(data).join(",")
  const values = Object.values(data)
    .map((v) => `'${v?.toString().replace("'", "''")}'`)
    .join(",")
  const sql = `INSERT INTO Service (${columns}) VALUES (${values}) RETURNING *;`
  const result = await runQuery(sql)

  return result[0].results[0]
}

// ---------------------------
// READ all services
// ---------------------------
export const getAllServices = async (): Promise<ServiceType[]> => {
  const rows = await runQuery("SELECT * FROM Service;")

  return rows[0].results
}

// ---------------------------
// READ service by ID
// ---------------------------
export const getServiceById = async (id: string): Promise<ServiceType | null> => {
  const rows = await runQuery(`SELECT * FROM Service WHERE id='${id}' LIMIT 1;`)
  if (!rows.length) return null
  return formatService(rows[0])
}

// ---------------------------
// UPDATE service by ID
// ---------------------------
export const updateService = async (id: string, data: Partial<ServiceType>): Promise<ServiceType> => {
  const updates = Object.entries(data)
    .map(([k, v]) => `${k}='${v?.toString().replace("'", "''")}'`)
    .join(",");

  const sql = `
    UPDATE Service 
    SET ${updates}, updatedAt=CURRENT_TIMESTAMP 
    WHERE id='${id}' 
    RETURNING *;
  `;

  const result = await runQuery(sql);

  // Cloudflare format → result[0].results[0]
  const updatedRow = result[0].results[0];

  return formatService(updatedRow);
};


// ---------------------------
// DELETE service (soft delete)
// ---------------------------
export const deleteService = async (id: string): Promise<void> => {

  await runQuery(`DELETE FROM Service WHERE id='${id}';`)
}
