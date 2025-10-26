import { excel, pdf } from "../../utils/imagepath";
import { Link } from "react-router";
import { Tooltip } from "primereact/tooltip";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setToggleHeader } from "../../core/redux/sidebarSlice";

const TableTopHead = ({ onPdf, onExcel, onRefresh }) => {
  const dispatch = useDispatch();
  const { toggleHeader } = useSelector((state) => state.sidebar);
  const handleToggleHeader = () => {
    dispatch(setToggleHeader(!toggleHeader));
  };
  return (
    <>
      <Tooltip target=".pr-tooltip" />
      <ul className="table-top-head">
        <li>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); if (onPdf) onPdf(); }}
            className="pr-tooltip"
            data-pr-tooltip="Pdf"
            data-pr-position="top">
            <img src={pdf} alt="img" />
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); if (onExcel) onExcel(); }}
            className="pr-tooltip"
            data-pr-tooltip="Excel"
            data-pr-position="top">
            <img src={excel} alt="img" />
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); if (onRefresh) onRefresh(); }}
            className="pr-tooltip"
            data-pr-tooltip="Refresh"
            data-pr-position="top">
            <i className="ti ti-refresh" />
          </a>
        </li>
        <li>
          <a
            href="#"
            className="pr-tooltip"
            data-pr-tooltip="Collapse"
            data-pr-position="top"
            id="collapse-header"
            onClick={(e) => { e.preventDefault(); handleToggleHeader(); }}>
            <i className={`ti  ${toggleHeader ? "ti-chevron-down" : "ti-chevron-up"}`} />
          </a>
        </li>
      </ul>
    </>);

};

export default TableTopHead;