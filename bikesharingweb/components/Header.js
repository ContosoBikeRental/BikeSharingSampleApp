import Link from 'next/link'

function Command (props) {
    var icon = "lnr-menu";
    var url = "/signin";

    if (props.cmd == "back") {
        icon = "lnr-arrow-left";
        url = "/";
    }

    return (
        <div>
            <Link href={url}>
                {/* <span className="lnr lnr-menu"></span> */}
                <span className={`lnr ${icon}`}></span>
            </Link>
            <style jsx>{`
            .lnr {
                cursor: pointer;
                font-size:22px;
                color: #4D6059;
                padding-left:10px;
            }
            `}</style>
        </div>
    );
}

const Header = (props) => (
    <div className="row">
        <div className="col">
            <Command cmd={props.cmd}/>
            {/* <Link href="/signin">
                <span className="lnr lnr-menu"></span>
            </Link> */}
        </div>
        <div className="col logo">
            <Link href="/">
                <img src="/static/awc-title.svg" alt="Adventure Works Cycles" />
            </Link>
        </div>
        <div className="col"></div>
        <style jsx>{`
        .row {
            padding-top: 12px;
            background-color: #fff;
            min-height: 48px;
            box-shadow:0px 2px 10px rgba(65, 65, 65, 0.25);
        }
        div {
          padding: 0;
          margin: 0;
        }
        .container {
            background-color: #fff;
            min-height: 48px;
            box-shadow:0px 2px 10px rgba(65, 65, 65, 0.25);
        }
        .logo {
            cursor: pointer;
            text-align: center;
        }
      `}</style>
    </div>
)

export default Header