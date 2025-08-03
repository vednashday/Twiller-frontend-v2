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
import { useTranslation } from "react-i18next";
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
import profImg from "../../image/default-profile.jpg";
import { Upgrade, UpgradeRounded } from "@mui/icons-material";
import LanguageSelector from "../../component/Language/LanguageSelector";

const Sidebar = ({ handlelogout, user }) => {
  // State for the profile dropdown menu
  const [anchorE1, setAnchorE1] = useState(null);
  const openmenu = Boolean(anchorE1);
  
  // Translation hooks for text and language control
  const { t, i18n } = useTranslation();

  // State for the responsive sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth <= 1150);

  // State for the language change modal
  const [openLangModal, setOpenLangModal] = useState(false);

  // Custom hooks and router navigation
  const [loggedinuser] = useLoggedinuser();
  const navigate = useNavigate();

  // Handlers for the profile dropdown menu
  const handleClick = (e) => {
    setAnchorE1(e.currentTarget);
  };
  const handleclose = () => {
    setAnchorE1(null);
  };

  // Handler to open the language change modal
  const handleOpenLangModal = () => {
    handleclose(); // Close the profile menu first
    setOpenLangModal(true);
  };

  // Handler to close the language change modal
  const handleCloseLangModal = () => {
    setOpenLangModal(false);
  };

  // Callback function to change the language and close the modal
  const handleLanguageChange = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    handleCloseLangModal();
  };

  const result = loggedinuser?.username;

  // Effect to handle window resizing for responsive design
  useEffect(() => {
    const handleResize = () => setIsCollapsed(window.innerWidth <= 1150);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="sidebar">
        <div className="sidelinks">
          <TwitterIcon className="sidebar__twitterIcon" />
          <Customlink to="/home/feed">
            <Sidebaroption active Icon={HomeIcon} text={t("Home")} />
          </Customlink>
          <Customlink to="/home/explore">
            <Sidebaroption active Icon={SearchIcon} text={t("Explore")} />
          </Customlink>
          <Customlink to="/home/notification">
            <Sidebaroption Icon={NotificationsNoneIcon} text={t("Notifications")} />
          </Customlink>
          <Customlink to="/home/messages">
            <Sidebaroption Icon={MailOutlineIcon} text={t("Messages")} />
          </Customlink>
          <Customlink to="/home/bookmarks">
            <Sidebaroption Icon={BookmarkBorderIcon} text={t("Bookmarks")} />
          </Customlink>
          <Customlink to="/home/lists">
            <Sidebaroption Icon={ListAltIcon} text={t("Lists")} />
          </Customlink>
          <Customlink to="/home/profile">
            <Sidebaroption Icon={PermIdentityIcon} text={t("Profile")} />
          </Customlink>
          <Customlink to="/home/subscription">
            <Sidebaroption Icon={UpgradeRounded} text={t("Upgrade")} />
          </Customlink>

          {/* Hide More when collapsed */}
          {!isCollapsed && (
            <Customlink to="/home/more">
              <Sidebaroption Icon={MoreIcon} text={t("More")} />
            </Customlink>
          )}

          <div className="tweet-button-wrapper">
            <Customlink to="/home/feed">
              <Button
                variant="outlined"
                className="sidebar__tweet tweet-full"
                fullWidth
              >
                {t("Tweet")}
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
          <MenuItem onClick={handleclose}>{t("Add an existing account")}</MenuItem>
          <MenuItem onClick={handleOpenLangModal}>{t("Change Language")}</MenuItem>
          <MenuItem onClick={handlelogout}>{t("Log out")} @{result}</MenuItem>
        </Menu>
      </div>

      {/* Language Change Modal */}
      {openLangModal && (
        <div className="modal-overlay" onClick={handleCloseLangModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <button className="modal-close-button" onClick={handleCloseLangModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <LanguageSelector onLanguageChange={handleLanguageChange} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
