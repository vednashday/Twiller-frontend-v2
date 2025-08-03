import React from 'react'
import "../pages.css"
import { useTranslation } from "react-i18next";

const Explore = () => {
  const { t } = useTranslation();
  return (
    <div className="page">
      <h2 className="pageTitle">{t('welcome_explore_page')}</h2>
    </div>
  )
}

export default Explore
