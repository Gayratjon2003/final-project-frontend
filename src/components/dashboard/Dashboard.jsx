import React from "react";

import { Link } from "react-router-dom";
import { routes } from "../../constant";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  return (
    <section className="pt-20 dashboard">
      <div className="container">
        <div className="dashboard-box my-10">
          <ul className="flex items-center justify-center flex-col gap-y-3 max-sm:text-center">
            {user?.isAdmin && (
              <>
                <li className="text-3xl hover:text-green-500">
                  <Link to={routes.DASHBOARD.USERS}>
                    {t("dashboard.users")}
                  </Link>
                </li>
                <li className="text-3xl hover:text-green-500">
                  <Link to={routes.DASHBOARD.CATEGORIES}>
                    {t("dashboard.categories")}
                  </Link>
                </li>
              </>
            )}
            <li className="text-3xl hover:text-green-500">
              <Link to={routes.DASHBOARD.COLLECTIONS}>
                {t("dashboard.collections")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
