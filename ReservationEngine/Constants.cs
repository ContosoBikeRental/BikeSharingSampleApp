// --------------------------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// --------------------------------------------------------------------------------------------

namespace app
{
    public class Constants
    {
        public const string MongoDbConnectionStringEnv = "MONGO_CONNECTIONSTRING";

        public const string MongoDbDatabaseEnv = "MONGO_DBNAME";

        public const string MongoDbCollectionEnv = "MONGO_COLLECTION";

        public const string BikesMicroserviceEnv = "BIKES_DNSNAME";

        public const string BillingMicroserviceEnv = "BILLING_DNSNAME";

        public const string RequestIdHeaderName = "x-contoso-request-id";

        public const string RouteAsHeaderName = "azds-route-as";
    }
}