"use server";

import {
  CreateBookingFormSchema,
  CreateBookingFormT,
} from "@/features/bookings/_core/bookings.definitions";
import { createBookingUseCase } from "@/features/bookings/_core/bookings.use-case";

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const createBookingAction = async (rawData: CreateBookingFormT) => {
  try {
    //1. Validar los datos que vienen del cliente de Zod
    const validationForm = CreateBookingFormSchema.safeParse(rawData);

    if (!validationForm.success) {
      const errorMessage =
        validationForm.error.issues[0]?.message ||
        "Datos del formulario inválidos";
      return { success: false, error: errorMessage };
    }

    //2. Llamar al caso de uso con los datos validados
    const newBooking = await createBookingUseCase(validationForm.data);

    //3. Devolver el exito
    return { success: true, data: newBooking };
  } catch (error) {
    // 4. Capturar errores de negocio (ej: horario ocupado) o de base de datos
    const message =
      error instanceof Error
        ? error.message
        : "Ocurrió un error inesperado al procesar la reserva";

    return { success: false, error: message };
  }
};
