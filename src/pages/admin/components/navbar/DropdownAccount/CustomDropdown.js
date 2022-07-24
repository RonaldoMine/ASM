import {Dropdown, Menu} from "antd";
import {Link} from "react-router-dom";

//Custom Dropdown to show in header
function CustomDropdown({menuDatas, icon}) {
    var menu = <Menu items={menuDatas}></Menu>
    return (
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <Link to="#" onClick={e => e.preventDefault()}>
                { icon }
            </Link>
        </Dropdown>
    );
}

export default CustomDropdown