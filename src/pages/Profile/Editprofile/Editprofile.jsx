import React, { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton } from "@mui/material";
import TextField from "@mui/material/TextField";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./Editprofile.css";
import { t } from "i18next";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 8,
};

function Editchild({ dob, setdob }) {
  const [open, setopen] = useState(false);
  const handleopen = () => {
    setopen(true);
  };
  const handleclose = () => {
    setopen(false);
  };
  return (
    <React.Fragment>
      <div className="birthdate-section" onClick={handleopen}>
        <span className="edit-btn">{t("add")}</span>
      </div>
      <Modal
        hideBackdrop
        open={open}
        onClose={handleclose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-descriptiom"
      >
        <Box sx={{ ...style, width: 300, height: 300 }}>
          <div className="text">
            <h2>{t("editDob")}</h2>
            <p>
              {t("dobInfo")}
            </p>
            <input type="date" onChange={(e) => setdob(e.target.value)} />
            <Button
              className="e-button"
              onClick={() => {
                setopen(false);
              }}
            >
              {t("done")}
            </Button>
          </div>
        </Box>
      </Modal>
    </React.Fragment>
  );
}




const Editprofile = ({ user, loggedinuser, refetchUser }) => {
  const [name, setname] = useState("");
  const [username, setusername] = useState("");
  const [bio, setbio] = useState("");
  const [location, setlocation] = useState("");
  const [website, setwebsite] = useState("");
  const [open, setopen] = useState(false);
  const [dob, setdob] = useState("");
  const handlesave = () => {
  const editinfo = {
    name,
    username,
    bio,
    location,
    website,
    dob,
  };

  fetch(`https://twiller-v2.onrender.com/userupdate/${encodeURIComponent(user.email)}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(editinfo),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    })
    .then((data) => {
      console.log("done", editinfo);
      refetchUser();   
      setopen(false);          // ✅ close modal
              // ✅ refresh updated data in Mainprofile
    })
    .catch((err) => {
      console.error(err);
    });
};

  useEffect(() => {
  if (loggedinuser) {
    setname(loggedinuser.name || "");
    setusername(loggedinuser.username || "");
    setbio(loggedinuser.bio || "");
    setlocation(loggedinuser.location || "");
    setwebsite(loggedinuser.website || "");
    setdob(loggedinuser.dob || "");
  }
}, [loggedinuser]);


  return (
    <div>
      <button
        onClick={() => {
          setopen(true);
        }}
        className="Edit-profile-btn"
      >
        {t("editProfile")}
      </button>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-descriptiom"
      >
        <Box style={style} className="modal">
          <div className="header">
            <IconButton onClick={() => setopen(false)}>
              <CloseIcon />
            </IconButton>
            <h2 className="header-title">{t("editProfile")}</h2>
            <button className="save-btn" onClick={handlesave}>{t("save")}</button>
          </div>
          <form className="fill-content">
            <TextField
              className="text-field"
              fullWidth
              label={t("name")}
              id="fullWidth"
              variant="filled"
              onChange={(e) => setname(e.target.value)}
              defaultValue={loggedinuser?.name || ""}
            />
            <TextField
              className="text-field"
              fullWidth
              label={t("username")}
              id="fullWidth"
              variant="filled"
              onChange={(e) => setusername(e.target.value)}
              defaultValue={loggedinuser?.username || ""}
            />
            <TextField
              className="text-field"
              fullWidth
              label={t("bio")}
              id="fullWidth"
              variant="filled"
              onChange={(e) => setbio(e.target.value)}
              defaultValue={loggedinuser?.bio || ""}
            />
            <TextField
              className="text-field"
              fullWidth
              label={t("location")}
              id="fullWidth"
              variant="filled"
              onChange={(e) => setlocation(e.target.value)}
              
              defaultValue={loggedinuser?.location || ""}
              
            />
            <TextField
              className="text-field"
              fullWidth
              label={t("website")}
              id="fullWidth"
              variant="filled"
              onChange={(e) => setwebsite(e.target.value)}
              defaultValue={
                loggedinuser?.website || ""
              }
            />
          </form>
          <div className="birthdate-section">
            <p>{t("birthDate")}</p>
            <Editchild dob={dob} setdob={setdob} />
          </div>
          <div className="last-section">
            {loggedinuser?.dob ? (
              <h2>{loggedinuser?.dob}</h2>
            ) : (
              <h2>{dob ? dob : t("addDob")}</h2>
            )}
            <div className="last-btn">
              <h2>{t("switchToProfessional")}</h2>
              <ChevronRightIcon />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Editprofile;