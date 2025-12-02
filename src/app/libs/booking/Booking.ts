// app/libs/bookings/bookings.ts

export interface BookingType {
  id: string;
  clientId?: string;
  providerId: string;
  serviceId: string;
  price: number;
  sessionDuration: number;
  date: string; // ISO string
  time: string;
  status: string; // can be PENDING, CONFIRMED, CANCELLED, etc.
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------
// Helper to format Booking object
// ---------------------------
function formatBooking(row: any): BookingType {
  return {
    id: row.id,
    clientId: row.clientId || undefined,
    providerId: row.providerId,
    serviceId: row.serviceId,
    price: row.price,
    sessionDuration: row.sessionDuration,
    date: row.date,
    time: row.time,
    status: row.status,
    specialRequests: row.specialRequests || undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
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
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`D1 query failed: ${res.status} ${res.statusText} - ${text}`);
  }

  const data: any = await res.json();
  return data.result || [];
}

// ---------------------------
// CREATE Booking
// ---------------------------
export const createBooking = async (data: {
  clientId?: string;
  providerId: string;
  serviceId: string;
  price: number;
  sessionDuration: number;
  date: string | Date;
  time: string;
  specialRequests?: string;
}): Promise<BookingType> => {
  const id = `${data.providerId}-${Math.random()}`;
  const dateStr = data.date instanceof Date ? data.date.toISOString() : data.date;

  const sql = `
    INSERT INTO Booking (
      id, clientId, providerId, serviceId, price, sessionDuration, date, time, status, specialRequests, createdAt, updatedAt
    ) VALUES (
      '${id}',
      ${data.clientId ? `'${data.clientId}'` : 'NULL'},
      '${data.providerId}',
      '${data.serviceId}',
      ${data.price},
      ${data.sessionDuration},
      '${dateStr}',
      '${data.time}',
      'PENDING',
      ${data.specialRequests ? `'${data.specialRequests.replace("'", "''")}'` : 'NULL'},
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
    RETURNING *;
  `;

  const result = await runQuery(sql);

  return result[0].results[0]
};

// ---------------------------
// READ - Get all bookings
// ---------------------------
export const getAllBookings = async (): Promise<BookingType[]> => {
  const rows = await runQuery(`SELECT * FROM Booking ORDER BY date DESC;`);
  return rows[0].results;
};

// ---------------------------
// READ - Get bookings by client
// ---------------------------
export const getBookingsByClient = async (clientId: string): Promise<BookingType[]> => {
  const rows = await runQuery(`SELECT * FROM Booking WHERE clientId='${clientId}' ORDER BY date DESC;`);
  
  return rows[0].results;
};

// ---------------------------
// READ - Get single booking by ID
// ---------------------------
export const getBookingById = async (id: string): Promise<BookingType | null> => {
  const rows = await runQuery(`SELECT * FROM Booking WHERE id='${id}' LIMIT 1;`);
  
  if (!rows.length) return null;
  return formatBooking(rows[0]);
};

// ---------------------------
// READ - Get bookings by provider
// ---------------------------
export const getBookingsByProvider = async (providerId: string): Promise<BookingType[]> => {
  const rows = await runQuery(`SELECT * FROM Booking WHERE providerId='${providerId}' ORDER BY date DESC;`);
  return rows.map(formatBooking);
};

// ---------------------------
// UPDATE Booking
// ---------------------------
export const updateBooking = async (
  id: string,
  data: Partial<Omit<BookingType, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<BookingType> => {
  const updates = Object.entries(data)
    .map(([k, v]) => {
      if (v === null) return `${k}=NULL`;
      if (k === 'date') {
       const dateStr =
       typeof v === "object" && v !== null && "toISOString" in v
        ? (v as Date).toISOString()
        : v;

        return `date='${dateStr}'`;
      }
      if (typeof v === 'string') return `${k}='${v.replace("'", "''")}'`;
      return `${k}=${v}`;
    })
    .join(',');

  const sql = `
    UPDATE Booking
    SET ${updates}, updatedAt=CURRENT_TIMESTAMP
    WHERE id='${id}'
    RETURNING *;
  `;

  const result = await runQuery(sql);
  return formatBooking(result[0]);
};

// ---------------------------
// DELETE Booking
// ---------------------------
export const deleteBooking = async (id: string): Promise<BookingType> => {
  const sql = `
    DELETE FROM Booking
    WHERE id='${id}'
    RETURNING *;
  `;
  const result = await runQuery(sql);
  return formatBooking(result[0]);
};
