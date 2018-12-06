if [ -z "$1" ]; then
    echo "You must specify a private registry DNS name as first arg"
    exit
fi
if [ -z "$2" ]; then
    echo "You must specify an image tag as second arg"
    exit
fi

docker build -t "$1/ bikes:$2" Bikes/
docker build -t "$1/ gateway:$2" Gateway/
docker build -t "$1/ reservationengine:$2" ReservationEngine/
docker build -t "$1/ users:$2" Users/
docker build -t "$1/ devsite:$2" DevSite/
docker build -t "$1/ billing:$2" Billing/
docker build -t "$1/ reservations:$2" Reservation/
docker build -t "$1/ populatedatabase:$2" PopulateDatabase/
docker build -t "$1/ databases:$2" Databases/
docker build -t "$1/ bikesharingweb:$2" bikesharingweb/


docker push "$1/ bikes:$2"
docker push "$1/ gateway:$2"
docker push "$1/ reservationengine:$2"
docker push "$1/ users:$2"
docker push "$1/ devsite:$2"
docker push "$1/ billing:$2"
docker push "$1/ reservations:$2"
docker push "$1/ populatedatabase:$2"
docker push "$1/ databases:$2"
docker push "$1/ bikesharingweb:$2"