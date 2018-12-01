using app.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace app
{
    public static class MongoHelper
    {
        private static string _connectionString { get; set; }

        private static string _database { get; set; }

        private static string _collection { get; set; }

        private static MongoClient _mongoClient;

        public static void Init(CustomConfiguration customConfiguration)
        {
            LogUtility.Log("MongoHelper init start");
            _connectionString = Environment.GetEnvironmentVariable(Constants.MongoDbConnectionStringEnv) ?? customConfiguration.MongoDBConnectionInfo.ConnectionString;
            _database = Environment.GetEnvironmentVariable(Constants.MongoDbDatabaseEnv) ?? customConfiguration.MongoDBConnectionInfo.Database;
            _collection = Environment.GetEnvironmentVariable(Constants.MongoDbCollectionEnv) ?? customConfiguration.MongoDBConnectionInfo.Collection;
            _mongoClient = new MongoClient(_connectionString);
            LogUtility.Log("MongoHelper init end");
        }

        /// <summary>
        /// Updates ONLY the State field of the reservation in the DB
        /// </summary>
        /// <param name="reservationDetails"></param>
        /// <returns></returns>
        public static async Task<UpdateResult> UpdateReservationStateAndEndTime(Guid requestId, Reservation reservationDetails)
        {
            LogUtility.LogWithContext(requestId, "Updating reservationID " + reservationDetails.ReservationId);
            var db = _mongoClient.GetDatabase(_database);
            var collection = db.GetCollection<Reservation>(_collection).WithWriteConcern(new WriteConcern("majority"));
            
            var filter = Builders<Reservation>.Filter.Eq("reservationId", reservationDetails.ReservationId);
            var update = Builders<Reservation>.Update.Set("state", reservationDetails.State).Set("endTime", reservationDetails.EndTime);

            var result = await collection.UpdateOneAsync(filter, update);
            return result;
        }
    }
}
