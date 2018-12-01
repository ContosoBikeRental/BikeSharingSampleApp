// --------------------------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation. All rights reserved.
// --------------------------------------------------------------------------------------------

using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using app.Models;
using app.Models.Reservations;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace app.Controllers
{
    [Route("api/reservation")]
    public class ReservationController : Controller
    {
        private CustomConfiguration _customConfiguration { get; set; }

        private string _reservationsService { get; set; }

        private string _reservationEngineService { get; set; }

        private const string DateTimeFormat = "yyyy-MM-ddTHH:mm:ss";

        public ReservationController(IOptions<CustomConfiguration> customConfiguration)
        {
            _customConfiguration = customConfiguration.Value;
            _reservationsService = Environment.GetEnvironmentVariable(Constants.ReservationsMicroserviceEnv) ?? _customConfiguration.Services.Reservations;
            _reservationEngineService = Environment.GetEnvironmentVariable(Constants.ReservationEngineMicroserviceEnv) ?? _customConfiguration.Services.ReservationEngine;
        }

        // POST: api/reservationengine
        private async Task<IActionResult> _UpdateReservation(Reservation reservationDetails)
        {
            // return await HttpHelper.ReturnResponseResult(response);
            string updateReservationUrl = $"http://{_reservationEngineService}/api/reservationengine";
            var response = await HttpHelper.PostAsync(updateReservationUrl, new StringContent(
                JsonConvert.SerializeObject(reservationDetails), Encoding.UTF8, "application/json"), this.Request);
            if (response.IsSuccessStatusCode)
            {
                return new JsonResult(reservationDetails);
            }
            return await HttpHelper.ReturnResponseResult(response);
        }

        /// <summary>
        /// Returns null on success
        /// </summary>
        /// <param name="config">The config to use when creating the billing controller</param>
        /// <param name="res"></param>
        /// <returns></returns>
        internal static async Task<IActionResult> _AddInvoiceDetailsToReservation(CustomConfiguration config, Reservation res)
        {
            var billingController = new BillingController(Options.Create(config));
            var getInvoiceResponse = await billingController.GetInvoiceForReservationId(res.ReservationId);
            if (!(getInvoiceResponse is JsonResult))
            {
                var getInvoiceContentResult = getInvoiceResponse as ContentResult;
                if (getInvoiceContentResult == null)
                {
                    return HttpHelper.Return500Result("Unexpected IActionResult when getting invoice for reservation id");
                }
                if (getInvoiceContentResult.StatusCode != (int)HttpStatusCode.NotFound)
                {
                    return getInvoiceContentResult;
                }

                // Valid case
                res.InvoiceId = string.Empty;
                return null;
            }

            var invoice = (getInvoiceResponse as JsonResult)?.Value as Invoice;
            if (invoice == null)
            {
                return HttpHelper.Return500Result("Unexpected object returned when getting invoice for reservation id");
            }

            res.InvoiceId = invoice.Id;
            return null;
        }

        // GET: api/reservation/1
        // TODO: add this after reservation microservice is ready.
        [HttpGet("{reservationId}")]
        public async Task<IActionResult> GetReservation(string reservationId)
        {
            string getReservationUrl = $"http://{_reservationsService}/api/reservation/{reservationId}";
            var response = await HttpHelper.GetAsync(getReservationUrl, this.Request);
            if (!response.IsSuccessStatusCode)
            {
                return await HttpHelper.ReturnResponseResult(response);
            }

            var reservationDetails = JsonConvert.DeserializeObject<Reservation>(await response.Content.ReadAsStringAsync());
            var addInvoiceDetailsResponse = await _AddInvoiceDetailsToReservation(this._customConfiguration, reservationDetails);
            if (addInvoiceDetailsResponse != null)
            {
                return addInvoiceDetailsResponse;
            }
            return new JsonResult(reservationDetails);
        }

        // GET: api/reservation/allReservations
        [HttpGet("allReservations")]
        public async Task<IActionResult> GetAllReservations()
        {
            string getAllReservationsUrl = $"http://{_reservationsService}/api/allReservations";
            var response = await HttpHelper.GetAsync(getAllReservationsUrl, this.Request);
            if (!response.IsSuccessStatusCode)
            {
                return await HttpHelper.ReturnResponseResult(response);
            }

            var allReservations = JsonConvert.DeserializeObject<Reservation[]>(await response.Content.ReadAsStringAsync()) ?? new Reservation[0];
            foreach (var res in allReservations)
            {
                var addInvoiceDetailsResponse = await _AddInvoiceDetailsToReservation(this._customConfiguration, res);
                if (addInvoiceDetailsResponse != null)
                {
                    return addInvoiceDetailsResponse;
                }
            }
            return Json(allReservations);
        }

        private async Task<IActionResult> _CreateNewReservationAsync(Reservation reservationDetails)
        {
            string addReservationUrl = $"http://{_reservationsService}/api/reservation";
            var response = await HttpHelper.PostAsync(addReservationUrl, new StringContent(
                JsonConvert.SerializeObject(reservationDetails), Encoding.UTF8, "application/json"), this.Request);
            if (response.IsSuccessStatusCode)
            {
                return new JsonResult(reservationDetails);
            }

            return await HttpHelper.ReturnResponseResult(response);
        }

        // POST: /api/reservation
        [HttpPost]
        public async Task<IActionResult> CreateReservation([FromBody] Reservation reservationDetails)
        {
            if (!ModelState.IsValid)
            {
                return new ContentResult
                {
                    StatusCode = (int)HttpStatusCode.BadRequest,
                    Content = JsonConvert.SerializeObject(ModelState.Values.SelectMany(v => v.Errors))
                };
            }

            try
            {
                // Check valid bike
                var bikeController = new BikeController(Options.Create(this._customConfiguration));
                var bikeResponse = await bikeController.GetBike(reservationDetails.BikeId);
                if (!(bikeResponse is JsonResult))
                {
                    return bikeResponse;
                }
                var bike = (bikeResponse as JsonResult)?.Value as Bike;
                if (bike == null)
                {
                    return new ContentResult()
                    {
                        StatusCode = (int)HttpStatusCode.InternalServerError,
                        Content = "Unexpected type returned from call to get bike"
                    };
                }
                if (!bike.Available.Equals("true", StringComparison.OrdinalIgnoreCase))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, $"BikeId '{reservationDetails.BikeId}' is not available");
                }

                // Check valid customer
                var userController = new UserController(Options.Create(this._customConfiguration));
                var userResponse = await userController.GetUser(reservationDetails.UserId);
                if (!(userResponse is JsonResult))
                {
                    return userResponse;
                }
                var user = (userResponse as JsonResult)?.Value as UserResponse;
                if (user == null)
                {
                    return new ContentResult()
                    {
                        StatusCode = (int)HttpStatusCode.InternalServerError,
                        Content = "Unexpected type returned from call to get customer"
                    };
                }
                if (user.Type != UserType.Customer)
                {
                    return BadRequest("UserId must be a customer");
                }

                reservationDetails.ReservationId = Guid.NewGuid().ToString("N");
                reservationDetails.RequestTime = DateTime.UtcNow.ToString(DateTimeFormat);
                reservationDetails.StartTime = string.IsNullOrEmpty(reservationDetails.StartTime) ? DateTime.UtcNow.ToString(DateTimeFormat) : reservationDetails.StartTime;
                reservationDetails.State = ReservationState.Booking.ToString();
                reservationDetails.EndTime = string.Empty;
                reservationDetails.RequestId = OperationContext.CurrentContext.RequestId.ToString();

                // Create new entry in reservation db and add job to queue for engine to process
                var resResponse = await _CreateNewReservationAsync(reservationDetails);
                if ((resResponse as JsonResult) == null)
                {
                    return resResponse;
                }

                // Update reservation by sending to reservation engine. Should we replace this with a queue?
                var updatedResponse = await _UpdateReservation(reservationDetails);
                if ((updatedResponse as JsonResult) == null)
                {
                    return updatedResponse;
                }
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.ToString());
            }

            return new JsonResult(reservationDetails);
        }

        // POST: /api/reservation/1
        [HttpPost("{reservationId}")]
        public async Task<IActionResult> CompleteReservation(string reservationId)
        {
            try
            {
                string getReservationUrl = $"http://{_reservationsService}/api/reservation/{reservationId}";
                var response = await HttpHelper.GetAsync(getReservationUrl, this.Request);
                if (response.IsSuccessStatusCode)
                {
                    var reservationDetails = JsonConvert.DeserializeObject<Reservation>(await response.Content.ReadAsStringAsync());
                    reservationDetails.State = ReservationState.Completing.ToString();

                    // Update reservation by sending to reservation engine. Should we replace this with a queue?
                    var updatedResponse = await _UpdateReservation(reservationDetails);
                    if ((updatedResponse as JsonResult) == null)
                    {
                        return updatedResponse;
                    }

                    return new JsonResult(reservationDetails);
                }

                return await HttpHelper.ReturnResponseResult(response);
            }
            catch (Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.ToString());
            }
        }
    }
}