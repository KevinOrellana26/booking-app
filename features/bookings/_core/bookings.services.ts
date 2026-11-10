import {
  ApiBookingT,
  bookingAdapter,
  BookingT,
} from "@/features/bookings/_core/bookings.definitions";
import { createClient } from "@/lib/supabase/server";

export type CreateBookingDataT = Omit<BookingT, "id" | "createdAt">;
export const createBooking = async (data: CreateBookingDataT) => {
  // Hacer un fetch a la API y despues hacer un return response.

  const apiData = {
    customer_name: data.customerName,
    customer_email: data.customerEmail,
    starts_at: data.startsAt,
    ends_at: data.endsAt,
    status: data.status,
  };

  try {
    const supabase = await createClient();
    const { data: newBooking, error } = await supabase
      .from("bookings")
      .insert(apiData)
      .select()
      .single();

    if (error || !newBooking) {
      throw new Error(error?.message || "No se pudo crear la reserva");
    }

    return bookingAdapter(newBooking as ApiBookingT);
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const isSlotAvailable = async (
  startsAt: string,
  endsAt: string,
): Promise<boolean> => {
  try {
    const supabase = await createClient();

    const { data: overlappingBookings, error } = await supabase
      .from("bookings")
      .select("id")
      .neq("status", "cancelled") // Distinto de cancelado
      .lt("starts_at", endsAt) // Empieza antes de que termine el slot
      .gt("ends_at", startsAt); // Termina despues de que empiece el slot

    if (error) {
      throw new Error(`Error checking availability: ${error.message}`);
    }

    return overlappingBookings.length === 0;
  } catch (error) {
    console.error("Error checking slot availability:", error);
    throw error;
  }
};
