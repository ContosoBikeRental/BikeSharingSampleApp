using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace app.Exceptions
{
    public class ReservationNotFoundException : Exception
    {
        public ReservationNotFoundException(string reservationId)
            : base($"Couldn't find reservation with ID: {reservationId}")
        {

        }
    }
}
