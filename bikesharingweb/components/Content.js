const Content = (props) => (
  <div className="content-container">
    {props.children}
    <br /><br /><br /><br />
    <style jsx>{`
      .content-container {
        padding-top: 10px;
        padding-bottom: 10px;
        margin:auto;
        width: 90%;
      }
      `}</style>
  </div>
)

export default Content