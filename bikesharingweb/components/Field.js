const Field = (props) => (
  <div>
    <div className="fieldLabel">{props.label}</div>
    <div className="fieldValue">{props.value}</div>
    <style jsx>{`
      .fieldLabel {
        padding-top: 12px;
        text-transform: uppercase;
        font-size: 10px;
        font-weight: 600;
      }
      .fieldValue {
        font-size: 14px;
        font-weight: 100;
      }
      div {
        color: #2A3531;
        letter-spacing: 1px;
      }
  `}</style>
  </div >
)

export default Field