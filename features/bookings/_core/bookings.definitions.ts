import { z } from "zod";

// Esquema de validación para el formulario de creación de reservas
export const CreateBookingFormSchema = z.object({
  customerName: z
    .string()
    .min(2, "El cliente debe tener al menos 2 caracteres"),
  customerEmail: z.email("El correo electrónico no es válido"),
  startsAt: z.iso.datetime("La fecha y hora de inicio no es válida"),
});
export type CreateBookingFormT = z.infer<typeof CreateBookingFormSchema>;

// ------------------------------------------------------------------------------------

// Entidad de Dominio
export const BookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
]);
export type BookingStatusT = z.infer<typeof BookingStatusSchema>;

// Creamos un diccionario para utilizarlo en la capa de presentación
export const BOOKING_STATUS_LABELS: Record<BookingStatusT, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};
// <Badge>{BOOKING_STATUS_LABELS[booking.status]}</Badge> <- Uso en la capa de presentación

export const ApiBookingSchema = z.object({
  id: z.uuid(),
  customer_name: z.string(),
  customer_email: z.string(),
  starts_at: z.string(),
  ends_at: z.string(),
  status: BookingStatusSchema,
  created_at: z.string(),
});
export type ApiBookingT = z.infer<typeof ApiBookingSchema>;

export const BookingSchema = z.object({
  id: z.uuid(),
  customerName: z.string(),
  customerEmail: z.email(),
  startsAt: z.iso.datetime(),
  endsAt: z.iso.datetime(),
  status: BookingStatusSchema,
  createdAt: z.iso.datetime(),
});
export type BookingT = z.infer<typeof BookingSchema>;

export const bookingAdapter = (apiBooking: ApiBookingT): BookingT => ({
  id: apiBooking.id,
  customerName: apiBooking.customer_name,
  customerEmail: apiBooking.customer_email,
  startsAt: apiBooking.starts_at,
  endsAt: apiBooking.ends_at,
  status: apiBooking.status,
  createdAt: apiBooking.created_at,
});
