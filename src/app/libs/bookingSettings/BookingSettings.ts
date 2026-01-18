export interface BookingSettingsType {
  id: string;
  serviceId: string;
  providerIds: string[]; // store as comma-separated string
  defaultSessionDuration: number;
  defaultPrice: number;
  createdAt: string;
  updatedAt: string;
}

// Helper to format BookingSettings object
function formatBookingSettings(row: any): BookingSettingsType {
  return {
    id: row.id,
    serviceId: row.serviceId,
    providerIds: row.providerIds ? row.providerIds.split(',').filter(Boolean) : [],
    defaultSessionDuration: row.defaultSessionDuration,
    defaultPrice: row.defaultPrice,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// D1 runQuery helper
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

  const data: any = await res.json();
  return data.result || [];
}

// ---------------------------
// CREATE BookingSettings
// ---------------------------
export const createBookingSettings = async (data: {
  providerIds: string[];
  serviceId: string;
  defaultSessionDuration: number;
  defaultPrice: number;
}): Promise<BookingSettingsType> => {
  const id = `${data.serviceId}`;
  const providerIdsStr = data.providerIds.map((p) => p.replace("'", "''")).join(',');
  
  const sql = `
    INSERT INTO BookingSettings (id, serviceId, providerIds, defaultSessionDuration, defaultPrice, createdAt, updatedAt)
    VALUES ('${id}', '${data.serviceId}', '${providerIdsStr}', ${data.defaultSessionDuration}, ${data.defaultPrice}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    RETURNING *;
  `;

  const result = await runQuery(sql);

  return formatBookingSettings(result[0]);
};

// ---------------------------
// READ all BookingSettings
// ---------------------------
export const getBookingSettings = async (): Promise<BookingSettingsType[]> => {
  const rows = await runQuery(`SELECT * FROM BookingSettings ORDER BY createdAt ASC;`);
  // console.log(rows[0].results)
  return rows[0].results;
};

// ---------------------------
// READ BookingSettings by ID
// ---------------------------
export const getBookingSettingsById = async (id: string): Promise<BookingSettingsType | null> => {
  const rows = await runQuery(`SELECT * FROM BookingSettings WHERE id='${id}' LIMIT 1;`);
  if (!rows.length) return null;
 
  return rows[0].results;
};

// ---------------------------
// UPDATE BookingSettings
// ---------------------------
export const updateBookingSettings = async (
  id: string,
  data: Partial<Omit<BookingSettingsType, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<BookingSettingsType> => {
  const updates = Object.entries(data)
    .map(([k, v]) => {
      if (k === 'providerIds') return `providerIds='${(v as string[]).map((p) => p.replace("'", "''")).join(',')}'`;
      if (typeof v === 'string') return `${k}='${v.replace("'", "''")}'`;
      return `${k}=${v}`;
    })
    .join(',');

  const sql = `
    UPDATE BookingSettings
    SET ${updates}, updatedAt=CURRENT_TIMESTAMP
    WHERE id='${id}'
    RETURNING *;
  `;

  const result = await runQuery(sql);
  return formatBookingSettings(result[0]);
};

// ---------------------------
// DELETE BookingSettings (soft delete)
// ---------------------------
export const deleteBookingSettings = async (id: string): Promise<BookingSettingsType> => {
  const sql = `
    UPDATE BookingSettings
    SET providerIds='[]', defaultSessionDuration=0, defaultPrice=0, updatedAt=CURRENT_TIMESTAMP
    WHERE id='${id}'
    RETURNING *;
  `;
  const result = await runQuery(sql);
  return formatBookingSettings(result[0]);
};
