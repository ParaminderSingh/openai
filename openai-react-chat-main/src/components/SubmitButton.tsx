import React from "react";
import {
  EllipsisHorizontalIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import "./SubmitButton.css";
import Tooltip from "./Tooltip";
import { useTranslation } from "react-i18next";

interface SubmitButtonProps {
  loading: boolean;
  disabled: boolean;
  name?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  loading,
  disabled,
  name,
}) => {
  const { t } = useTranslation();
  const strokeColor = disabled ? "currentColor" : "white";

  return (
    <button
      name={name}
      type="submit"
      disabled={loading || disabled}
      className="absolute bottom-2 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-base"
    >
      Send <span className="sr-only">Send message</span>
      {/* {loading ? (
        <EllipsisHorizontalIcon
          className="animate-ellipsis-pulse"
          width={24}
          height={24}
          stroke={strokeColor}
        />
      ) : (
        <PaperAirplaneIcon width={24} height={24} />
      )} */}
    </button>
  );
};
