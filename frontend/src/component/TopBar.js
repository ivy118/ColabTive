import React, {useState} from  'react';
import { useDispatch } from 'react-redux';
import './Topbar.css';
import PersonIcon from '@material-ui/icons/Person';
import AddBoxIcon from '@material-ui/icons/AddBox';
import SendIcon from '@material-ui/icons/Send';
import Modal from './Modal';
import { useNavigate } from 'react-router-dom';

const TopBar = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const addCommunityHandler = () => {
    // change state of modal
    dispatch(props.open());
    // open modal
  }

  const [button, setShowButton] = useState();

  const showButton = () => {

  }

  const toChatPage = () => {
    navigate("/message/:user")
  }
    return (
        <div className="topbarContainer">
          <div className="topbarLeft">
              <span className="logo">StudySpace</span>
          </div>

          <div className="topbarRight">
            <div className="topbarIcons">
              <div className="topbarIconItem">
                <AddBoxIcon className="icons" onClick = {addCommunityHandler}>

                </AddBoxIcon>
                <span className="topbarIconBadge">2</span>
              </div>
              <div className="topbarIconItem">
                <SendIcon className="icons" onClick={toChatPage}/>
                <span className="topbarIconBadge">1</span>
              </div>
            </div>
              <img
                src={`https://banner2.cleanpng.com/20190221/gw/kisspng-computer-icons-user-profile-clip-art-portable-netw-c-svg-png-icon-free-download-389-86-onlineweb-5c6f7efd8fecb7.6156919015508108775895.jpg`}
                alt=""
                className="topbarImg"
              />
          </div>
        </div>
    )

}

export default TopBar;