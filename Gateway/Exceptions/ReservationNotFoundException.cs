using System;

namespace app.Exceptions
{
    public class ReservationNotFoundException : Exception
    {
        public ReservationNotFoundException(string reservationId)
            : base($"Couldn't find reservation with ID: {reservationId}")
        {}
    }
}
