import {Spin} from "antd";

function CustomLoader() {
    return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%"}}>
            <Spin></Spin></div>
    );
}

export default CustomLoader