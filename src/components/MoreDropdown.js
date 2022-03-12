import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/MoreDropdown.module.css";

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <div className="bg-white rounded opaque hoverable text-center">
    <i
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="fas fa-ellipsis-v px-4 py-3"
      ref={ref}
    />
  </div>
));

export const MoreDropdown = ({ handleEdit, handleDelete, standalone }) => {
  return (
    <Dropdown
      className={`ml-auto mr-3 hoverable ${styles.Absolute} ${
        standalone && "mt-3 border border-gray rounded"
      }`}
      drop="left"
    >
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu className="py-0 text-center">
        <Dropdown.Item
          className={styles.DropdownItem}
          aria-label="edit-profile"
          onClick={handleEdit}
        >
          <i className="fas fa-edit" /> edit
        </Dropdown.Item>
        {handleDelete && (
          <Dropdown.Item
            className={styles.DropdownItem}
            aria-label="delete"
            onClick={handleDelete}
          >
            <i className="fas fa-trash-alt" /> delete
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
