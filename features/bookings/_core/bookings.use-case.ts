import { CreateBookingFormT } from "@/features/bookings/_core/bookings.definitions";
import {
  createBooking,
  isSlotAvailable,
} from "@/features/bookings/_core/bookings.services";

export const createBookingUseCase = async (input: CreateBookingFormT) => {
  const startDate = new Date(input.startsAt);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); //30 mins

  if (startDate < new Date()) {
    throw new Error("La fecha de inicio no puede ser en el pasado");
  }

  if (endDate <= startDate) {
    throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
  }

  const isAvailable = await isSlotAvailable(
    startDate.toISOString(),
    endDate.toISOString(),
  );

  if (!isAvailable) {
    throw new Error("El horario seleccionado ya no está disponible");
  }

  return createBooking({
    ...input,
    endsAt: endDate.toISOString(),
    status: "pending",
  });
};
