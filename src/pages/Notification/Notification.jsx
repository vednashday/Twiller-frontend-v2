import React from "react";
import "../pages.css"
import { useTranslation } from "react-i18next";

const Notification = () => {
  const { t } = useTranslation();
  return (
    <div className="page">
      <h2 className="pageTitle">{t('welcome_notifications_page')}</h2>
    </div>
  );
};

export default Notification;
