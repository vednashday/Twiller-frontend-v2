import React from 'react'
import '../pages.css'
import { useTranslation } from "react-i18next";

const Bookmark = () => {
  const { t } = useTranslation();
  return (
    <div className="page">
      <h2 className="pageTitle">{t('welcome_bookmark_page')}</h2>
    </div>
  )
}

export default Bookmark
