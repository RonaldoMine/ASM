//For display avatr with name
import {Avatar} from "antd";

function CustomAvatarUser({value, color = "#cccccc"}) {
    return (
        <>
            <div style={{display: "flex", alignItems: "center"}}>
                <Avatar style={{ marginRight: 7, background: color}}>{value[0]}</Avatar> {value}
            </div>
        </>
    )
}

export default CustomAvatarUser