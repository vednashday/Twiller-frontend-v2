import React, { useState, useEffect } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreIcon from "@mui/icons-material/More";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Divider from "@mui/material/Divider";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Avatar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "./sidebar.css";
import Sidebaroption from "./Sidebaroption";
import Customlink from "./Customlink";
import CreateIcon from "@mui/icons-material/Create";
import { useNavigate } from "react-router";
import useLoggedinuser from "../../hooks/useLoggedinuser";
import profImg from "../../image/default-profile.jpg"
import { Upgrade, UpgradeRounded } from "@mui/icons-material";


const Sidebar = ({ handlelogout, user }) => {
  const [anchorE1, setAnchorE1] = useState(null);
  const openmenu = Boolean(anchorE1);
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 1150);
  const [loggedinuser] = useLoggedinuser();
  const navigate = useNavigate();

  const handleClick = (e) => {
    setAnchorE1(e.currentTarget);
  };

  const handleclose = () => {
    setAnchorE1(null);
  };

  const result = loggedinuser?.username;

  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth <= 1150);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="sidebar">
      <div className="sidelinks">
        <TwitterIcon className="sidebar__twitterIcon" />
        <Customlink to="/home/feed">
          <Sidebaroption active Icon={HomeIcon} text="Home" />
        </Customlink>
        <Customlink to="/home/explore">
          <Sidebaroption active Icon={SearchIcon} text="Explore" />
        </Customlink>
        <Customlink to="/home/notification">
          <Sidebaroption Icon={NotificationsNoneIcon} text="Notifications" />
        </Customlink>
        <Customlink to="/home/messages">
          <Sidebaroption Icon={MailOutlineIcon} text="Messages" />
        </Customlink>
        <Customlink to="/home/bookmarks">
          <Sidebaroption Icon={BookmarkBorderIcon} text="Bookmarks" />
        </Customlink>
        <Customlink to="/home/lists">
          <Sidebaroption Icon={ListAltIcon} text="Lists" />
        </Customlink>
        <Customlink to="/home/profile">
          <Sidebaroption Icon={PermIdentityIcon} text="Profile" />
        </Customlink>
        <Customlink to="/home/subscription">
          <Sidebaroption Icon={UpgradeRounded} text="Upgrade" />
        </Customlink>

        {/* Hide More when collapsed */}
        {!isCollapsed && (
          <Customlink to="/home/more">
            <Sidebaroption Icon={MoreIcon} text="More" />
          </Customlink>
        )}

        <div className="tweet-button-wrapper">
          <Customlink to="/home/feed">
          <Button
            variant="outlined"
            className="sidebar__tweet tweet-full"
            fullWidth
          >
            Tweet
          </Button>
        </Customlink>
          
          <IconButton className="sidebar__tweet tweet-icon">
            <CreateIcon />
          </IconButton>
        </div>
      </div>

      {/* Profile Avatar + Info / Collapsed Menu Trigger */}
      <div
        className="Profile__info"
        onClick={isCollapsed ? handleClick : undefined}
      >
        <Avatar
          src={
            loggedinuser?.profileImage
              ? loggedinuser.profileImage
              : profImg
          }
        />
        {!isCollapsed && (
          <>
            <div className="user__info">
              <div className="tcont">
                <h4 className="long-name">{loggedinuser?.name || user?.displayName}</h4>
              </div>
              <div className="tcont">
                <h5>@{result}</h5>
              </div>
            </div>
              
            <div className="dots_icon">
            <IconButton
              size="small"
              aria-controls={openmenu ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openmenu ? "true" : undefined}
              onClick={handleClick}
            >
              <MoreHorizIcon />
            </IconButton>
            </div>
            
          </>
        )}
      </div>

      {/* Profile Dropdown Menu */}
      <Menu
        id="basic-menu"
        anchorEl={anchorE1}
        open={openmenu}
        onClose={handleclose}
      >
        <MenuItem
          className="Profile__info1"
          onClick={() => {
            navigate("/home/profile");
            handleclose();
          }}
        >
          <Avatar
            src={
              loggedinuser?.profileImage
                ? loggedinuser.profileImage
                : profImg
            }
          />
          <div className="subUser__info">
            <div>
              <div className="tcont">
                <h4 className="long-name">{loggedinuser?.name || user?.displayName}</h4>
              </div>
              <div className="tcont">
                <h5>@{result}</h5>
              </div>
            </div>
            <ListItemIcon className="done__icon" color="blue">
              <DoneIcon />
            </ListItemIcon>
          </div>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleclose}>Add an existing account</MenuItem>
        <MenuItem onClick={handlelogout}>Log out @{result}</MenuItem>
      </Menu>
    </div>
  );
};

export default Sidebar;
