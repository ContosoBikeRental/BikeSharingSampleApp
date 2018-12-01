const BikeCard = (props) => (
  <div className="outer">
    <div className="media">
      <img className="mr-3" src={props.imageUrl} alt="photo of bike" />
      <div className="media-body">
        {/* <div>{props.id}</div> */}
        <div className="mt-0 bike-name">{props.name}</div>
        <div>{props.address}</div>
        <div>${props.rate}.00/hour</div>
      </div>
    </div>
    <style jsx>{`
      .media {
        padding: 12px;
      }
      img {
        width: 65px;
      }
      .media-body>div.bike-name {
        font-size: 16px;
        font-weight: bold;
        line-height: 1.2;
        padding-bottom: 10px;
      }
      .media-body>div {
        font-size: 12px;
        line-height: 1.3;
      }
      .outer {
        margin-top: 12px;
        margin-right: 12px;
        // border: 1px solid black;
        box-shadow:0px 2px 10px rgba(65, 65, 65, 0.25);
        cursor: pointer;
      }
    `}</style>
  </div>
)

export default BikeCard