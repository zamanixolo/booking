export interface OperatingHourType {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Helper to format operating hours
function formatOperatingHour(row: any): OperatingHourType {
  return {
    id: row.id,
    dayOfWeek: row.dayOfWeek,
    startTime: row.startTime,
    endTime: row.endTime,
    isActive: row.isActive ?? true,
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

// CREATE / UPSERT
export const createOrUpdateOperatingHour = async (
  data: Partial<OperatingHourType>
): Promise<OperatingHourType> => {

  const now = new Date().toISOString();

  // Ensure timestamps exist
  const record = {
    ...data,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };

  const columns = Object.keys(record).join(",");
  const values = Object.values(record)
    .map((v) => `'${v?.toString().replace("'", "''")}'`)
    .join(",");

  const sql = `
    INSERT INTO OperatingHours (${columns})
    VALUES (${values})
    ON CONFLICT(dayOfWeek) DO UPDATE SET 
      startTime   = excluded.startTime, 
      endTime     = excluded.endTime, 
      isActive    = excluded.isActive,
      updatedAt   = '${now}'
    RETURNING *;
  `;

  const result = await runQuery(sql);
  return formatOperatingHour(result[0]);
};
// READ all
export const getAllOperatingHours = async (): Promise<OperatingHourType[]> => {
  const rows = await runQuery("SELECT * FROM OperatingHours ORDER BY dayOfWeek ASC;");
  return rows[0].results;
};

// READ by ID
export const getOperatingHourById = async (id: string): Promise<OperatingHourType | null> => {
  const rows = await runQuery(`SELECT * FROM OperatingHours WHERE id='${id}' LIMIT 1;`);
  if (!rows.length) return null;
  return formatOperatingHour(rows[0]);
};

// UPDATE by ID
export const updateOperatingHour = async (id: string, data: Partial<OperatingHourType>): Promise<OperatingHourType> => {
  const updates = Object.entries(data)
    .map(([k,v]) => `${k}='${v?.toString().replace("'", "''")}'`)
    .join(",");
  
  const sql = `UPDATE OperatingHours SET ${updates}, updatedAt=CURRENT_TIMESTAMP WHERE id='${id}' RETURNING *;`;
  const result = await runQuery(sql);
  return formatOperatingHour(result[0]);
};

// DELETE by ID (soft delete)
export const deleteOperatingHour = async (id: string): Promise<void> => {
  console.log(`hour to delete :${id}`)
  const sql = `DELETE FROM OperatingHours WHERE id='${id}';`;
  const result = await runQuery(sql);
  console.log(result)
  return result;
};


// // CREATE Operating Hours (with upsert to handle duplicates)
// export const createOperatingHours = async (operatingHoursData: {
//   providerId: string;
//   dayOfWeek: number;
//   startTime: string;
//   endTime: string;
// }) => {
//   return await prisma.operatingHours.upsert({
//     where: {
//       providerId_dayOfWeek: {
//         providerId: operatingHoursData.providerId,
//         dayOfWeek: operatingHoursData.dayOfWeek
//       }
//     },
//     update: {
//       startTime: operatingHoursData.startTime,
//       endTime: operatingHoursData.endTime,
//       isActive: true
//     },
//     create: operatingHoursData
//   });
// };

// // READ Operating Hours
// export const getOperatingHoursByProvider = async (providerId: string) => {
//   return await prisma.operatingHours.findMany({
//     where: { providerId, isActive: true },
//     orderBy: { dayOfWeek: 'asc' }
//   });
// };

// export const getOperatingHoursByDay = async (providerId: string, dayOfWeek: number) => {
//   return await prisma.operatingHours.findUnique({
//     where: {
//       providerId_dayOfWeek: {
//         providerId,
//         dayOfWeek
//       }
//     }
//   });
// };

// // Get all operating hours (including inactive)
// export const getAllOperatingHoursByProvider = async (providerId: string) => {
//   return await prisma.operatingHours.findMany({
//     where: { providerId },
//     orderBy: { dayOfWeek: 'asc' }
//   });
// };

// // UPDATE Operating Hours
// export const updateOperatingHours = async (id: string, updateData: {
//   startTime?: string;
//   endTime?: string;
//   isActive?: boolean;
// }) => {
//   return await prisma.operatingHours.update({
//     where: { id },
//     data: updateData
//   });
// };

// // Bulk update operating hours
// export const updateOperatingHoursBulk = async (updates: {
//   id: string;
//   startTime?: string;
//   endTime?: string;
//   isActive?: boolean;
// }[]) => {
//   const transactions = updates.map(update =>
//     prisma.operatingHours.update({
//       where: { id: update.id },
//       data: {
//         startTime: update.startTime,
//         endTime: update.endTime,
//         isActive: update.isActive
//       }
//     })
//   );

//   return await prisma.$transaction(transactions);
// };

// // DELETE Operating Hours
// export const deleteOperatingHours = async (id: string) => {
//   return await prisma.operatingHours.delete({
//     where: { id }
//   });
// };

// // Soft delete (set isActive to false)
// export const deactivateOperatingHours = async (id: string) => {
//   return await prisma.operatingHours.update({
//     where: { id },
//     data: { isActive: false }
//   });
// };