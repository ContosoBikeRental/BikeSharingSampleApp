// --------------------------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// --------------------------------------------------------------------------------------------

namespace app
{
    public class Constants
    {
        public const string UsersMicroserviceEnv = "USERS_DNSNAME";

        public const string BikesMicroserviceEnv = "BIKES_DNSNAME";

        public const string ReservationsMicroserviceEnv = "RESERVATION_DNSNAME";

        public const string ReservationEngineMicroserviceEnv = "RESERVATIONENGINE_DNSNAME";

        public const string BillingMicroserviceEnv = "BILLING_DNSNAME";

        public const string RequestIdHeaderName = "x-contoso-request-id";

        public const string RouteAsHeaderName = "azds-route-as";

        public const string ApplicationInsightsKeyEnv = "APPLICATIONINSIGHTS_INSTRUMENTATIONKEY";
    }
}