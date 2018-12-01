using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace app.Models.Reservations
{
    public enum ReservationState
    {
        Booking = 1,
        Completing = 2,
        Booked = 3,
        Completed = 4,
        Failed = 5
    }
}
